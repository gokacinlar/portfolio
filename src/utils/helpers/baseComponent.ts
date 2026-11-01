abstract class BaseComponent extends HTMLElement {
    connectedCallback(): void {
        const template = this.render();

        if (template.trim()) {
            this.innerHTML = template;
        }
    }

    attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
        if (this.isConnected && oldValue !== newValue) {
            this.render();
        }
    }

    disconnectedCallback(): void {
        // Override in subclasses for cleanup
    }

    abstract render(): string;
}

export default BaseComponent;