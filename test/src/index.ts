import axios from "axios";
import cheerio from 'cheerio';

async function main() {
    const url = 'http://dbs-cardgame.com/us-en/cardlist/?search=true&category=428017';
    const AxiosInstance = axios.create(); // create a new axios instance

    try {
        const webPage = await AxiosInstance.get(url);
        const $ = cheerio.load(webPage.data);
        const outerCardListDiv = $('#listCol');
        // card list is the list of cards
        const cardList = outerCardListDiv.children('.list-inner').children();
        // loop through each card
        for (let i = 0; i < cardList.length; i++) {
            const card = $(cardList[i]).children();
            console.log($(card).find('.cardName').text());
        }
    } catch (err: any) {
        console.log(err);
    }

}
console.log('programming is running');
main();