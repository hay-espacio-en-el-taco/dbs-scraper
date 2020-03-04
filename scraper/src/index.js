'use strict'

// Imports
const CardsScraper = require('./cards')
const FS = require('fs')
const GetCardListUrls = require('./navListScraper')
const Path = require('path')
const { getUniqueValuesByProperty } = require('./utils')

// Module constants
const CARD_LIST_URL = 'http://www.dbs-cardgame.com/us-en/cardlist/'
const DEFAULT_OUTPUT = Path.join(__dirname, '..', 'cards.json')

async function main() {
    console.log('Getting urls from navigation sidebar...')
    const urlsList = await GetCardListUrls(CARD_LIST_URL)
    console.log(`Fetched ${urlsList.length} urls!.`)

    console.log('Getting cards...')
    const cards = await CardsScraper(urlsList)
    console.log(`Fetched and parsed a total of ${cards.length} cards!.`)

    // Extract unique attributes from the cards
    const attributes = getUniqueValuesByProperty(cards)

    const outputPath = process.env.CARDS_DATA_OUTPUT || DEFAULT_OUTPUT
    FS.writeFileSync( outputPath, JSON.stringify({ urlsList, cards, attributes }) )
    console.log(`Cards data saved at "${outputPath}".`)
}

main()
