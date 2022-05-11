import axios from "axios";
import cheerio from "cheerio";

/**
 * This file looks for the navigation section
 * of the DBS-CardGame website and scrapes all the links
 * to the pages that showcase the cards.
 */
const AxiosInstance = axios.create();

const DBS_DATA_BASE_URL =
    "http://www.dbs-cardgame.com/us-en/cardlist/?search=true&category=";
const HREF_REGEXP = /.*?\?.*?category=(?<category>.+)$/;


export async function GetCardListUrls(cardListUrl: string) {
    const response = await AxiosInstance.get(cardListUrl);
    const body = await response.data;
    const $ = cheerio.load(body);

    const navListItems = $("div#snaviList li a");
    console.log(navListItems);
    const urlsInfo = navListItems.toArray().map(extractInfoFromItemNode($));

    return urlsInfo;
}

function extractInfoFromItemNode($) {
    return (itemNode) => {
        const cheerioElement = $(itemNode);
        const href = cheerioElement.attr("href");
        const category = extractCategoryFromHref(href);

        return {
            name: cheerioElement.text(),
            href,
            category,
            url: `${DBS_DATA_BASE_URL}${category}`,
        };
    };
}

function extractCategoryFromHref(hrefString: string) {
    const match = hrefString.match(HREF_REGEXP);
    return match.groups.category;
}