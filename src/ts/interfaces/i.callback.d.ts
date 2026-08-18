export interface RequiredCallbacksOnComponent {
    attributeChangedCallback?(
        name?: string,
        oldValue?: string,
        newValue?: string,
    ): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
}