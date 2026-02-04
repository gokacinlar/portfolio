import { formatDate } from "./utils/helper";
import GetSiteVersionNumber from "./utils/webScraper";
import * as Type from "./types/types";
import Localize from "./utils/initLocalization";

interface Principle {
    title: string;
    description: string;
}

export class BodyParts {
    public readonly mottos: Array<string> = [
        Localize.translate("common:hero:mottos:prof"),
        Localize.translate("common:hero:mottos:problemSolver"),
        Localize.translate("common:hero:mottos:realistic"),
        Localize.translate("common:hero:mottos:practical"),
        Localize.translate("common:hero:mottos:applicable"),
        Localize.translate("common:hero:mottos:inDemand"),
    ];
}

export class HeroParts {
    public readonly occupationsData: Array<string> = [
        Localize.translate("common:fields:teacher"),
        Localize.translate("common:fields:frontEnd"),
        Localize.translate("common:fields:react"),
        Localize.translate("common:fields:wordpress"),
        Localize.translate("common:fields:js"),
        Localize.translate("common:fields:ts")
    ]
}

export class PromoParts {
    public readonly promoTabData = {
        PS: {
            iconData: "bi bi-stack",
            desc: Localize.translate("common:desc:exp:PS")
        },
        PE: {
            iconData: "bi bi-suit-heart",
            desc: Localize.translate("common:desc:exp:PE")
        },
        PL: {
            iconData: "bi bi-wrench-adjustable-circle",
            desc: Localize.translate("common:desc:exp:PL")
        },
        RC: {
            iconData: "bi bi-rainbow",
            desc: Localize.translate("common:desc:exp:RC")
        }
    }

    public readonly principles: Principle[] = [
        {
            title: Localize.translate("common:principles:first:title"),
            description: Localize.translate("common:principles:first:msg")
        },
        {
            title: Localize.translate("common:principles:second:title"),
            description: Localize.translate("common:principles:second:msg")
        },
        {
            title: Localize.translate("common:principles:third:title"),
            description: Localize.translate("common:principles:third:msg")
        },
        {
            title: Localize.translate("common:principles:fourth:title"),
            description: Localize.translate("common:principles:fourth:msg")
        },
        {
            title: Localize.translate("common:principles:fifth:title"),
            description: Localize.translate("common:principles:fifth:msg")
        }
    ];

    public static readonly principleImagePaths: Array<string> = [
        "./assets/images/static/svg/TE_alphabet.svg",
        "./assets/images/static/svg/TE_book.svg",
        "./assets/images/static/svg/TE_booklet.svg",
        "./assets/images/static/svg/TE_brightness.svg",
        "./assets/images/static/svg/TE_globe.svg",
        "./assets/images/static/svg/TE_keywords.svg",
        "./assets/images/static/svg/TE_lang.svg",
        "./assets/images/static/svg/TE_quote.svg",
        "./assets/images/static/svg/TE_reception.svg"
    ]

    public static readonly promoItems = [
        {
            title: Localize.translate("common:work:section1:title"),
            description: Localize.translate("common:work:section1:msg"),
            img: "../assets/images/static/webp/qualifications-main-english.webp",
            link: new URL("https://dervisoksuzoglu.com.tr")
        },
        {
            title: Localize.translate("common:work:section2:title"),
            description: Localize.translate("common:work:section2:msg"),
            img: "../assets/images/static/webp/qualifications-main-webdev.webp",
            link: new URL("https://dervisoksuzoglu.com.tr")
        }
    ]
}

export class FooterLinks {
    public static readonly PERSONAL_LINKS = {
        github: "https://github.com/gokacinlar",
        xTwitter: "https://x.com/devDissentNT",
        hashnode: "https://gokacinlar.hashnode.dev",
        email: "mailto:gokacinlar@tutanota.com?subject=To%20Dervi%C5%9F"
    };

    public static readonly BRANDING_LINKS = {
        cc010: "https://creativecommons.org/publicdomain/zero/1.0/",
        notByAi: "https://notbyai.fyi/"
    };
}

