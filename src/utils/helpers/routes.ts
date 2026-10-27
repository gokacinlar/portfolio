export const SITE_URL: string = "https://dervisoksuzoglu.xyz";

export const Routes = {
    HOME: "/index.html",
    LIFE_FEED: "/idno",
    GALLERY: "/galeri/index.php",
    UPDATES: "/updates.html",
    ABOUT: "/about.html",
    WORK: "/work.html",
};

export const defaultHtmxOptions = {
    hxget: "",
    hxtrigger: "click",
    hxswap: "innerHTML transition:true",
    hxpushurl: true,
};

export const NavLinkHtmxOptions = {
    [Routes.HOME]: { ...defaultHtmxOptions, hxget: Routes.HOME },
    [Routes.LIFE_FEED]: { ...defaultHtmxOptions, hxget: Routes.LIFE_FEED },
    [Routes.GALLERY]: { ...defaultHtmxOptions, hxget: Routes.GALLERY },
    [Routes.UPDATES]: { ...defaultHtmxOptions, hxget: Routes.UPDATES },
    [Routes.ABOUT]: { ...defaultHtmxOptions, hxget: Routes.ABOUT },
    [Routes.WORK]: { ...defaultHtmxOptions, hxget: Routes.WORK },
};