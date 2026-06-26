import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

class ThreeJs {
    private base = THREE;
    private scene = new this.base.Scene();
    private camera = new this.base.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    private renderer = new this.base.WebGLRenderer();
    private loader = new GLTFLoader();
    private controls!: OrbitControls;
    private readonly AMBIENT_COLOR: string = "#D4A25B";
    private isAnimating: boolean = true; // Animation state
    private animationFrameId: number | null = null;

    constructor(containerSelector: string) {
        this.setupRenderer(containerSelector);
        this.setupCamera();
        this.setupControls();
        this.setupLighting();
        this.startAnimation();
        this.observeElement(containerSelector);
    }

    private async setupRenderer(containerSelector: string): Promise<void> {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);

        const container = document.querySelector(containerSelector);
        if (container) {
            container.appendChild(this.renderer.domElement);
        } else {
            console.error("Unable to find target container for 3JS renderer.");
            return;
        }

        window.addEventListener("resize", () => this.onWindowResize());
    }

    private setupControls(): void {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 4;
    }

    private setupCamera(): void {
        this.camera.position.z = 5;
    }

    private setupLighting(): void {
        const ambientLight = new this.base.AmbientLight(0xD4A25B, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new this.base.DirectionalLight(0xD4A25B, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
    }

    // Actually load the model
    public loadModel(modelPath: string): void {
        this.loader.load(
            modelPath, (gltf) => {
                const model = gltf.scene;
                // Add a slightly yellow ambient color
                const ambientLight = new this.base.AmbientLight(this.AMBIENT_COLOR, 0.5)
                this.scene.add(model);
                this.scene.add(ambientLight);

                this.centerAndScaleModel(model);
            }, (_progress) => {
                // console.log(`Loading: ${(progress.loaded / progress.total * 100).toFixed(2)}%`);
            }, (error) => {
                console.error("Error loading GLTF model:", error);
            }
        );
    }

    private centerAndScaleModel(model: THREE.Group): void {
        const box = new this.base.Box3().setFromObject(model);
        const center = box.getCenter(new this.base.Vector3());
        model.position.sub(center);

        const size = box.getSize(new this.base.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 6 / maxDim; // A little bit smaller is preffered
        model.scale.multiplyScalar(scale);
    }

    private startAnimation(): void {
        const animate = () => {
            if (this.isAnimating) { // Update the animation based on intersection observer's state
                this.animationFrameId = requestAnimationFrame(animate);
                this.controls.update();
                this.renderer.render(this.scene, this.camera);
            } else {
                this.animationFrameId = requestAnimationFrame(animate);
            }
        };

        animate();
    }

    // Responsive design related adjustments
    private onWindowResize(): void {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    // Intersection Observer
    public observeElement(targetSelector: string): void {
        const targetElement = document.querySelector(targetSelector);

        if (!targetElement) {
            console.error(`Element with selector "${targetSelector}" not found.`);
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: "10px",
            threshold: 0.1, // Trigger when at least 10% is visible
        };

        const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.isAnimating = true;
                    this.controls.autoRotate = true;
                } else {
                    this.isAnimating = false;
                    this.controls.autoRotate = false;
                }
            });
        }, observerOptions);

        observer.observe(targetElement);
    }
}

export default ThreeJs;