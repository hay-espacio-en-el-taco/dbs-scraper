'use strict'
const
    Fetch = require('node-fetch'),
    Cheerio = require('cheerio'),
    fs = require('fs')


const
    DEFAULT_OUTPUT = `${__dirname}/../cards.json`,
    DBS_DATA_BASE_URL = 'http://www.dbs-cardgame.com/us-en/cardlist/?search=true&category=',
    DBS_DATA_URLS = [
        DBS_DATA_BASE_URL + '428006', // BT6 - Detroyer Kings
        DBS_DATA_BASE_URL + '428005', // BT5 - Miraculous Revival
        DBS_DATA_BASE_URL + '428004', // BT4 - Colossal Warfare
        DBS_DATA_BASE_URL + '428003', // BT3 - Cross Worlds
        DBS_DATA_BASE_URL + '428002', // BT2 - Union Force
        DBS_DATA_BASE_URL + '428001', // BT1 - Galactic Battle
        DBS_DATA_BASE_URL + '428103', // TB3 - Clash of Fates
        DBS_DATA_BASE_URL + '428102', // TB2 - World Martial Arts Tournament
        DBS_DATA_BASE_URL + '428101', // TB1 - The Tournament of Power
        DBS_DATA_BASE_URL + '428308', // SD8 - Rising Broly
        DBS_DATA_BASE_URL + '428307', // SD7 - Shenrons Advent
        DBS_DATA_BASE_URL + '428306', // SD6 - Resurected Fusion
        DBS_DATA_BASE_URL + '428305', // SD5 - The Crimson Saian
        DBS_DATA_BASE_URL + '428304', // SD4 - The Guardian of Namekians
        DBS_DATA_BASE_URL + '428303', // SD3 - Dark Invasion
        DBS_DATA_BASE_URL + '428302', // SD2 - The Extreme Evolution
        DBS_DATA_BASE_URL + '428301', // SD1 - The Awakening
        DBS_DATA_BASE_URL + '428406', // EX06 - Special Aniversary Box 06
        DBS_DATA_BASE_URL + '428405', // EX05 - Expansion Deck Box 05
        DBS_DATA_BASE_URL + '428404', // EX04 - Expansion Deck Box 04
        DBS_DATA_BASE_URL + '428403', // EX03 - Ultimate Box
        DBS_DATA_BASE_URL + '428402', // EX02 - Expansion Deck Box 02
        DBS_DATA_BASE_URL + '428401', // EX01 - Expansion Deck Box 01
        DBS_DATA_BASE_URL + '428901'  // Promos
    ]

const parseSkill = rawHtml => {
    const skillCleanupRegexp = /<img.+?alt="(.*?)".*?>/g
    const costCleanupRegexp = /<img src=.+?\/cardlist\/common\/(.)(?:[^_]+)_ball.png.*?>/g

    const skillsRegexp = /\[(.+?)\]/g
    const charactersRegexp = /<(.+?)>/g
    const specialTraitsRegexp = /≪(.+?)≫/g
    const cardNamesRegexp = /{(.+?)}/g

    const newHtml = rawHtml.replace(/<br>/g, '\n').replace(skillCleanupRegexp, '[$1]').replace(costCleanupRegexp, '($1)')
    let skillDescription = replaceSpecialChars(newHtml)
    skillDescription = removeVerboseText(skillDescription)

    const skillKeywords = getMatches(skillsRegexp, skillDescription)
    const relatedCharacters = getMatches(charactersRegexp, skillDescription)
    const relatedSpecialTraits = getMatches(specialTraitsRegexp, skillDescription)
    const relatedCardNames = getMatches(cardNamesRegexp, skillDescription)

    return { skillDescription, skillKeywords, relatedCharacters, relatedSpecialTraits, relatedCardNames }
}

