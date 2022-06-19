import { CardsScraper } from "../scrapers/cardScraper/cardScraper";
import { ICardListUrl } from "../shared/interfaces/ICardListUrl";

async function testCardScraper(){
    const urls: ICardListUrl[] = [{
        "name": "UW01 Starter 14 -Saiyan Wonder-",
        "href": "./?search=true&category=428314",
        "category": "428314",
        "url": "http://dbs-cardgame.com/us-en/cardlist/?search=true&category=428308"
      }]
    const cards = await CardsScraper(urls);
    // console.log(cards);
    console.log(`${cards.length} cards found!`)
}
testCardScraper();