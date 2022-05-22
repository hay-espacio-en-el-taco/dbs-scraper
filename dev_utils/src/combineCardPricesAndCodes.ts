import cardListJSON from './cards.json';
import cardPricesJSON from './cardPrices.json';
import { writeFileSync } from 'fs';
import path from 'path';

const DEFAULT_OUTPUT = path.join(__dirname, '..', 'reworkedCards.json')

function main(){
    const cards: any[] = (cardListJSON as any).cards;
    cardPricesJSON.forEach((card) => {
        const cardIndex = cards.findIndex((cardInfo: any) => cardInfo.cardNumber === card.cardNumber);
        if(cardIndex === -1){
            console.log("Couldn't find card", card);
        } else {
        cards[cardIndex].medianPrice = card.medianPrice;
        cards[cardIndex].marketPrice = card.marketPrice;
        }
    });
    (cardListJSON as any).cards = cards;
    writeFileSync(DEFAULT_OUTPUT, JSON.stringify({...(cardListJSON as any)}));
}

main();