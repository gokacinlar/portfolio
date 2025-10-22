type GenericString = {
    [key: string]: string;
}

type PromoCardData = {
    postName: string;
    postDesc: string;
    postImgSrc: string;
    postLangType: string;
    postLangTypeImgSrc: string;
    projectLink: string;
};

type PromoSkills = {
    skillName: string;
    skillLogoSrc: string;
    skillAnchor: string;
}

type PromoSocials = {
    socialName: string;
    socialClass: string;
    socialLink: string;
}

type HTMXOptions = {
    hxget: string;
    hxtrigger: "click" | "change" | "mouseover";
    hxswap: "innerHTML" | "outerHTML" | "beforebegin" | "afterbegin" | "beforeend" | "afterend";
    hxpushurl: boolean;
}

type Education = {
    institution: string;
    field: string;
    degree: string;
}

type NavLink = {
    id: string;
    icon: string;
    label: string
};

type TableRow = string[];

export type {
    GenericString,
    PromoCardData,
    PromoSkills,
    PromoSocials,
    HTMXOptions,
    Education,
    NavLink,
    TableRow
}