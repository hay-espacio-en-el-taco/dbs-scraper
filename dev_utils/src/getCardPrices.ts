import axios from 'axios';
import cheerio from 'cheerio';
import { writeFileSync } from 'fs';
import path from 'path';

const BASE_URL = 'https://shop.tcgplayer.com/price-guide/dragon-ball-super-ccg/';
const AxiosInstance = axios.create();
const DEFAULT_OUTPUT = path.join(__dirname, '..', 'cardPrices.json')

async function main() {
    const urlsList = await getCardListUrls(BASE_URL);

    const cardPrices = await getCardPrices(urlsList);
    console.log(`Fetched a total of ${cardPrices.length} cardPrices!`)

    writeFileSync(DEFAULT_OUTPUT, JSON.stringify(cardPrices));
}

async function getCardListUrls(url: string): Promise<Array<{ url: string }>> {
    const response = await AxiosInstance.get(url);
    const body = await response.data;
    const $ = cheerio.load(body);

    const setSelector = $('#set option');
    const urlsInfo = setSelector.toArray().map(extractUrlsFromSetNode($));
    return urlsInfo;
}

function extractUrlsFromSetNode($: cheerio.Root): (itemNode: any) => any {
    return (itemNode) => {
        const cheerioElement = $(itemNode);
        const value = cheerioElement.attr('value');
        return { url: BASE_URL + value };
    };
}


async function getCardPrices(urls: Array<{ url: string }>) {
    let cardPrices = [];
    for (let i = 0; i < urls.length; i++) {
        const response = await AxiosInstance.get(urls[i].url);
        const body = await response.data;
        const $ = cheerio.load(body);

        const priceTable = $('.priceGuideTable tbody tr');
        const cardsWithPrices = priceTable.toArray().map(extractInfoFromPriceTableRow($));
        cardPrices = cardPrices.concat(cardsWithPrices);
    }
    return cardPrices;
}

function extractInfoFromPriceTableRow($: cheerio.Root) {
    return (itemNode) => {
        const cheerioElement = $(itemNode);
        const cardName = cheerioElement.find('.productDetail a').text().trim();
        const cardNumber = cheerioElement.find('.number .cellWrapper').text().trim();
        const marketPrice = cheerioElement.find('.marketPrice .cellWrapper').text().trim();
        const medianPrice = cheerioElement.find('.medianPrice .cellWrapper').text().trim();

        return {
            cardName,
            cardNumber,
            marketPrice,
            medianPrice,
        }
    }
}

main();