export class AboutData {
    public static readonly navLinks: Type.NavLink[] = [
        { id: "aboutMe", icon: "🧑", label: "About Me" },
        { id: "education", icon: "📚", label: "Education" },
        { id: "work", icon: "📠", label: "Work" },
        { id: "stack", icon: "🚀", label: "Tech Stack & Tools" },
        { id: "mailing", icon: "📧", label: "E-mail" },
        { id: "advanced", icon: "🔎", label: "Advanced" },
    ];

    public static readonly educationRows: Type.TableRow[] = [
        [
            "Atatürk University",
            "English Language Teaching",
            "Bachelor's Degree",
            `${formatDate(new Date(2019, 8))} - ${formatDate(new Date(2023, 6))}`,
        ],
        [
            "Atatürk University",
            "Computer Programming",
            "Associate Degree",
            `${formatDate(new Date(2023, 8))} - current`,
        ],
    ];

    public static readonly stackRows: Type.TableRow[] = [
        ["Front-end", "JavaScript (ES6+), TypeScript", "React, Redux, Next.js"],
        ["Back-end", "PHP(7+), Node.js", "Express.js, Codeigniter"],
        ["Cross-platform", "Tauri, Framework7", "-"],
        ["Styling", "Bootstrap (+derivatives), SASS, Tailwind CSS", "Shadcn & DaisyUI"],
        ["Databases", "MySQL, PostgreSQL", "Supabase"],
        ["DevOps", "Docker, Linux", "-"],
        ["CMS", "Wordpress, Headless Wordpress", "Next.js"],
        ["SSG", "Astro & Gatsby", "-"],
        ["Testing", "Jest & Playwright", "-"],
        ["Design & UX", "Figma, Adobe Illustrator & Adobe Photoshop", "-"],
    ];

    public static readonly introduction = {
        first: `
            I'm highly interested in creating <mark>content-first</mark> websites as well as crafting stand-alone
            <mark>web applications (SPAs)</mark> or <mark>multi-page</mark> static content where <em>speed</em> &amp;
            <em>progressive enhancement</em> are critically important. I love building user interfaces with mainly
            <strong>React.</strong>
        `,
        last: `
            My primary field is teaching English in <mark>ESL (English as a Second Language)</mark> context. My main
            focus is to maximize practical usage of English in almost every aspect related to casual or academical
            way of interacting with the language.
        `
    }
}

export interface ModalConfig {
    id: string;
    title: string;
    content: string;
}

export class WhiteListedURLs {
    public static readonly approvedScripts: Set<string> = new Set([
        "https://www.google.com/recaptcha/api.js", // reCAPTCHAv3 client-side API
    ]);
}

