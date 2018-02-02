'use strict'
const
    Fetch = require('node-fetch'),
    Cheerio = require('cheerio')


const DBS_DATA_URL = 'http://www.dbs-cardgame.com/cardlist/?search=true&category=428001'

const parseSkill = rawHtml => {
    return rawHtml
}

const getBackCard = elem => {
    const find = elem.find.bind(elem)
    return {
        'cardNumber': find('dt.cardNumber').text(),
        'cardName': find('dd.cardName').text(),
        'series': find('dl.seriesCol dd').text(),
        'rarity': find('dl.rarityCol dd').text(),
        'type': find('dl.typeCol dd').text(),
        'color': find('dl.colorCol dd').text(),
        'power': find('dl.powerCol dd').text(),
        'character': find('dl.characterCol dd').text(),
        'specialTrait': find('dl.specialTraitCol dd').text(),
        'era': find('dl.eraCol dd').text(),
        'skill': parseSkill( find('dl.skillCol dd').html() ),
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
                      find = cardFront.find.bind(cardFront)

                const type = find('dl.typeCol dd').text()
                return {
                    'cardNumber': find('dt.cardNumber').text(),
                    'cardName': find('dd.cardName').text(),
                    'series': find('dl.seriesCol dd').text(),
                    'rarity': find('dl.rarityCol dd').text(),
                    'type': type,
                    'color': find('dl.colorCol dd').text(),
                    'power': find('dl.powerCol dd').text(),
                    'character': find('dl.characterCol dd').text(),
                    'specialTrait': find('dl.specialTraitCol dd').text(),
                    'era': find('dl.eraCol dd').text(),
                    'skill': parseSkill( find('dl.skillCol dd').html() ),
                    'availableDate': find('dl.availableDateCol dd').text(),
                    'cardBack': type === 'LEADER' ? getBackCard( elem.find('.cardBack') ) : null
                }

            } ).get()
    )
    .then( allCards => allCards[0] )
    .then( console.log )