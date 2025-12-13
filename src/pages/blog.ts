import DOMPurify from "dompurify";
import WordPressGraphQLClient from "../utils/wp_graphql";
import { Template } from "../utils/helper";

interface Author {
    name: string;
}

interface Post {
    id: string;
    title: string;
    author: Author;
    content: string;
    url: string;
}

interface PostPreview {
    id: string;
    title: string;
    author: Author;
}

class Updates extends HTMLElement {
    constructor() {
        super();

        new Template().createTemplate(this.render(), this);
        this.connectedCallback();
    }

    private render(): string {
        return `
            <section class="container-fluid h-100">
                <div id="blogContainer" class="row gx-3 mb-3 h-100">
                    <div class="bwrapper col-md-4 col-lg-4 col-sm h-100">
                        ${this.blogAside()}
                        ${this.offCanvas()}
                        ${this.initiateOffCanvas()}
                    </div>
                    <div class="bwrapper col-md-8 col-lg-8 col-sm h-100">
                        <main id="blogMain" class="h-100 rounded-5 px-3 py-3 shadow-sm">
                        </main>
                    </div>
                </div>
            </section>
        `;
    }

    private initiateOffCanvas() {
        return `
            <div id="offCanvasControls" class="d-flex flex-row align-items-center justify-content-end" role="group" aria-label="Blog Post Display Settings">
                <button class="btn btn-sm btn-warning rounded-pill shadow-sm" type="button" id="displayOffCanvasBtn" data-bs-toggle="offcanvas" data-bs-target="#blogAsideOffcanvasTemplate"
                    aria-controls="blogAsideOffcanvasTemplate" title="Display menu to see posts.">
                    <i class="offcanvas-menu-icon bi bi-list display-6 fw-bold"></i>
                </button>
            </div>
        `;
    }

    private blogAside(): string {
        return `
            <aside id="blogAside" class="h-100 rounded-5 px-3 py-3 shadow-sm">
                <section id="blogAsideChild" class="rounded-5 h-100 px-3 py-3 border border-1 border-dark-subtle"></section>
            </aside>
        `;
    }

    private offCanvas(): string {
        return `
            <div class="offcanvas offcanvas-start rounded-end-4 w-75" tabindex="-1" id="blogAsideOffcanvasTemplate" aria-labelledby="blogAsideOffcanvas" data-bs-scroll="true" data-bs-backdrop="true">
                <div class="offcanvas-header bg-secondary-subtle rounded-end-4">
                    <h5 class="offcanvas-title" id="blogAsideOffcanvas">Latest updates</h5>
                    <button id="dismissOffcanvasBtn" type="button" class="btn btn-sm btn-close fs-5 fw-bold" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div id="offCanvasArea" class="offcanvas-body">

                </div>
            </div>
        `;
    }

    private async generateDomElementsRelatedToBlogsInAside(targetElement: string, data: PostPreview[]) {
        try {
            const element = this.querySelector(`#${targetElement}`) as HTMLElement | null;
            if (!element) {
                console.error(`Element with id "${targetElement}" not found`);
                return;
            }

            // Check if data is empty or undefined
            if (!data || data.length === 0) {
                console.warn("No blog posts have been found");
                element.innerHTML = `
                    <div class="d-flex flex-column align-items-center justify-content-center">
                        <h1>☹</h1>
                        <h2>No blog posts <em>are available.</em></h2>
                    </div>
                `;
                return;
            }

            // Clear existing content first to avoid conflictions
            element.innerHTML = "";

            // Create and append each post button with event listener
            data.forEach((item: PostPreview) => {
                try {
                    const title: string = item.title || "Untitled Post";
                    const authorName: string = item.author?.name || "Unknown Author";

                    const button = document.createElement("button") as HTMLButtonElement;
                    button.type = "button";
                    button.className = "blog-post-link btn btn-sm fs-5 d-flex flex-row gap-2 align-items-center justify-content-between w-100 py-2 px-2 bg-secondary-subtle rounded-pill link-offset-2 link-underline link-underline-opacity-0 mb-2";
                    button.dataset.postId = item.id; // Store the post ID for fetching

                    const buttonContent = `
                        <span class="bg-primary-subtle rounded-pill py-1 px-2 flex-grow-1 text-start">${title}</span>
                        <small class="bg-primary-subtle py-1 px-2 rounded-pill">${authorName}</small>
                    `;
                    button.innerHTML = DOMPurify.sanitize(buttonContent);

                    // Actually load content with async call
                    button.addEventListener("click", async () => {
                        await this.loadAndDisplayPost(item.id, button, true);
                    });

                    element.appendChild(button);
                } catch (error: unknown) {
                    console.error("Error creating button for post:", error);
                }
            });
        } catch (error: unknown) {
            console.error("Error during creating DOM Elements for Blog Post Entries:", error);
            const element = this.querySelector(`#${targetElement}`) as HTMLElement | null;
            if (element) {
                element.innerHTML = `
                    <div class="d-flex flex-column align-items-center justify-content-center">
                        <div>☹</div>
                        <h2>Unable to <mark>display</mark> blog posts.</h2>
                    </div>
                `;
            }
        }
    }