export class ModalList {
    private static readonly RECAPTCHA_SITE_KEY: string = `${process.env.RECAPTCHA}`;
    public static readonly MODALS: ModalConfig[] = [
        {
            id: "gnuPgModal",
            title: Localize.translate("common:modals:gpg"),
            content: `
                <div class="mt-2 fs-6 fw-medium bg-dark-subtle px-2 py-2">
                    <p>
                        <code>
                            -----BEGIN PGP PUBLIC KEY BLOCK-----<br>
                            mDMEaIQ5/BYJKwYBBAHaRw8BAQdAkPugW/CL7j8YUNjNMfOu+Vzdbzqcy+ej7bgS<br>
                            sA1YzA20K0RlcnZpxZ8gw5Zrc8O8em/En2x1IDxnb2thY2lubGFyQHlhYW5pLmNv<br>
                            bT6ImQQTFgoAQRYhBJ/je/y0W1eL4i6+FUY7feypcQnrBQJohDn8AhsDBQkFpUsU<br>
                            BQsJCAcCAiICBhUKCQgLAgQWAgMBAh4HAheAAAoJEEY7feypcQnrbUYBAMd5oK3D<br>
                            qi3Dd8WlaDyYU0gvWzeRYkz5LY60vJg7hnqGAP4yl1zQR4QSUF/Wb3nu1rhf2DY2<br>
                            UfFDatM+C+dwx+CWDrg4BGiEOfwSCisGAQQBl1UBBQEBB0AqEb35sWJz4KgjMGQf<br>
                            G/69rSzKDXQzc6Pd+OEXY4gtSwMBCAeIfgQYFgoAJhYhBJ/je/y0W1eL4i6+FUY7<br>
                            feypcQnrBQJohDn8AhsMBQkFpUsUAAoJEEY7feypcQnrKooBANZf9FjNAEDupyXy<br>
                            LvovedoNsJBqhWI2xoKJhAL8cJBxAQDNapwGCkPhCyhYSeN2GscmlXNh8BxAFR90<br>
                            OV5PvJpMAQ==<br>
                            =BuXQ<br>
                            -----END PGP PUBLIC KEY BLOCK-----
                        </code>
                    </p>
                </div>
            `
        },
        {
            id: "requestCVModal",
            title: Localize.translate("common:modals:cv:title"),
            content: `
                <div class="mt-2 fs-6 fw-medium border border-1 border-secondary-subtl px-2 py-2 rounded-4">
                    <div class="alert alert-warning rounded-4" role="alert">
                        <i class="bi bi-exclamation-diamond"></i> ${Localize.translate("common:modals:cv:msg")}
                    </div>
                    <div class="d-flex align-items-center justify-content-center">
                        <div class="w-100">
                            <form id="captchaForm" class="d-flex flex-column align-items-center justify-content-center gap-2">
                                <div class="g-recaptcha" data-sitekey="${ModalList.RECAPTCHA_SITE_KEY}"></div>
                                <button id="submitCaptcha" class="btn btn-sm w-100 fw-medium fs-5 rounded-pill" type="button">
                                    ${Localize.translate("common:modals:cv:btnMsg")}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            `
        },
        {
            id: "langSwitchModal",
            title: Localize.translate("common:modals:lang"),
            content: `
                <div class="lang-switch-box rounded-5 bg-gradient p-0">
                    <div class="d-flex flex-row align-items-center justify-content-center gap-2 w-100 rounded-pill p-1">
                        <button id="changeLngToEn" class="btn btn-sm btn-secondary-subtle flex-grow-1 fs-5 fw-medium rounded-pill text-black d-flex p-0 gap-2 flex-row align-items-center justify-content-center">
                            <component-lazy-image class="img-fluid"
                                src="../assets/images/static/svg/flags/uk.svg"
                                alt="British Flag"
                                width="32"
                                height="32">
                            </component-lazy-image> English
                        </button>
                        <button id="changeLngToTr" class="btn btn-sm btn-secondary-subtle flex-grow-1 fs-5 fw-medium rounded-pill text-black d-flex p-0 gap-2 flex-row align-items-center justify-content-center">
                            <component-lazy-image class="img-fluid"
                                src="../assets/images/static/svg/flags/tr.svg"
                                alt="Turkish Flag"
                                width="32"
                                height="32">
                            </component-lazy-image> Türkçe
                        </button>
                    </div>
                </div>
            `
        },
        {
            id: "rssModal",
            title: Localize.translate("common:modals:rss:btnTitle"),
            content: `
                <div class="rss-box rounded-5 bg-gradient p-0">
                    <table class="table table-bordered table-striped border border-secondary-subtle border-1">
                        <thead>
                            <tr>
                                <th scope="col">${Localize.translate("common:modals:rss:tablePlatformName")}</th>
                                <th scope="col">${Localize.translate("common:modals:rss:tableLinkName")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td scope="row">Site</td>
                                <td>
                                    <component-anchor-link
                                        text="This Site"
                                        title="This Site"
                                        href="http://dervisoksuzoglu.com.tr/wp_blog/feed"
                                        target="_blank"
                                    ></component-anchor-link>
                                </td>
                            </tr>
                            <tr>
                                <td scope="row">Hashnode</td>
                                <td>
                                    <component-anchor-link
                                        text="Hashnode"
                                        title="Hashnode"
                                        href="https://gokacinlar.hashnode.dev/rss.xml"
                                        target="_blank"
                                    ></component-anchor-link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `
        },
        {
            id: "siteMapModal",
            title: Localize.translate("common:modals:sitemap:btnTitle"),
            content: `
                <div class="sitemap-box rounded-5 p-0">
                    <table class="table table-bordered table-striped border border-secondary-subtle border-1">
                        <thead>
                            <tr>
                                <th scope="col">${Localize.translate("common:modals:sitemap:tableActionName")}</th>
                                <th scope="col">${Localize.translate("common:modals:sitemap:tableVisitName")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td scope="row">${Localize.translate("common:modals:sitemap:visitSitemap")}</td>
                                <td>
                                    <component-anchor-link
                                        text="${Localize.translate("common:modals:sitemap:visitSitemap")}"
                                        title="${Localize.translate("common:modals:sitemap:visitSitemap")}"
                                        href="http://dervisoksuzoglu.com.tr/sitemap.xml"
                                        target="_blank">
                                    </component-anchor-link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `
        }
    ];
}

