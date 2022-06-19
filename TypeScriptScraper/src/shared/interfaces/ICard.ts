import { ICardBack } from "./ICardBack";

export interface ICard {
    type: string;
    cardName: string;
    energy: string;
    cmc: number;
    specifiedCost: number;
    color: string;
    skillDescription: string;
    power: number;
    comboPower: number;
    comboEnergy: number;
    character: string;
    specialTrait: string;
    rarity: string;
    rarityShorthand: string;
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