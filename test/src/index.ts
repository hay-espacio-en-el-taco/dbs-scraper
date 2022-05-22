import { writeFileSync } from "fs";
import path from 'path';
import { CardsScraper } from "./scrapers/cardScraper/cardScraper";
import { GetCardListUrls } from "./scrapers/navListScraper/navListScraper";

/**
 * Constants
 */
const DEFAULT_OUTPUT = path.join(__dirname, '..', 'cards.json')
const CARD_LIST_URL = "http://www.dbs-cardgame.com/us-en/cardlist/?search=true";

/**
 * Main program of the scraper.
 * Fetches a list of urls from a given url, then fetches the cards from each url, and finally saves
 * the cards data to a file
 */
async function main() {
    console.log("Typescript Version");
    console.log("Getting urls from navigation sidebar...");
    const urlsList = await GetCardListUrls(CARD_LIST_URL);
    console.log(`Fetched ${urlsList.length} urls!.`);

    console.log("Getting cards...");
    const cards = await CardsScraper(urlsList);
    console.log(`Fetched and parsed a total of ${cards.length} cards!.`);

    // Extract unique attributes from the cards
    const attributes = getUniqueValuesByProperty(cards);

    const outputPath = process.env.CARDS_DATA_OUTPUT || DEFAULT_OUTPUT;
    writeFileSync(outputPath, JSON.stringify({urlsList, cards, attributes}));
    console.log(`Cards data saved at "${outputPath}"`);
}
main();



/**
 * Utility Functions
 */
function getUniqueValuesByProperty(allCards) {
    return unfoldSetsIntoArrays(allCards.reduce(groupValuesInSets, {}));
}

function groupValuesInSets(dict = {}, obj) {
    if (!obj) {
        return dict;
    }
    for (let [key, value] of Object.entries(obj)) {
        const isAnidated = !(dict[key] instanceof Set) && typeof dict[key] === 'object';
        if (isAnidated || (value && typeof value === 'object' && !Array.isArray(value))) {
            dict[key] = groupValuesInSets(dict[key], value);
            continue;
        }

        if (typeof value !== 'number' && !value) {
            // Value is null, empty string or undefined
            continue;
        }
        if (!dict[key]) {
            dict[key] = new Set();
        }
        if (Array.isArray(value)) {
            value.forEach(dict[key].add.bind(dict[key]));
        } else {
            dict[key].add(value);
        }
    }
    return dict;
}

function unfoldSetsIntoArrays(obj) {
    if (obj instanceof Set) {
        return Array.from(obj.values());
    }
    const result = {};
    for (let [key, value] of Object.entries(obj)) {
        result[key] = unfoldSetsIntoArrays(value);
    }

    return result;
}