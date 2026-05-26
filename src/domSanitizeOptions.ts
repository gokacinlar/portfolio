export const domSanitizeOptions = {
    ADD_ATTR: ["nonce"],
    CUSTOM_ELEMENT_HANDLING: {
        tagNameCheck: /^[a-z]+-/,
        attributeNameCheck: /.*/,
        allowCustomizedBuiltInElements: true,
    }
}