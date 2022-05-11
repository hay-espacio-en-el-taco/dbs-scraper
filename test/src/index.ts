import axios from "axios";
import cheerio from "cheerio";
import { writeFileSync } from "fs";

import path from 'path';
import { GetCardListUrls } from "./navListScraper/navListScaper";

/**
 * constants
 */
const DEFAULT_OUTPUT = path.join(__dirname, '..', 'cards.json')
const CARD_LIST_URL = "http://www.dbs-cardgame.com/us-en/cardlist/?search=true";
const AxiosInstance = axios.create();


/**
 * Main function of the code.
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
 * Card Scraper
 */
/**
 * Constants of the Card Scraper
 */
const SKILL_CLEANUP_REGEXP = /<img(?:.(?!_ball.png))+?alt="(.*?)".*?>/g;
const COST_CLEANUP_REGEXP =
    /<img src=.+?\/cardlist\/common\/(.)(?:[^_]+)_ball.png.*?>/g;
const SKILLS_REGEXP = /\[(.+?)\]/g;
const CHARACTERS_REGEXP = /<(.+?)>/g;
const SPECIAL_TRAITS_REGEXP = /≪(.+?)≫/g;
const CARD_NAMES_REGEXP = /{(.+?)}/g;
const LINE_BREAK_REGEXP = /<br\s*?\/?>/g;

async function CardsScraper(urlsInfoList) {
    const promiseList = urlsInfoList.map((info) => scrapeUrl(info.url));

    const results = await Promise.all(promiseList);
    const allCards = Array.prototype.concat.apply([], results);

    return allCards;
}

async function scrapeUrl(url) {
    const response = await AxiosInstance.get(url);
    const body = await response.data;
    const $ = cheerio.load(body);

    return $("ul.list-inner > li")
        .toArray()
        .map((cardDomHtml) => {
            const elem = $(cardDomHtml);
            const cardFront = elem.find(".cardFront");
            const find = cardFront.find.bind(cardFront);

            const { seriesName, seriesFullName } = parseSeries(
                find("dl.seriesCol dd").html()
            );
            const { skillDescription, skillKeywords, relatedCharacters, relatedSpecialTraits, relatedCardNames } = parseSkill(find('dl.skillCol dd').html());

            const energy = parseEnergy(find('dl.energyCol dd').html());
            const type = find('dl.typeCol dd').text();

            return {
                type,
                cardName: find('dd.cardName').text(),
                energy,
                color: find('dl.colorCol dd').text(),
                skillDescription,
                power: find('dl.powerCol dd').text(),
                comboPower: find('dl.comboPowerCol dd').text(),
                comboEnergy: find('dl.comboEnergyCol dd').text(),
                character: find('dl.characterCol dd').text(),
                specialTrait: find('dl.specialTraitCol dd').text(),
                rarity: find('dl.rarityCol dd').text(),
                cardNumber: find('dt.cardNumber').text(),
                skillKeywords,
                relatedCharacters,
                relatedSpecialTraits,
                relatedCardNames,
                era: find('dl.eraCol dd').text(),
                seriesName,
                seriesFullName,
                availableDate: find('dl.availableDateCol dd').text(),
                cardImageUrl: getImageUrl(find('.cardimg > img')),
                cardBack: type === 'LEADER' ? getBackCard(elem.find('.cardBack')) : null,
            }
        });
}

