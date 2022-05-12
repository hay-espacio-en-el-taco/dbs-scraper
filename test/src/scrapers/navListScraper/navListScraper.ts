import axios from "axios";
import cheerio from "cheerio";
import { ICardListUrl } from "../../shared/interfaces/ICardListUrl";

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
 * @returns {Promise<ICardListUrl[]>}
 */
export async function GetCardListUrls(cardListUrl: string): Promise<ICardListUrl[]> {
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
 * @param {cheerio.Root} $ - Dom that we are extracting information from
 * @returns {ICardListUrl} ICardListUrl from each Item Node
 */
function extractInfoFromItemNode($: cheerio.Root){
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

/**
 * It takes a string that looks like a URL, and returns the category part of the URL
 * For example, DBS-cardgame.com has a url like:
 * http://dbs-cardgame.com/us-en/cardlist/?search=true&category=428301
 * It searches for the `category=` portion, and takes what it equals.
 * @param {string} hrefString - The string to extract the category from.
 * @returns {string} The category name.
 */
function extractCategoryFromHref(hrefString: string): string {
    const match = hrefString.match(HREF_REGEXP);
    return match.groups.category;
}