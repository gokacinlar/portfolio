import CustomWebHaptics from "../webHaptics";

export function applyHapticsToModals(): () => void {
    const modalElements = [
        ...document.querySelectorAll("component-custom-button[data-modal]"),
        ...document.querySelectorAll("button[data-modal]")
    ] as HTMLElement[];

    const haptics = CustomWebHaptics.getInstance();
    const cleanups: Array<() => void> = [];

    modalElements.forEach(element => {
        const handler = (e: MouseEvent) => {
            if (e.target) {
                haptics.triggerHaptic("success");
            }
        };
        element.addEventListener("click", handler);
        cleanups.push(() => element.removeEventListener("click", handler));
    });

    return () => {
        cleanups.forEach((fn) => fn());
    };
}
