'use strict'
const
    Fetch = require('node-fetch'),
    Cheerio = require('cheerio'),
    fs = require('fs')


const DBS_DATA_URLS = [
    'http://www.dbs-cardgame.com/cardlist/?search=true&category=428001', // BT1 - Galactic Battle
    'http://www.dbs-cardgame.com/cardlist/?search=true&category=428901', // Promos
    'http://www.dbs-cardgame.com/cardlist/?search=true&category=428301', // SD1 - The Awakening
    'http://www.dbs-cardgame.com/cardlist/?search=true&category=428002', // BT2 - Union Force
    'http://www.dbs-cardgame.com/cardlist/?search=true&category=428401', // EX01 - Expansion Deck Box 01
    'http://www.dbs-cardgame.com/cardlist/?search=true&category=428402', // EX02 - Expansion Deck Box 02
    'http://www.dbs-cardgame.com/cardlist/?search=true&category=428003'  // BT3 - Cross Worlds
]

const parseSkill = rawHtml => {

    const regexp = /<img.*?alt="(.*?)".*?>/g;
    let match, skillKeywords = [];
    while ((match = regexp.exec(rawHtml)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (match.index === regexp.lastIndex) {
            regexp.lastIndex++;
        }

        skillKeywords.push(match[1])
    }
    
    const skillDescription = replaceSpecialChars(rawHtml.replace(regexp, '[$1]').replace(/<br\/?>/g, '\n'))

    return { skillDescription, skillKeywords }
}

const parseEnergy = rawHtml => {
    if (!rawHtml) {
        return null;
    }
    const regexp = /<img src="..\/images\/cardlist\/common\/(.).*?_ball.png".*?>/g;
    let match;
    while ((match = regexp.exec(rawHtml)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (match.index === regexp.lastIndex) {
            regexp.lastIndex++;
        }
    }
    
    const energyDescription = rawHtml.replace(regexp, ' $1 ').replace(/&#x2010;/g, '-');
    return energyDescription;
}

const parseSeries = rawHtml => {
    const series = rawHtml.split(/<br\/?>/g)
    return {
        seriesName: series[0],
        seriesFullName: series[1] ? series[1].replace(/\&\#xFF5E; ?/g, '～').replace(/&#x2019;/g, "'") : series[0]
    }
}

const getBackCard = elem => {
    const find = elem.find.bind(elem),
          { skillDescription, skillKeywords } = parseSkill( find('dl.skillCol dd').html() )

    return {
        //'cardName': find('dd.cardName').text(),
        //'power': find('dl.powerCol dd').text(),
        skillDescription,
        //skillKeywords
    }
}

const replaceSpecialChars = rawHtml => {
    return rawHtml.replace(/&#xFF1C;/g, '＜').replace(/&#xFF1E;/g, '＞')
    .replace(/&#x300A;/g, '≪').replace(/&#x300B;/g, '≫')
    .replace(/&#x226A;/g, '≪').replace(/&#x226B;/g, '≫')
    .replace(/&lt;</g, '≪').replace(/[=\"].+?>&gt;/g, '≫')
    .replace(/&apos;/g, "'").replace(/&#x2019;/g, "'")
    .replace(/&#x3010;/g, '[').replace(/&#x3011;/g, ']')
    .replace(/&#xFF08;/g, '(').replace(/&#xFF09;/g, ')')
    .replace(/&#x2010;/g, '-')
    .replace(/&#xFF1A;/g, ":")
    .replace(/&#xFF0C;/g, ",")
    .replace(/&#xFF11;/g, 'one')
    .replace(/&quot;/g, '"')
    .replace(/&#x3000;/g, ' ')
    .replace('(This card inflicts 4 damage instead of 1 when attacking)', '')
    .replace('(This card inflicts 3 damage instead of 1 when attacking)', '')
    .replace('(This card inflicts 2 damage instead of 1 when attacking)', '')
    .replace('(Play this card on top of the specified card)', '')
    .replace('(When one of your other cards is attacked, you may switch this card to Rest Mode and change the target of the attack to this card)', '')
    .replace('(Once per turn, when this card attacks, switch this card to Active Mode after the battle)', '')
    .replace('(Twice per turn, when this card attacks, switch this card to Active Mode after the battle)', '')
    .replace('(When this card inflicts damage to your opponent\'s life, they place that many cards in their Drop Area instead of their hand)', '')
    .replace('(When this card inflicts damage to your opponent\'s life, they place that many cards in the Drop Area instead of their hand)', '')
    .replace('(When this card is attacked, KO the attacking card after the battle)', '')
    .replace('(Place and activate this card in the Battle Area. It remains in the Battle Area until you activate another [Field]. When you do, place this card in the Drop Area)', '')
    .replace('(This card cannot be KO-ed by your opponent\'s card\'s skills or battle and does not leave the Battle Area)', '')


}

const scrapUrl = url =>  
                    Fetch(url)
                        .then( res => res.text() )
                        .then( body =>  Cheerio.load(body) )
                        .then(
                            $ => 
                                $('ul.list-inner').children().map( (index, cardDomHtml) => {
                                    const elem = $(cardDomHtml),
                                        cardFront = elem.find('.cardFront'),
                                        find = cardFront.find.bind(cardFront),
                                        { seriesName, seriesFullName } = parseSeries( find('dl.seriesCol dd').html() ),
                                        { skillDescription, skillKeywords } = parseSkill( find('dl.skillCol dd').html() ),
                                        energy = parseEnergy( find('dl.energyCol dd').html() ),
                                        type = find('dl.typeCol dd').text()

                                    return {
                                        type,
                                        energy,
                                        'cardName': find('dd.cardName').text(),
                                        'power': find('dl.powerCol dd').text(),
                                        'comboPower': find('dl.comboPowerCol dd').text(),
                                        'comboEnergy': find('dl.comboEnergyCol dd').text(),
                                        'color': find('dl.colorCol dd').text(),
                                        skillDescription,
                                        //skillKeywords,
                                        'cardNumber': find('dt.cardNumber').text(),
                                        'rarity': find('dl.rarityCol dd').text(),
                                        'character': find('dl.characterCol dd').text(),
                                        'specialTrait': find('dl.specialTraitCol dd').text(),
                                        'era': find('dl.eraCol dd').text(),
                                        seriesName,
                                        seriesFullName,
                                        'availableDate': find('dl.availableDateCol dd').text(),
                                        'cardBack': type === 'LEADER' ? getBackCard( elem.find('.cardBack') ) : null
                                    }

                                } ).get()
                        )

const scrapMultipleUrls = urls => Promise.all( urls.map( scrapUrl ) ).then( results => [].concat.apply([], results) )


scrapMultipleUrls(DBS_DATA_URLS)
    .then( allCards => {
        const outputPath = process.env.OUTPUT_PATH || `${__dirname}/../cards.json`
        fs.writeFileSync( outputPath, JSON.stringify(allCards) )
        console.log(`Finished scraping ${allCards.length} cards. Wrote file to ${outputPath}`)
    } )