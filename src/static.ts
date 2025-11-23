interface Principle {
    title: string;
    description: string;
}

export class BodyParts {
    public readonly mottos: Array<string> = [
        "Progressive",
        "Problem-solving",
        "Realistic",
        "Pratical",
        "Applicable",
        "In-demand"
    ];
}

export class HeroParts {
    public readonly occupationsData: Array<string> = [
        "English Teacher",
        "Front-end Developer",
        "React Developer",
        "Wordpress Developer"
    ]
}

export class PromoParts {
    public readonly promoTabData: any = {
        PS: {
            iconData: "bi bi-stack",
            desc: "I strive to implement solutions to various problems we encounter at anywhere extending from work to casual life."
        },
        PE: {
            iconData: "bi bi-suit-heart",
            desc: "I try to keep up with the latest and greatest positive developments around the global and embrace them as a whole."
        },
        PL: {
            iconData: "bi bi-wrench-adjustable-circle",
            desc: "I always try to fit the theory with the experienced reality thus creating a self-sustaining environment through reason."
        },
        RC: {
            iconData: "bi bi-rainbow",
            desc: "When I encounter a real issue in my classroom or my computer, I search for applicable solution to deal with observed phenomenon."
        }
    }

    public readonly principles: Principle[] = [
        {
            title: "Contextual immersion",
            description: "I integrate real-world scenarios, like role-playing daily conversations or analyzing various texts depending on our topic in classroom, to make English relevant and engaging for students."
        },
        {
            title: "Scaffolded autonomy",
            description: "I design tasks that gradually increase in complexity, empowering students to take ownership of their learning, from crafting simple sentences to debating complex ideas."
        },
        {
            title: "Error as opportunity",
            description: "I encourage students to view mistakes as critical stepping stones, using targeted feedback to refine their language skills without fear of judgment."
        },
        {
            title: "Multimodal engagement",
            description: "I blend visual, auditory, and kinesthetic activities—like storytelling through comics or pronunciation through rhythm exercises—to cater to diverse learning styles."
        },
        {
            title: "Cultural storytelling",
            description: "I weave global and local narratives into lessons, helping students to connect English to their own identities while exploring new perspectives."
        }
    ];

    public principleImagePaths: Array<string> = [
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
}

export class FooterLinks {
    public static readonly PERSONAL_LINKS = {
        github: "https://github.com/gokacinlar",
        xTwitter: "https://x.com/devDissentNT",
        mastodon: "https://mastodon.social/@gokacinlar",
        hashnode: "https://gokacinlar.hashnode.dev",
        email: "mailto:gokacinlar@tutanota.com?subject=To%20Dervi%C5%9F"
    };

    public static readonly BRANDING_LINKS = {
        cc010: "https://creativecommons.org/publicdomain/zero/1.0/",
        notByAi: "https://notbyai.fyi/"
    };
}

export class AboutData {
    public static readonly tableData = [
        {
            category: "Front-end",
            technologies: "JavaScript (ES6+), TypeScript",
            libraries: "React, Redux"
        },
        {
            category: "Back-end",
            technologies: "PHP(7+), Node.js, Express.js",
            libraries: "Laravel"
        },
        {
            category: "Styling",
            technologies: "Bootstrap (+derivatives), SASS, Tailwind CSS, Material UI",
            libraries: "Shadcn, DaisyUI"
        },
        {
            category: "Databases",
            technologies: "MySQL, SQLite, PostgreSQL",
            libraries: "-"
        },
        {
            category: "DevOps",
            technologies: "Apache, Docker, Linux (WSL + Native)",
            libraries: "-"
        },
        {
            category: "CMS",
            technologies: "Wordpress, Headless Wordpress",
            libraries: "-"
        },
        {
            category: "Tools",
            technologies: "Git, Webpack",
            libraries: "-"
        },
        {
            category: "Testing",
            technologies: "Mocha, Jest",
            libraries: "-"
        },
        {
            category: "Design & UX",
            technologies: "Figma, Adobe Illustrator, Adobe Photoshop",
            libraries: "-"
        }
    ];
}

interface ModalConfig {
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
            title: "🧲 GnuPG Public Key",
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
            title: "👔 See or Download My CV",
            content: `
            <div class="mt-2 fs-6 fw-medium border border-1 border-secondary-subtl px-2 py-2 rounded-4">
                <div class="alert alert-warning rounded-4" role="alert">
                    <i class="bi bi-exclamation-diamond"></i> Please verify <strong>you're human</strong> before proceeding.
                </div>
                <div class="d-flex align-items-center justify-content-center">
                    <div>
                        <form method="post">
                            <div class="g-recaptcha" data-sitekey="${ModalList.RECAPTCHA_SITE_KEY}"></div>
                            <button class="btn btn-sm w-100 fw-bold fs-5" type="submit" name="captcha_submit">Confirm Action</button>
                        </form>
                    </div>
                </div>
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
        }
    ];

}