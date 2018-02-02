'use strict'
const
    Fetch = require('node-fetch'),
    Cheerio = require('cheerio')


const DBS_DATA_URL = 'http://www.dbs-cardgame.com/cardlist/?search=true&category=428001'

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
    
    const skillDescription = rawHtml.replace(regexp, '[$1]').replace(/<br\/?>/g, '\n')
    return { skillDescription, skillKeywords }
}

const parseSeries = rawHtml => {
    const series = rawHtml.split(/<br\/?>/g)
    return {
        seriesName: series[0],
        seriesFullName: series[1].replace(/\&\#xFF5E; ?/g, '')
    }

}

const getBackCard = elem => {
    const find = elem.find.bind(elem),
          { seriesName, seriesFullName } = parseSeries( find('dl.seriesCol dd').html() ),
          { skillDescription, skillKeywords } = parseSkill( find('dl.skillCol dd').html() )

    return {
        seriesName,
        seriesFullName,
        skillDescription,
        skillKeywords,
        'cardNumber': find('dt.cardNumber').text(),
        'cardName': find('dd.cardName').text(),
        'rarity': find('dl.rarityCol dd').text(),
        'type': find('dl.typeCol dd').text(),
        'color': find('dl.colorCol dd').text(),
        'power': find('dl.powerCol dd').text(),
        'character': find('dl.characterCol dd').text(),
        'specialTrait': find('dl.specialTraitCol dd').text(),
        'era': find('dl.eraCol dd').text(),
        'availableDate': find('dl.availableDateCol dd').text(),
    }
}

Fetch(DBS_DATA_URL)
    .then( res =>  res.text() )
    .then( body => Cheerio.load(body) )
    .then( 
        $ => 
            $('ul.list-inner').children().map( (index, cardDomHtml) => {
                const elem = $(cardDomHtml),
                      cardFront = elem.find('.cardFront'),
                      find = cardFront.find.bind(cardFront),
                      { seriesName, seriesFullName } = parseSeries( find('dl.seriesCol dd').html() ),
                      { skillDescription, skillKeywords } = parseSkill( find('dl.skillCol dd').html() ),
                      type = find('dl.typeCol dd').text()

                return {
                    type,
                    seriesName,
                    seriesFullName,
                    skillDescription,
                    skillKeywords,
                    'cardNumber': find('dt.cardNumber').text(),
                    'cardName': find('dd.cardName').text(),
                    'rarity': find('dl.rarityCol dd').text(),
                    'color': find('dl.colorCol dd').text(),
                    'power': find('dl.powerCol dd').text(),
                    'character': find('dl.characterCol dd').text(),
                    'specialTrait': find('dl.specialTraitCol dd').text(),
                    'era': find('dl.eraCol dd').text(),
                    'availableDate': find('dl.availableDateCol dd').text(),
                    'cardBack': type === 'LEADER' ? getBackCard( elem.find('.cardBack') ) : null
                }

            } ).get()
    )
    .then( allCards => allCards[100] )
    .then( console.log )