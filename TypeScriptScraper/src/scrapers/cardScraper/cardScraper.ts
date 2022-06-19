import axios from 'axios';
import cheerio from 'cheerio';
import { ICard } from '../../shared/interfaces/ICard';
import { ICardListUrl } from '../../shared/interfaces/ICardListUrl';

/**
 * Constants
 */
const SKILL_CLEANUP_REGEXP = /<img(?:.(?!_ball.png))+?alt="(.*?)".*?>/g;
const COST_CLEANUP_REGEXP =
    /<img src=.+?\/cardlist\/common\/(.)(?:[^_]+)_ball.png.*?>/g;
const SKILLS_REGEXP = /\[(.+?)\]/g;
const CHARACTERS_REGEXP = /<(.+?)>/g;
const SPECIAL_TRAITS_REGEXP = /≪(.+?)≫/g;
const CARD_NAMES_REGEXP = /{(.+?)}/g;
const LINE_BREAK_REGEXP = /<br\s*?\/?>/g;

/**
 * Globals
 */
const AxiosInstance = axios.create();

/**
 * Takes a list of urls that point to the dbs-cardgame.com card list database
 * and returns a list of cards
 * @param {ICardListUrl[]} urlsInfoList - ICardListUrl[]
 * @returns {Promise<ICard[]>} An array of cards
 */
export async function CardsScraper(urlsInfoList: ICardListUrl[]): Promise<ICard[]> {
    const promiseList = urlsInfoList.map((info) => scrapeUrl(info.url));

    const results = await Promise.all(promiseList);
    const allCards: ICard[] = Array.prototype.concat.apply([], results);

    return allCards;
}

async function scrapeUrl(url: string): Promise<ICard[]> {
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
                find("dl.seriesCol dd").html() || ''
            );
            const { skillDescription, skillKeywords, relatedCharacters, relatedSpecialTraits, relatedCardNames } = parseSkill(find('dl.skillCol dd').html() || '');

            const energy = parseEnergy(find('dl.energyCol dd').html() || '');
            const type = find('dl.typeCol dd').text();

            const power = Number(find('dl.powerCol dd').text().trim());
            const comboPower = Number(find('dl.comboPowerCol dd').text().trim());
            const comboEnergy = Number(find('dl.comboEnergyCol dd').text().trim());
            const rarity = find('dl.rarityCol dd').text().trim()

            return {
                type,
                cardName: find('dd.cardName').text().trim(),
                energy: energy.energy,
                cmc: energy.cmc,
                specifiedCost: energy.specifiedCost,
                color: find('dl.colorCol dd').text().trim().toLowerCase(),
                skillDescription,
                power: isNaN(power) ? null : power,
                comboPower: isNaN(comboPower) ? null : comboPower,
                comboEnergy: isNaN(comboEnergy) ? null : comboEnergy,
                character: find('dl.characterCol dd').text().trim(),
                specialTrait: find('dl.specialTraitCol dd').text().trim(),
                rarity: rarity.split('[')[0],
                rarityShorthand: rarity.split('[')[1].replace(']',''),
                cardNumber: find('dt.cardNumber').text().trim(),
                skillKeywords,
                relatedCharacters,
                relatedSpecialTraits,
                relatedCardNames,
                era: find('dl.eraCol dd').text().trim(),
                seriesName,
                seriesFullName,
                availableDate: find('dl.availableDateCol dd').text().trim(),
                cardImageUrl: getImageUrl(find('.cardimg > img')).trim(),
                cardBack: type === 'LEADER' ? getBackCard(elem.find('.cardBack')) : null,
            } as ICard;
        });
}

/**
 * It takes a string of HTML, splits it on `<br>` tags, and returns an object with two properties:
 * `seriesName` and `seriesFullName`.
 * @param {string} rawHtml - The raw HTML from the page.
 * @returns An object with two properties: seriesName and seriesFullName.
 */
