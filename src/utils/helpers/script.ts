import { WhiteListedURLs } from "../../static";
import { generateNonce } from "./template";

interface ScriptOptions {
    scriptItself: string;
    target: HTMLElement;
    attributes?: ScriptAttributes;
}

interface ScriptAttributes {
    src?: string | null;
    defer?: boolean;
    async?: boolean;
    nonce?: string;
    crossorigin?: "anonymous" | "use-credentials";
}

// Function to insert custom script into the page
export function insertApprovedScript({ scriptItself, target, attributes = {} }: ScriptOptions): HTMLScriptElement {
    if (!target) {
        throw new Error(`Unable to insert script. ${target} element does not exist.`);
    }

    // Validate script source against the whitelist
    if (!WhiteListedURLs.approvedScripts.has(scriptItself)) {
        throw new Error(`Script source ${scriptItself} is not approved. Aborting procedure...`);
    }

    try {
        const element = document.createElement("script") as HTMLScriptElement;
        element.src = scriptItself;
        element.defer = attributes.defer ?? false;
        element.async = attributes.async ?? false;

        // Generate nonce for each creation
        const nonceGenerated = generateNonce();
        element.nonce = nonceGenerated;
        target.appendChild(element);
        return element;
    } catch (error: unknown) {
        throw new Error(`Failed to create script ${scriptItself}: ${error}`);
    }
}
