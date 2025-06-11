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

// For DOM Manipulation

export class DomEvents {
    public headerRightActions(elem: HTMLButtonElement) {
        const textSpan = elem.querySelector(".hr-btn-text") as HTMLElement;
        elem.addEventListener("mouseover", () => {
            textSpan.textContent = "For your web demands...";
        });

        elem.addEventListener("mouseleave", () => {
            textSpan.textContent = "Hire me!";
        });
    }

    public dayNightModeSwitching(elem: HTMLButtonElement, elemToBeManip: string) {
        // Flag for reversing roles
        let reset = true;
        elem.addEventListener("click", () => {
            const dayNightModeSwitchingBtn = document.querySelector(`${elemToBeManip}`) as HTMLElement;
            if (reset) {
                dayNightModeSwitchingBtn.classList.remove("bi-sun");
                dayNightModeSwitchingBtn.classList.add("bi-moon-stars");
            } else {
                dayNightModeSwitchingBtn.classList.remove("bi-moon-stars");
                dayNightModeSwitchingBtn.classList.add("bi-sun");
            }
            // Reset the flag
            reset = !reset;
        });
    }
}
