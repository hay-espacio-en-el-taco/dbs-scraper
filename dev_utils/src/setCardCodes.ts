import * as XLSX from 'xlsx';
import cardListJSON from './reworkedCards.json';

interface ILeaderCard {
    cardNameFront: string;
    cardNameBack: string;
    amount: number;
    cardCode: string;
    foil: boolean;
    cardColor: string;
    medianPrice: string;
    marketPrice: string;
}

interface ICard {
    cardName: string;
    amount: number;
    cardCode: string;
    foil: boolean;
    cardColor: string;
    cardCost: string;
    medianPrice: string;
    marketPrice: string;
}

function main(): void {
    const cardWB = XLSX.readFile('./Dragon Ball Super Collection .xlsx');
    cardWB.SheetNames.forEach((sheet: string) => {
        if (sheet === "LEADER") {
            const leaders = setLeaderCardCode(XLSX.utils.sheet_to_json(cardWB.Sheets[sheet]));
            const leaderSheet = XLSX.utils.json_to_sheet(leaders);
            cardWB.Sheets[sheet] = leaderSheet;
        } else {
            const card = setCardCode(XLSX.utils.sheet_to_json(cardWB.Sheets[sheet]));
            const cardSheet = XLSX.utils.json_to_sheet(card);
            cardWB.Sheets[sheet] = cardSheet;
        }
    });
    XLSX.writeFile(cardWB,'Re-worked sheet.xlsx');
}

function setLeaderCardCode(input: any[]): ILeaderCard[] {
    const leaderCards: ILeaderCard[] = [];
    const cardList = (cardListJSON as any).cards;
    input.forEach((card) => {
        const cardInfo = cardList.filter((cards) => cards.cardBack && (cards.cardBack.cardName === card['Card Name Back']));
        if (cardInfo) {
            let cardInfoIndex = 0;
            if (cardInfo.length > 1) {
                console.log("multiple cards found for", card);
                cardInfoIndex = promptUser(cardInfo) - 1;
            }
            leaderCards.push({
                cardNameFront: cardInfo[cardInfoIndex].cardName,
                cardNameBack: cardInfo[cardInfoIndex].cardBack.cardName,
                amount: card.Amount,
                cardCode: cardInfo[cardInfoIndex].cardNumber,
                foil: card.Foil || false,
                cardColor: cardInfo[cardInfoIndex].color,
                medianPrice: cardInfo[cardInfoIndex].medianPrice,
                marketPrice: cardInfo[cardInfoIndex].marketPrice,
            });
        } else {
            console.log("couldn't find", card);
        }
    });

    return leaderCards;
}

function setCardCode(input: any[]): ICard[] {
    const cards: ICard[] = [];
    const cardList = (cardListJSON as any).cards;
    input.forEach((card) => {
        const cardInfo = cardList.filter( (cards) => cards.cardName === card['Card Name']);
        if (cardInfo) {
            let cardInfoIndex =0;
            if (cardInfo.length > 1) {
                cards.push({
                    cardName: card['Card Name'],
                    amount: card.Amount,
                    cardCode: '',
                    foil: card.Foil || false,
                    cardColor: '',
                    cardCost:'',
                    medianPrice: '',
                    marketPrice: '',
                });
            } else {
            cards.push({
                cardName: cardInfo[cardInfoIndex].cardName,
                amount: card.Amount,
                cardCode: cardInfo[cardInfoIndex].cardNumber,
                foil: card.Foil || false,
                cardColor: cardInfo[cardInfoIndex].color,
                cardCost: cardInfo[cardInfoIndex].energy,
                medianPrice: cardInfo[cardInfoIndex].medianPrice,
                marketPrice: cardInfo[cardInfoIndex].marketPrice,

            });
        }
        } else {
            console.log("couldn't find", card);
        }
    });
    return cards;
}

function promptUser(cards: any): number {
    const promptSync = require('prompt-sync')({sigint: true});
    const promptMessage = createPrompt(cards);
    console.log(promptMessage.join('\n'));
    let index: string | number = promptSync();
    index = Number(index);

    return index;
}

function createPrompt(cards: any): string[]{
    const prompt: string[] = [];
    prompt.push("Which card code do you have?");
    cards.forEach((card) => {
        prompt.push(card.cardNumber);
    });
    return prompt;
}

// promptUser('test');
main();