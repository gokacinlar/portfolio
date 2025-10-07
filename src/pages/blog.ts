import WordPressGraphQLClient from "../utils/wp_graphql";
import { Template } from "../helper";

interface Author {
    name: string;
    avatarUrl: string;
}
interface Post {
    id: string;
    title: string;
    author: Author;
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
            <aside id="blogAside" class="h-100 rounded-5 p-3 shadow-sm">
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
            console.log('Received data:', data); // Log the entire data array

            // Use this.querySelector instead of document.querySelector
            const element = this.querySelector(`#${targetElement}`) as HTMLElement | null;

            if (!element) {
                console.error(`Element with id "${targetElement}" not found`);
                return;
            }

            // Check if data is empty or undefined
            if (!data || data.length === 0) {
                console.warn('No blog posts found');
                element.innerHTML = '<p>No blog posts available</p>';
                return;
            }

            // More robust mapping with type checking
            const result = data.map((item: Post) => {
                // Defensive checks to prevent undefined errors
                const title = item.title || 'Untitled Post';
                const authorName = item.author?.name || 'Unknown Author';

                return `
                <a href="#" class="blog-post-link">
                    <span>${title}</span>
                    <small>${authorName}</small>
                </a>
            `;
            }).join("");

            element.innerHTML = result;
        } catch (error: unknown) {
            console.error("Error during creating DOM Elements for Blog Post Entries:", error);
        }
    }

    private async fetchAndPopulatePosts() {
        try {
            const posts = await WordPressGraphQLClient.fetchBlogPosts();
            await this.generateDomElementsRelatedToBlogsInAside("blogAsideChild", posts);
        } catch (error: unknown) {
            console.error("Failed to fetch and populate posts:", error);
        }
    }

    connectedCallback() {
        this.fetchAndPopulatePosts();
    }
}

customElements.define("app-updates", Updates);