function parseSeries(rawHtml) {
    const series = rawHtml.split(/<br\/?>/g);
    return {
        seriesName: series[0],
        seriesFullName: series[1]
            ? series[1]
                .replace(/\&\#xFF5E; ?/g, "~")
                .replace(/&#x2019;/g, "'")
                .replace(/&#x3010;/g, "[")
                .replace(/&#x3011;/g, "]")
            : series[0],
    };
}

function parseSkill(rawHtml): { [key: string]: any } {
    const newHtml = rawHtml.replace(LINE_BREAK_REGEXP, '\n').replace(SKILL_CLEANUP_REGEXP, '[$1]').replace(COST_CLEANUP_REGEXP, '$1');
    let skillDescription = replaceSpecialChars(newHtml);
    skillDescription = removeVerboseText(skillDescription);

    const skillKeywords = getMatches(SKILLS_REGEXP, skillDescription);
    const relatedCharacters = getMatches(CHARACTERS_REGEXP, skillDescription);
    const relatedSpecialTraits = getMatches(SPECIAL_TRAITS_REGEXP, skillDescription);
    const relatedCardNames = getMatches(CARD_NAMES_REGEXP, skillDescription);

    return { skillDescription, skillKeywords, relatedCharacters, relatedSpecialTraits, relatedCardNames };
}

function replaceSpecialChars(rawHtml) {
    return rawHtml
        .replace(/&#xFF1C;/g, '<').replace(/&#xFF1E;/g, '>')
        .replace(/&#x300A;/g, '≪').replace(/&#x300B;/g, '≫')
        .replace(/&#x226A;/g, '≪').replace(/&#x226B;/g, '≫')
        .replace(/&lt;</g, '≪').replace(/[=\"].+?>&gt;/g, '≫')
        .replace(/&apos;/g, "'").replace(/&#x2019;/g, "'")
        .replace(/&#x3010;/g, '[').replace(/&#x3011;/g, ']')
        .replace(/&#xFF08;/g, '(').replace(/&#xFF09;/g, ')')
        .replace(/&#x3008;/g, '<').replace(/&#x3009;/g, '>')
        .replace(/&#xFF5B;/g, '{').replace(/&#xFF5D;/g, '}')
        .replace(/&#x2010;/g, '-')
        .replace(/&#xFF1A;/g, ":")
        .replace(/&#xFF0C;/g, ",")
        .replace(/&quot;/g, '"')
        .replace(/&#x3000;/g, ' ')
        .replace(/&#x30FB;/g, '・')
        .replace(/&#xFF0D;/g, '-')
        .replace(/&#xFF23;/g, 'C')
        .replace(/&#xFF25;/g, 'E')
        .replace(/&#xFF52;/g, 'r')
        .replace(/&#xFF11;/g, '1')
        .replace(/&#xFF17;/g, '7');
}

function removeVerboseText(rawHtml) {
    return rawHtml
        .replace(/\(If this card is placed in an Energy Area from any area, it must be placed there in Rest Mode.?\)/g, '') //[Energy-Exhaust]
        .replace(/\((?:Once|Twice) per turn, when this card attacks,\s*(?:\\n)?switch this card to Active Mode after the battle.?\)/g, '') //[Dual|Triple Attack]
        .replace(/\(Place 1 each of the specified card with the same power (?:from your hand )?into your Drop Area and play this card.?\)/g, '') //[Union-Fusion]
        .replace(/\(Place this card in Active Mode(?: from your hand)? on top of the \d+ specified cards stacked together.?\)/g, '') //[Union-Potara]
        .replace(/\(Play the specified card from your hand, then return this card to your hand.?\)/g, '') //[Swap]
        .replace(/\(Play this card in Active Mode by sending the specified card from your Battle Area to your Warp.?\)/g, '') //[Xeno-Evolve]
        .replace(/\(Play this card on top of the specified card.?\)/g, '') //[Evolve]
        .replace(/\(This card can\'t be chosen by the skills of your opponent\'s cards.?\)/g, '') //[Barrier]
        .replace(/\(This card inflicts \d+ damage instead of 1 when attacking.?\)/g, '') //[Double|Triple Strike]
        .replace(/\(This card is not KO-ed or removed from the Battle Area by neither battle nor your opponent\'s card skills.?\)/g, '') //[Indestructible]
        .replace(/\(This card cannot be KO-ed by your opponent\'s card\'s skills or battle and does not leave the Battle Area.?\)/g, '') //[Indestructible]
        .replace(/\(This skill takes effect when you have \d+ or more cards in your Drop Area.?\)/g, '') //[Sparking X]
        .replace(/\(This skill takes effect when you have \d+ or more(?: of the specified)? Battle Cards in play.?\)/g, '') //[Bond X]
        .replace(/\(When one of your other cards is attacked, you may switch this card to Rest Mode and change the target of the attack to this card.?\)/g, '') //[Blocker]
        .replace(/\(When this card inflicts damage to your opponent\'s life, they place that many cards in (?:the|their) Drop Area instead of their hand.?\)/g, '') //[Critical]
        .replace(/\(When this card is attacked, KO the attacking card after the battle.?\)/g, '') //[Revenge]
        .replace(/\(Without paying its energy cost, play this card on top of the specified card.?\)/g, '') //[Evolve]
        .replace(/\(You must place the top \d+ cards of your deck in your Drop Area to activate this skill.?\)/g, '') //[Burst X]
        .replace(/\(You can only include up to 4 cards with \[Super Combo\] in your deck.?\)?/g, '') //[Super Combo]
        .replace(/\(Place and activate this card in (?:the|your) Battle Area. It remains in (?:the|your) Battle Area until you activate another \[Field\](?: card)?. When you do, place this card in (?:the|its owner\'s) Drop Area.?\)/g, '') //[Field]
        .replace(/\(You can include as many copies of cards with \[Dragon Ball\] in your deck as you like, as long as the total number doesn't exceed 7.?\)/g, '') //[Dragon Ball]
        .replace(/\(This card isn\'t affected by \[Counter Play\] skills.?\)/g, '') //[Deflect]
        .replace(/\(You can only include 1 copy of a card with \[Ultimate\] in your deck.?\)/g, '') //[Ultimate]
        .replace(/\(You can activate \[Over Realm\] and \[Dark Over Realm\] up to a total 2 times a turn.?\)/g, '') //[Wormhole]
        .replace(/\(If you have at least \d+ black cards in your Drop Area, you can play this card by sending all cards in your Drop Area to your Warp. \[Over Realm\] and \[Dark Over Realm\] can only be activated once per turn.?\)/g, '') //[DARK Over Realm X]
        .replace(/\(If you have at least \d+ cards in your Drop Area, you can play this card (?:from your hand )?by sending all cards in your Drop Area to your Warp.\s+At the end of that turn, send this card from the Battle Area to your Warp.\s+\[Over Realm\] can (?:only )?be activated once per turn.?\)/g, '') //[Over Realm X]
}

function getMatches(regexp, skillDescription) {
    let currentSet = new Set();
    let match: any = [];
    while ((match = regexp.exec(skillDescription)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (match.index === regexp.lastIndex) {
            regexp.lastIndex++;
        }
        currentSet.add(match[1]);
    }
    return [...currentSet];
}

function parseEnergy(rawHtml: string) {
    if (!rawHtml) {
        return null;
    }

    const regexp = /<img src=.+?\/cardlist\/common\/(.)(?:[^_]+)_ball.png.*?>/g;
    let match: any;
    while ((match = regexp.exec(rawHtml)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (match.index === regexp.lastIndex) {
            regexp.lastIndex++;
        }
    }
    const energyDescription = rawHtml.replace(regexp, '($1)').replace(/&#x2010;/g, '-');
    return energyDescription;
}

function getImageUrl(elem) {
    return elem.attr('src').replace('../..', 'http://www.dbs-cardgame.com');
}

function getBackCard(elem) {
    const find = elem.find.bind(elem);
    const { skillDescription, skillKeywords, relatedCharacters, relatedSpecialTraits, relatedCardNames } = parseSkill(find('dl.skillCol > dd').html());

    return {
        cardName: find('dd.cardName').text(),
        color: find('dl.colorCol dd').text(),
        skillDescription,
        power: find('dl.powerCol dd').text(),
        character: find('dl.characterCol dd').text(),
        specialTrait: find('dl.specialTraitCol dd').text(),
        skillKeywords,
        relatedCharacters,
        relatedSpecialTraits,
        relatedCardNames,
        era: find('dl.eraCol dd').text(),
        cardImageUrl: getImageUrl(find('.cardimg > img')),
    };
}

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