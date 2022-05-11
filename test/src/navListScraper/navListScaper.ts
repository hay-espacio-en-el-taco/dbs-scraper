import axios from "axios";
import cheerio from "cheerio";
import { ICardListUrl } from "../shared/interfaces/ICardListUrl";

/**
 * This file looks for the navigation section
 * of the DBS-CardGame website and scrapes all the links
 * to the pages that showcase the cards.
 */

/**
 * Constants
 */
const AxiosInstance = axios.create();
const DBS_DATA_BASE_URL =
    "http://www.dbs-cardgame.com/us-en/cardlist/?search=true&category=";
const HREF_REGEXP = /.*?\?.*?category=(?<category>.+)$/;

/**
 * Exported function that will obtain the nav list and returns an array
 * @param cardListUrl - Url that points to the card list page of dbs-cardgame.com
 * @returns @type ICardListUrl[] 
 */
export async function GetCardListUrls(cardListUrl: string) {
    const response = await AxiosInstance.get(cardListUrl);
    const body = await response.data;
    const $ = cheerio.load(body);

    const navListItems = $("div#snaviList li a");
    console.log(navListItems);
    const urlsInfo: ICardListUrl[] = navListItems.toArray().map(extractInfoFromItemNode($)) as ICardListUrl[];

    return urlsInfo;
}

/**
 * Extracts information from a Node on the DOM
 * @param $ - Dom that we are extracting information from
 * @returns a ICardListUrl from each Item Node
 */
function extractInfoFromItemNode($){
    return (itemNode) => {
        const cheerioElement = $(itemNode);
        const href = cheerioElement.attr("href");
        const category = extractCategoryFromHref(href);

        return {
            name: cheerioElement.text(),
            href,
            category,
            url: `${DBS_DATA_BASE_URL}${category}`,
        } as ICardListUrl;
    };
}

function extractCategoryFromHref(hrefString: string) {
    const match = hrefString.match(HREF_REGEXP);
    return match.groups.category;
}