const getMatches = (regexp, skillDescription) => {
    let currentSet = new Set()
    let match = []
    while ((match = regexp.exec(skillDescription)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (match.index === regexp.lastIndex) {
            regexp.lastIndex++
        }
        currentSet.add(match[1])
    }
    return [...currentSet]
}

const parseEnergy = rawHtml => {
    if (!rawHtml) {
        return null
    }
    const regexp = /<img src=.+?\/cardlist\/common\/(.)(?:[^_]+)_ball.png.*?>/g
    let match
    while ((match = regexp.exec(rawHtml)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (match.index === regexp.lastIndex) {
            regexp.lastIndex++
        }
    }
    
    const energyDescription = rawHtml.replace(regexp, '($1)').replace(/&#x2010;/g, '-')
    return energyDescription
}

const parseSeries = rawHtml => {
    const series = rawHtml.split(/<br\/?>/g)
    return {
        seriesName: series[0],
        seriesFullName: series[1] 
            ? series[1].replace(/\&\#xFF5E; ?/g, '～').replace(/&#x2019;/g, "'") .replace(/&#x3010;/g, '[').replace(/&#x3011;/g, ']')
            : series[0]
    }
}

const replaceSpecialChars = rawHtml => {
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
        .replace(/&#xFF17;/g, '7')
}

const removeVerboseText = rawHtml => {
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

const getImageUrl = elem => elem.attr('src').replace('../..', 'http://www.dbs-cardgame.com')

const getBackCard = elem => {
    const find = elem.find.bind(elem),
          //{ seriesName, seriesFullName } = parseSeries( find('dl.seriesCol > dd').html() ),
          { skillDescription, skillKeywords, relatedCharacters, relatedSpecialTraits, relatedCardNames } = parseSkill( find('dl.skillCol > dd').html() )

    return {
        'cardName': find('dd.cardName').text(),
        'color': find('dl.colorCol dd').text(),
        skillDescription,
        'power': find('dl.powerCol dd').text(),
        'character': find('dl.characterCol dd').text(),
        'specialTrait': find('dl.specialTraitCol dd').text(),
        skillKeywords,
        relatedCharacters,
        relatedSpecialTraits,
        relatedCardNames,
        'era': find('dl.eraCol dd').text(),
        'cardImageUrl': getImageUrl( find('.cardimg > img') ),
    }
}

const scrapUrl = url =>  
                    Fetch(url)
                        .then( res => res.text() )
                        .then( body =>  Cheerio.load(body) )
                        .then(
                            $ => 
                                $('ul.list-inner > li').toArray().map( cardDomHtml => {
                                    const elem = $(cardDomHtml),
                                        cardFront = elem.find('.cardFront'),
                                        find = cardFront.find.bind(cardFront),
                                        { seriesName, seriesFullName } = parseSeries( find('dl.seriesCol dd').html() ),
                                        { skillDescription, skillKeywords, relatedCharacters, relatedSpecialTraits, relatedCardNames } = parseSkill( find('dl.skillCol dd').html() ),
                                        energy = parseEnergy( find('dl.energyCol dd').html() ),
                                        type = find('dl.typeCol dd').text()
                                    return {
                                        type,
                                        'cardName': find('dd.cardName').text(),
                                        energy,
                                        'color': find('dl.colorCol dd').text(),
                                        skillDescription,
                                        'power': find('dl.powerCol dd').text(),
                                        'comboPower': find('dl.comboPowerCol dd').text(),
                                        'comboEnergy': find('dl.comboEnergyCol dd').text(),
                                        'character': find('dl.characterCol dd').text(),
                                        'specialTrait': find('dl.specialTraitCol dd').text(),
                                        'rarity': find('dl.rarityCol dd').text(),
                                        'cardNumber': find('dt.cardNumber').text(),
                                        skillKeywords,
                                        relatedCharacters,
                                        relatedSpecialTraits,
                                        relatedCardNames,
                                        'era': find('dl.eraCol dd').text(),
                                        seriesName,
                                        seriesFullName,
                                        'availableDate': find('dl.availableDateCol dd').text(),
                                        'cardImageUrl': getImageUrl( find('.cardimg > img') ),
                                        'cardBack': type === 'LEADER' ? getBackCard( elem.find('.cardBack') ) : null
                                    }
                                } )
                        )

const scrapMultipleUrls = urls => Promise.all( urls.map( scrapUrl ) ).then( results => [].concat.apply([], results) )

scrapMultipleUrls(DBS_DATA_URLS)
    .then( allCards => {
        console.log(`Fetched and parsed a total of ${allCards.length} cards.`)
        const outputPath = process.env.CARDS_DATA_OUTPUT || DEFAULT_OUTPUT
        fs.writeFileSync( outputPath, JSON.stringify(allCards) )
        console.log(`Finished saving the cards data in "${outputPath}".`)

        const leaderCards = allCards.filter(card => card.type === 'LEADER')
        const extraCards = allCards.filter(card => card.type === 'EXTRA')
        const battleCards = allCards.filter(card => card.type === 'BATTLE')
        fs.writeFileSync( `${outputPath}_Leader`, JSON.stringify(leaderCards) )
        fs.writeFileSync( `${outputPath}_Extra`, JSON.stringify(extraCards) )
        fs.writeFileSync( `${outputPath}_Battle`, JSON.stringify(battleCards) )
    } )
    .catch(console.error)
