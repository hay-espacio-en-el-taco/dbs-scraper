'use strict'

// Imports
const Fetch = require('node-fetch')
const Cheerio = require('cheerio')

// Module constants
const DBS_DATA_BASE_URL = 'http://www.dbs-cardgame.com/us-en/cardlist/?search=true&category='
const HREF_REGEXP = /.*?\?.*?category=(?<category>.+)$/


const extractCategoryFromhref = (hrefString) => {
    const match = hrefString.match(HREF_REGEXP)

    return match.groups.category
}

const extractInfoFromItemNode = $ => itemNode => {
    const cheerioElement = $(itemNode)
    const href = cheerioElement.attr('href')
    const category = extractCategoryFromhref(href)

    return {
        name: cheerioElement.text(),
        href, category, url: `${DBS_DATA_BASE_URL}${category}`
    }
}

const getCardListUrls = async (cardListUrl) => {
    const response = await Fetch(cardListUrl)
    const body = await response.text()
    const $ = Cheerio.load(body)
    
    const navListItems = $('ul#snaviList li a')
    const urlsInfo = navListItems.toArray().map(extractInfoFromItemNode($))

    return urlsInfo
}


module.exports = getCardListUrls