import DOMPurify from "dompurify";
import WordPressGraphQLClient from "../utils/wp_graphql";
import { Template } from "../helper";

interface Author {
    name: string;
}
interface Post {
    id: string;
    title: string;
    author: Author;
    content: string;
}

class Updates extends HTMLElement {
    constructor() {
        super();

        const template = new Template().createTemplate(this.render());
        this.appendChild(template.content.cloneNode(true));
        this.connectedCallback();
    }

    private render(): string {
        return `
            <section class="container-fluid h-100">
                <div id="blogContainer" class="row gx-3 mb-3 h-100">
                    <div class="bwrapper col-md-4 col-lg-4 col-sm h-100">
                        ${this.blogAside()}
                    </div>
                    <div class="bwrapper col-md-8 col-lg-8 col-sm h-100">
                        <main id="blogMain" class="h-100 rounded-5 px-3 py-3 shadow-sm">
                            <h1>Main Content</h1>
                            <p>This is the main section.</p>
                        </main>
                    </div>
                </div>
            </section>
        `;
    }

    private blogAside(): string {
        return `
            <aside id="blogAside" class="h-100 rounded-5 px-3 py-3 shadow-sm">
                <section id="blogAsideChild" class="rounded-5 h-75 px-3 py-3 border border-1 border-dark-subtle"></section>
            </aside>
        `;
    }

    private offCanvas(): string {
        return `
            <div class="offcanvas offcanvas-start" tabindex="-1" id="blogAsideOffcanvasTemplate" aria-labelledby="blogAsideOffcanvas">
                <div class="offcanvas-header">
                    <h5 class="offcanvas-title" id="blogAsideOffcanvas">Latest updates</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">
                    <div>
                        Some text as placeholder. In real life you can have the elements you have chosen. Like, text, images, lists, etc.
                    </div>
                </div>
            </div>
        `;
    }

    private async generateDomElementsRelatedToBlogsInAside(targetElement: string, data: Post[]) {
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
                    <h2>No blog posts <em>are available.</em></h2>
            `;
                return;
            }

            // Clear existing content first to avoid conflictions
            element.innerHTML = "";

            // Create and append each post button with event listener
            data.forEach((item: Post) => {
                const title = item.title || "Untitled Post";
                const authorName = item.author?.name || "Unknown Author";

                const button = document.createElement("button");
                button.type = "button";
                button.className = "blog-post-link btn btn-sm fs-5 d-flex flex-row gap-2 align-items-center justify-content-between w-100 py-2 px-2 bg-secondary-subtle rounded-pill link-offset-2 link-underline link-underline-opacity-0 mb-2";


                const buttonContent = `
                    <span class="bg-primary-subtle rounded-pill py-1 px-2 flex-grow-1 text-start">${title}</span>
                    <small class="bg-primary-subtle py-1 px-2 rounded-pill">${authorName}</small>
                `;
                button.innerHTML = DOMPurify.sanitize(buttonContent);
                button.addEventListener("click", () => {
                    this.displayPostContent(item);
                });

                element.appendChild(button);
            });
        } catch (error: unknown) {
            console.error("Error during creating DOM Elements for Blog Post Entries:", error);
        }
    }

    private displayPostContent(post: Post): void {
        const contentArea = this.querySelector("#blogMain") as HTMLDivElement | null;

        if (!contentArea) {
            console.error(`Content area named ${contentArea} not found`);
            return;
        }

        // Sanitize the post content before displaying
        const sanitizedContent = post.content;
        const sanitizedTitle = DOMPurify.sanitize(post.title || "Untitled Post");
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

        contentArea.innerHTML = postHTML;
        // Scroll to top for clear visibility of the beginning of the post
        contentArea.scrollTop = 0;
    }

    private async fetchAndPopulatePosts() {
        try {
            const posts = await WordPressGraphQLClient.fetchBlogPosts();
            const result = await this.generateDomElementsRelatedToBlogsInAside("blogAsideChild", posts);
            return result;
        } catch (error: unknown) {
            console.error("Failed to fetch and populate posts:", error);
        }
    }

    connectedCallback() {
        this.fetchAndPopulatePosts();
    }
}

customElements.define("app-updates", Updates);