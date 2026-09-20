/**
 * --- AI WRITTEN ---
 * Optimizes src/assets/3d/desk.glb WITHOUT Draco / meshopt / KTX compression.
 *
 * Why no Draco/meshopt? Both need a WebAssembly decoder in the browser
 * (meshopt_decoder.module.js calls WebAssembly.instantiate() on import,
 * DRACOLoader fetches draco_decoder.wasm + spawns blob: workers), which our
 * Content-Security-Policy deliberately blocks. Everything this script does
 * decodes natively in three.js, so no CSP change is required:
 *
 *  - PNG -> WebP (sharp, build-time only): ~11 MB of textures -> ~2-3 MB
 *  - weld(): merges duplicate vertices (build-time meshoptimizer, no runtime decoder)
 *  - quantize(): KHR_mesh_quantization, decoded natively by three.js
 *  - dedup()/prune(): drops unused buffers/accessors
 *
 * Usage: npm run optimize:glb
 * Output: src/assets/3d/desk.optimized.glb (review it, then swap it in).
 */

import { NodeIO } from "@gltf-transform/core";
import { dedup, prune, quantize, weld } from "@gltf-transform/functions";
import sharp from "sharp";

const INPUT = "src/assets/3d/desk.glb";
const OUTPUT = "src/assets/3d/desk.optimized.glb";
const MAX_TEXTURE_SIZE = 2048;
const WEBP_QUALITY = 80;

async function main(): Promise<void> {
    const io = new NodeIO();
    const document = await io.read(INPUT);

    // 1. Re-encode embedded PNG textures as WebP (biggest win: ~11 MB -> ~2-3 MB).
    for (const texture of document.getRoot().listTextures()) {
        const image = texture.getImage();
        if (!image) continue;

        const meta = await sharp(image).metadata();
        console.log(
            `Texture "${texture.getName() || "(unnamed)"}": ` +
            `${texture.getMimeType()} ${meta.width}x${meta.height} ` +
            `${(image.byteLength / 1024 / 1024).toFixed(2)} MB`
        );

        let pipeline = sharp(image).rotate(); // honor EXIF orientation
        if ((meta.width ?? 0) > MAX_TEXTURE_SIZE || (meta.height ?? 0) > MAX_TEXTURE_SIZE) {
            pipeline = pipeline.resize(MAX_TEXTURE_SIZE, MAX_TEXTURE_SIZE, {
                fit: "inside",
                withoutEnlargement: true,
            });
        }
        const webp = await pipeline.webp({ quality: WEBP_QUALITY, effort: 6 }).toBuffer();
        texture.setImage(new Uint8Array(webp));
        texture.setMimeType("image/webp");
        console.log(`  -> image/webp ${(webp.byteLength / 1024 / 1024).toFixed(2)} MB`);
    }

    // 2. Geometry + document transforms. All runtime-decoder-free.
    await document.transform(
        dedup(),
        prune(),
        weld(),
        quantize({
            pattern: /^(POSITION|NORMAL|TEXCOORD|COLOR|JOINTS|WEIGHTS)$/,
            quantizePosition: 14,
            quantizeNormal: 10,
            quantizeTexcoord: 12,
            quantizeColor: 8,
            quantizeGeneric: 12,
        })
    );

    await io.write(OUTPUT, document);
    console.log(`Wrote ${OUTPUT}`);
}

main().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
});
