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
    public fLinks = {
        cc010: "https://creativecommons.org/publicdomain/zero/1.0/",
        notByAi: "https://notbyai.fyi/"
    }
}

export class AboutData {
    public readonly tableData = [
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