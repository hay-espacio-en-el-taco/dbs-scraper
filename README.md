# DBS Scraper & Deck Builder  (WIP) ![Travis Status](https://travis-ci.org/hay-espacio-en-el-taco/dbs-scraper.svg?branch=master)

Visit the Github Page of this project at [hay-espacio-en-el-taco.github.io/dbs-scraper](https://hay-espacio-en-el-taco.github.io/dbs-scraper/).


### Build it
`docker build -t dbs-scrapper .`

### Run it
`docker run -it --rm --name scrapper -v ${PWD}/web-page/src:/home/node/app/web-page/src -p 3000:3000 dbs-scrapper`


### Updating the url list to get the newest cards
Add the new urls in `DBS_DATA_URLS` array located at [./scraper/src/index.js](scraper/src/index.js) file.