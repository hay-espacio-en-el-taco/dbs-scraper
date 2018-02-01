'use strict'
const
    Fetch = require('node-fetch'),
    Cheerio = require('cheerio')


const DBS_DATA_URL = 'http://www.dbs-cardgame.com/cardlist/?search=true&category=428001'

Fetch(DBS_DATA_URL)
    .then( res =>  res.text() )
    .then( body => Cheerio.load(body) )
    .then( 
        $ => 
            $('ul.list-inner').children().map( (index, cardDomHtml) => ({
                    'cardNumber': $(cardDomHtml).find('dt.cardNumber').text(),
                    'cardName': $(cardDomHtml).find('dd.cardName').text()
                }) ).get()
    )
    .then( console.log )