    private async loadAndDisplayPost(postId: string, button: HTMLButtonElement, updateUrl: boolean = true) {
        const contentArea = this.querySelector("#blogMain") as HTMLDivElement | null;
        if (!contentArea) {
            console.error("Content area not found");
            return;
        }

        button.disabled = true;
        const originalButtonHTML = button.innerHTML;
        button.innerHTML = `<span class="spinner-border spinner-border text-info" role="status" aria-hidden="true"></span>`;

        this.appendSpinner(contentArea);
        try {
            const post = await WordPressGraphQLClient.fetchSinglePost(postId);

            if (post) {
                console.log("Post loaded successfully", post);
                this.displayPostContent(post);

                // Update URL with slug if requested
                if (updateUrl) {
                    this.updateUrlWithPost(post);
                }
            } else {
                console.error("Post cannot be loaded properly.");
                return;
            }
        } catch (error: unknown) {
            console.error("Error loading post:", error);
            contentArea.innerHTML = `
                <div class="alert alert-danger shadow-sm rounded-5" role="alert">
                    <h4 class="alert-heading"><i class="bi bi-exclamation-diamond"></i> Error Loading Post</h4>
                    <hr class="my-1 w-50">
                    <p class="mt-2 mb-0">Something went wrong. Try again later...</p>
                </div>
            `;
        } finally {
            this.removeSpinner();
            button.disabled = false;
            button.innerHTML = originalButtonHTML;
        }
    }

    private updateUrlWithPost(post: Post): void {
        try {
            const slug = post.url.split("/").filter(Boolean).pop() || "";
            const currentUrl = new URL(window.location.href);

            currentUrl.searchParams.set("post", slug);
            // Add URL state according to article name
            window.history.pushState({ postId: post.id, slug }, "", currentUrl.toString());
        } catch (error) {
            console.error("Error updating URL:", error);
        }
    }

    // Spinner-related dom manip
    private appendSpinner(target: HTMLElement) {
        this.removeSpinner();

        const spinnerContainer = document.createElement("div") as HTMLDivElement;
        spinnerContainer.className = "blog-post-loader d-flex justify-content-center align-items-center h-100";

        const temporarySpinner = document.createElement("div") as HTMLDivElement;
        temporarySpinner.className = "spinner-border text-primary";
        temporarySpinner.role = "status";
        temporarySpinner.style.width = "3rem";
        temporarySpinner.style.height = "3rem";

        const temporarySpinnerContent = document.createElement("span") as HTMLSpanElement;
        temporarySpinnerContent.className = "visually-hidden";
        temporarySpinnerContent.textContent = "Loading....";

        temporarySpinner.appendChild(temporarySpinnerContent);
        spinnerContainer.appendChild(temporarySpinner);
        target.appendChild(spinnerContainer);
    }

    private removeSpinner() {
        const elementsToBeRemoved = document.querySelectorAll(".blog-post-loader") as NodeListOf<HTMLElement>;
        elementsToBeRemoved.forEach((elem) => {
            elem.remove();
        });
    }

    private displayPostContent(post: Post): void {
        const contentArea = this.querySelector("#blogMain") as HTMLDivElement | null;

        if (!contentArea) {
            console.error("Content area not found");
            return;
        }

        const sanitizedContent = post.content;
        const sanitizedTitle = post.title || "Untitled Post";
        const authorName = post.author?.name || "Unknown Author";
        const defaultImageSrc = "../assets/images/static/webp/logo.webp";

        const postHTML = `
            <article class="blog-post">
                <header class="mb-4">
                    <h1 class="display-6 fw-medium mb-3">${sanitizedTitle}</h1>
                    <div class="d-flex align-items-center justify-content-start gap-2">
                        <div>
                            <img class="img-fluid rounded-pill" src="${defaultImageSrc}" alt="${authorName}" class="rounded-circle" width="48" height="48">
                        </div>
                        <div>
                            <p class="mb-0 fw-semibold">${authorName}</p>
                            <small class="text-muted">Author</small>
                        </div>
                    </div>
                    <hr class="w-25">
                </header>
                <div class="blog-post-content">
                    ${sanitizedContent}
                </div>
            </article>
        `;

        contentArea.innerHTML = DOMPurify.sanitize(postHTML);
        contentArea.scrollTop = 0;
    }

