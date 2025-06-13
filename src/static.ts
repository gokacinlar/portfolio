export class BodyParts {
    public mottos: Array<string> = [
        "Progressive",
        "Problem-solving",
        "Realistic",
        "Pratical",
        "Applicable",
        "In-demand"
    ];
}

export class HeroParts {
    public occupationsData: Array<string> = [
        "English Teacher",
        "Front-end Developer",
        "React Developer",
        "Wordpress Developer"
    ]
}

export class PromoParts {
    public marqueeElements: Array<{ title: string; imgSrc: string, href: string }> = [
        { title: "JavaScript", imgSrc: "./assets/images/static/svg/js.svg", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
        { title: "TypeScript", imgSrc: "./assets/images/static/svg/ts.svg", href: "https://www.typescriptlang.org/" },
        { title: "ReactJS", imgSrc: "./assets/images/static/svg/react.svg", href: "https://react.dev/" },
        { title: "PHP", imgSrc: "./assets/images/static/svg/php.svg", href: "https://www.php.net/" },
        { title: "WordPress", imgSrc: "./assets/images/static/svg/wp.svg", href: "https://wordpress.com/" },
        { title: "MySQL", imgSrc: "./assets/images/static/svg/mysql.svg", href: "https://www.mysql.com/" },
        { title: "PostgreSQL", imgSrc: "./assets/images/static/svg/postgrsql.svg", href: "https://www.postgresql.org/" },
        { title: "Python", imgSrc: "./assets/images/static/svg/py.svg", href: "https://www.python.org/" },
        { title: "C#", imgSrc: "./assets/images/static/svg/cs.svg", href: "https://dotnet.microsoft.com/en-us/apps/aspnet/web-apps" }
    ];
}

export class FooterLinks {
    public fLinks = {
        cc010: "https://creativecommons.org/publicdomain/zero/1.0/",
        notByAi: "https://notbyai.fyi/"
    }
}