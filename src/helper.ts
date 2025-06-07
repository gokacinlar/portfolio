// Create a template content to be appended to every Light DOM
export class Template {
    public createTemplate(content: any): HTMLTemplateElement {
        const template = document.createElement("template");
        template.innerHTML = `
            ${content}
        `;
        return template;
    }
}