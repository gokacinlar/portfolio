export type GenericString = {
    [key: string]: string;
}

export type PromoCardData = {
    postName: string;
    postDesc: string;
    postImgSrc: string;
    postLangType: string;
    postLangTypeImgSrc: string;
    projectLink: string;
};

export type PromoSkills = {
    skillName: string;
    skillLogoSrc: string;
    skillAnchor: string;
}

export type PromoSocials = {
    socialName: string;
    socialClass: string;
    socialLink: string;
}

export type HTMXOptions = {
    hxget: string;
    hxtrigger: string;
    hxswap: string;
    hxpushurl: string;
}

export type Education = {
    institution: string;
    field: string;
    degree: string;
}

export type NavLink = {
    id: string;
    icon: string;
    label: string
};

export type TableRow = string[];
