export const domSanitizeOptions: Object = {
    ADD_ATTR: ["nonce"],
    CUSTOM_ELEMENT_HANDLING: {
        tagNameCheck: /^[a-z]+-/,
        attributeNameCheck: /.*/,
        allowCustomizedBuiltInElements: true,
    }
}