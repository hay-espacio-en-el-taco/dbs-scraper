import { ICardBack } from "./ICardBack";

export interface ICard {
    type: string;
    cardName: string;
    energy: string;
    color: string;
    skillDescription: string;
    power: string;
    comboPower: string;
    comboEnergy: string;
    character: string;
    specialTrait: string;
    rarity: string;
    cardNumber: string;
    skillKeywords: string[];
    relatedCharacters: string[];
    relatedSpecialTraits: string[];
    relatedCardNames: string[];
    era: string;
    seriesName: string;
    seriesFullName: string;
    availableDate: string;
    cardImageUrl: string;
    cardBack: ICardBack;
}