import ScrollReveal from "scrollreveal";

// Function to scroll horizontally in desired div
export class HorizontalMiddleMouseScroll {
    // hmmsScroll now returns a cleanup function
    public hmmsScroll(element: string): () => void {
        const elem = document.querySelector(element) as HTMLElement;
        if (!elem) return () => { }; // Return a no-op cleanup if element not found

        let isScrolling: boolean = false;
        let targetScrollLeft: number = elem.scrollLeft;

        // Function to handle scroll behavior
        const handleScroll = (e: WheelEvent) => {
            e.preventDefault();

            // Move the content in Y axis with deltaY property
            const scrollAmount = e.deltaY < 0 ? -35 : 35;
            targetScrollLeft += scrollAmount;

            if (!isScrolling) {
                isScrolling = true;
                requestAnimationFrame(() => {
                    elem.scrollTo({
                        left: targetScrollLeft,
                        behavior: "smooth"
                    });
                    isScrolling = false;
                });
            }
        };

        // Function to check viewport and toggle scroll behavior
        const updateScrollBehavior = () => {
            const isMobileView: boolean = window.innerWidth <= 1024;

            // Remove existing listener to avoid duplicates
            elem.removeEventListener("wheel", handleScroll);

            // Add listener only in mobile view
            if (isMobileView) {
                elem.addEventListener("wheel", handleScroll);
            }
        };

        // Initial check
        updateScrollBehavior();

        // Listen for window resize events to update behavior
        window.addEventListener("resize", updateScrollBehavior);

        // Return a cleanup function for all listeners added by this instance
        return () => {
            elem.removeEventListener("wheel", handleScroll);
            window.removeEventListener("resize", updateScrollBehavior);
        };
    }
}

export class ScrollRevealAction {
    public scrollReveal(classes: Array<string>) {
        for (const id of classes) {
            ScrollReveal().reveal(`.${id}`), { delay: 15000 };
        }
    }
}

export function addBackgroundBasedOnVerticalScroll(mainElement: string, target: string, className: string): () => void {
    const mainHtmlElement = document.getElementById(mainElement) as HTMLElement;
    const targetHtmlElement = document.getElementById(target) as HTMLElement;

    if (!mainHtmlElement && !targetHtmlElement) {
        console.warn(`Elements with id "${mainElement} and ${target}" not found`);
        return () => { };
    }

    const handleScroll = () => {
        if (mainHtmlElement.scrollTop > 15) {
            targetHtmlElement.classList.add(className);;
        } else if (mainHtmlElement.scrollTop <= 15) {
            targetHtmlElement.classList.remove(className);
        }
    };

    mainHtmlElement.addEventListener("scroll", handleScroll);
    handleScroll();

    // Return a clean state after all
    return () => mainHtmlElement.removeEventListener("scroll", handleScroll);
}