function parseSeries(rawHtml: string): { seriesName: string, seriesFullName: string } {
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

/**
 * It takes a raw HTML string, cleans it up, and returns a JSON object with the skill description,
 * keywords, related characters, related special traits, and related card names
 * @param {string} rawHtml - The raw HTML of the skill description.
 * @returns An object with the following properties:
 * - skillDescription: string
 * - skillKeywords: string[]
 * - relatedCharacters: string[]
 * - relatedSpecialTraits: string[]
 * - relatedCardNames: string[]
 */
function parseSkill(rawHtml: string): { skillDescription: string, skillKeywords: string[], relatedCharacters: string[], relatedSpecialTraits: string[], relatedCardNames: string[] } {
    // console.log(rawHtml, '\n');
    let newHtml = rawHtml.replace(LINE_BREAK_REGEXP, '\n').replace(SKILL_CLEANUP_REGEXP, '[$1]').replace(COST_CLEANUP_REGEXP, '{$1}');
    newHtml = newHtml.replace('[one]','{1}').replace('[two]','{2}').replace('[three]','{3}').replace('[four]','{4}').replace('[five]','{5}');
    let skillDescription = replaceSpecialChars(newHtml);
    skillDescription = removeVerboseText(skillDescription);

    const skillKeywords = getMatches(SKILLS_REGEXP, skillDescription) as string[];
    const relatedCharacters = getMatches(CHARACTERS_REGEXP, skillDescription) as string[];
    const relatedSpecialTraits = getMatches(SPECIAL_TRAITS_REGEXP, skillDescription) as string[];
    const relatedCardNames = getMatches(CARD_NAMES_REGEXP, skillDescription) as string[];

    return { skillDescription, skillKeywords, relatedCharacters, relatedSpecialTraits, relatedCardNames };
}

/**
 * It replaces special characters with their ASCII equivalents
 * @param {string} rawHtml - The raw HTML string that you want to replace special characters in.
 * @returns a string with all the special characters replaced with their normal counterparts.
 */
function replaceSpecialChars(rawHtml: string): string {
    return rawHtml
        .replace(/[\uFF1C]/g, '<').replace(/[\uFF1E]/g, '>')
        .replace(/[\u300A]/g, '≪').replace(/[\u300B]/g, '≫')
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

/**
 * It removes all the text that is not relevant to the card's effect
 * @param {string} rawHtml - The raw HTML of the card page.
 * @returns A string with all the verbose text removed.
 */
function removeVerboseText(rawHtml: string): string {
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
        .replace(/\(Only 1 copy of this card can be played in your Battle Area.?\)/g, '') //[Unique]
}

/**
 * Obtain matches of the regular expression for the skillDescription that is passed in
 * @param {RegExp} regexp - Regular expression of what we are trying to seek
 * @param {string} skillDescription - string in which we are seeking the regular expression
 * @returns {string[]} - an array of all matches.
 */
function getMatches(regexp: RegExp, skillDescription: string): string[] {
    let currentSet = new Set();
    let match: any = [];
    while ((match = regexp.exec(skillDescription)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (match.index === regexp.lastIndex) {
            regexp.lastIndex++;
        }
        currentSet.add(match[1]);
    }
    return [...currentSet] as string[];
}

/**
 *
 * @param {string} rawHtml
 * @returns {string}
 */
function parseEnergy(rawHtml: string): { energy: string | null, cmc: number | null, specifiedCost: number | null } {
    if (!rawHtml) {
        return { energy: null, cmc: null, specifiedCost: null };
    }
    // console.log(rawHtml, '\n')
    const regexp = /<img src=.+?\/cardlist\/common\/(.)(?:[^_]+)_ball.png.*?>/g;
    let energyDescription = rawHtml.replace(regexp, '{$1}').replace(/&#x2010;/g, '-').replace('(', '').replace(')', '');
    energyDescription = '{' + energyDescription.slice(0, 1) + '}' + energyDescription.slice(1);
    const energyMatch = energyDescription.match(/{.}/g) || [];
    let cmc = 0;
    let specifiedCost = 0;
    for (let energyStr of energyMatch) {
        if (energyStr.length === 4) {
            cmc += isNaN(Number(energyStr.slice(1, 3))) ? 0 : Number(energyStr.slice(1, 3));

        } else {
            cmc += isNaN(Number(energyStr[1])) ? 0 : Number(energyStr[1]);
        }
        if (isNaN(Number(energyStr[1])) && energyStr[1] !== 'X') {
            specifiedCost++;
        }
    }
    cmc = cmc < specifiedCost ? specifiedCost : cmc;
    return { energy: energyDescription, cmc, specifiedCost };
}

function getImageUrl(elem: any) {
    return elem.attr('src').replace('../..', 'http://www.dbs-cardgame.com');
}

function getBackCard(elem: any) {
    const find = elem.find.bind(elem);
    const { skillDescription, skillKeywords, relatedCharacters, relatedSpecialTraits, relatedCardNames } = parseSkill(find('dl.skillCol > dd').html());

    const power = Number(find('dl.powerCol dd').text().trim());
           
    return {
        cardName: find('dd.cardName').text().trim(),
        color: find('dl.colorCol dd').text().trim().toLowerCase(),
        skillDescription,
        power: isNaN(power) ? null : power,
        character: find('dl.characterCol dd').text().trim(),
        specialTrait: find('dl.specialTraitCol dd').text().trim(),
        skillKeywords,
        relatedCharacters,
        relatedSpecialTraits,
        relatedCardNames,
        era: find('dl.eraCol dd').text().trim(),
        cardImageUrl: getImageUrl(find('.cardimg > img')).trim(),
    };
}