interface AccordionItem {
    id: string;
    header: string;
    body: string;
    modalTriggerId?: string;
    modalId?: string;
}

export class AccordionList {
    public static readonly ACCORDION_ITEMS: AccordionItem[] = [
        {
            id: "One",
            header: "🔑 Secure & Private Communication",
            body: `
                <p class="lead fs-6 fw-medium">If you want to contact me <mark class="rounded-3">in a more private way</mark>, you can use one of the actions given below.
                    If you don't know how to use these methods, here's a <a class="link-info link-opacity-75-hover link-offset-2" href="https://www.youtube.com/watch?v=mu2TVYJE5Gc" target="_blank">tutorial</a> on the go.
                    However, you should use this <strong>if you really have good reason to do so.</strong>
                </p>
                <table id="commsTable" class="table table-striped table-bordered">
                    <tbody>
                        <tr>
                            <th scope="row">Jami (Client)</th>
                            <td><code>gokacinlar</code></td>
                        </tr>
                        <tr>
                            <th scope="row">GnuPG (Public Key)</th>
                            <td>View <a class="link-info link-opacity-75-hover link-offset-2 modal-trigger" data-modal="gnuPgModal" href="#">here.</a></td>
                        </tr>
                    </tbody>
                </table>
            `,
            modalTriggerId: "gnupgKey",
            modalId: "gnuPgModal"
        },
        {
            id: "Two",
            header: "💞 Donations",
            body: `
                <p class="lead fs-6 fw-medium">If you're <em>somehow</em> interested in my work, you can support me via the options given below:</p>
                <table id="commsTable" class="table table-striped table-bordered">
                    <tbody>
                        <tr>
                            <th scope="row">BuyMeACoffee</th>
                            <td>View <a class="link-info link-opacity-75-hover link-offset-2" href="https://coff.ee/gokacinlar" target="_blank">here.</a></td>
                        </tr>
                    </tbody>
                </table>
            `
        },
        {
            id: "Three",
            header: "🍫 About This Site",
            body: `
                <p class="lead fs-6 fw-medium">Here you can find all the necessary information for this website.</p>
                <table id="commsTable" class="table table-striped table-bordered">
                    <tbody>
                        <tr>
                            <th scope="row">Site Version</th>
                            <td><code>${new GetSiteVersionNumber().getSiteVersionFromLocalStorage()}</code></td>
                        </tr>
                        <tr>
                            <th scope="row">License</th>
                            <td>This site is licensed under <code>CC0-1.0 Universal License.</code></td>
                        </tr>
                        <tr>
                            <th scope="row">Source Code</th>
                            <td>Available on
                                <a class="link-info link-opacity-75-hover link-offset-2" href="https://github.com/gokacinlar" target="_blank">GitHub</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            `
        }
    ];
}