    // Add method to load post from URL (slug)
    private async loadPostFromUrl(): Promise<void> {
        const urlParams = new URLSearchParams(window.location.search);
        const postSlug = urlParams.get("post");

        if (!postSlug) {
            return;
        }

        const contentArea = this.querySelector("#blogMain") as HTMLDivElement | null;
        if (!contentArea) {
            return;
        }

        this.appendSpinner(contentArea);
        try {
            const post = await WordPressGraphQLClient.fetchPostBySlug(postSlug);
            if (post) {
                // Visual enhancements
                this.displayPostContent(post);
                this.highlightActivePost(post.id);
            }
        } catch (error) {
            console.error("Error loading post from URL:", error);
            contentArea.innerHTML = `
                <div class="alert alert-warning shadow-sm rounded-5" role="alert">
                    <h4 class="alert-heading"><i class="bi bi-exclamation-triangle"></i> Post Not Found</h4>
                    <hr class="my-1 w-50">
                    <p class="mt-2 mb-0">The requested post could not be found.</p>
                </div>
            `;
        } finally {
            this.removeSpinner();
        }
    }

    private async fetchAndPopulatePosts() {
        const blogAside = this.querySelector("#blogAsideChild") as HTMLElement | null;
        const offCanvasAside = this.querySelector("#offCanvasArea") as HTMLElement | null;

        if (!blogAside || !offCanvasAside) {
            console.error("Blog aside child element not found");
            return;
        }

        this.appendSpinnerInAside(blogAside);
        this.appendSpinnerInAside(offCanvasAside);
        try {
            // Fetch only previews (lightweight data)
            const previews = await WordPressGraphQLClient.fetchBlogPostPreviews();
            await this.generateDomElementsRelatedToBlogsInAside("blogAsideChild", previews);
            await this.generateDomElementsRelatedToBlogsInAside("offCanvasArea", previews);
        } catch (error: unknown) {
            console.error("Failed to fetch and populate posts:", error);
            const errorAlert: string = `
                <div class="alert alert-warning rounded-5 shadow-sm" role="alert">
                    <h4 class="alert-heading"><i class="bi bi-exclamation-diamond"></i> Error</h4>
                    <hr class="w-50 my-2">
                    <p class="my-1">Unable to load blog posts. Please refresh the page.</p>
                </div>
            `;
            blogAside.innerHTML = errorAlert;
            offCanvasAside.innerHTML = errorAlert;
        } finally {
            this.removeSpinnerInAside();
        }
    }

    // Placeholder spinner element
    private appendSpinnerInAside(target: HTMLElement) {
        const spinnerContainer = document.createElement("div") as HTMLDivElement;
        spinnerContainer.className = "blog-aside-loader d-flex flex-column justify-content-center align-items-center h-100";

        const temporarySpinner = document.createElement("div") as HTMLDivElement;
        temporarySpinner.className = "spinner-border text-primary mb-3";
        temporarySpinner.role = "status";
        temporarySpinner.style.width = "3rem";
        temporarySpinner.style.height = "3rem";

        const temporarySpinnerContent = document.createElement("span") as HTMLSpanElement;
        temporarySpinnerContent.className = "visually-hidden";
        temporarySpinnerContent.textContent = "Loading Blog Posts";

        const loadingText = document.createElement("p") as HTMLParagraphElement;
        loadingText.className = "text-muted";
        loadingText.textContent = "Loading blog posts...";

        temporarySpinner.appendChild(temporarySpinnerContent);
        spinnerContainer.appendChild(temporarySpinner);
        spinnerContainer.appendChild(loadingText);
        target.appendChild(spinnerContainer);
    }

    private removeSpinnerInAside() {
        const elementsToBeRemoved = document.querySelectorAll(".blog-aside-loader") as NodeListOf<HTMLElement>;
        elementsToBeRemoved.forEach((elem) => {
            elem.remove();
        });
    }

    // Add method to highlight active post button
    private highlightActivePost(postId: string): void {
        const buttons = this.querySelectorAll(".blog-post-link") as NodeListOf<HTMLButtonElement>;
        buttons.forEach(button => {
            if (button.dataset.postId === postId) {
                button.classList.add("active", "border", "border-primary");
            } else {
                button.classList.remove("active", "border", "border-primary");
            }
        });
    }

    async connectedCallback() {
        await this.fetchAndPopulatePosts();

        // Check if there"s a post in the URL and load it
        await this.loadPostFromUrl();

        // Listen for browser back/forward navigation
        window.addEventListener("popstate", async (event) => {
            if (event.state?.postId) {
                await this.loadPostFromUrl();
            }
        });
    }
}

customElements.define("app-updates", Updates);