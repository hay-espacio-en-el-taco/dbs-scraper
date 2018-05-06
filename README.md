# DBS Scraper & Deck Builder  (WIP) ![Travis Status](https://travis-ci.org/hay-espacio-en-el-taco/dbs-scraper.svg?branch=master)

Visit the Github Page of this project at [hay-espacio-en-el-taco.github.io/dbs-scraper](https://hay-espacio-en-el-taco.github.io/dbs-scraper/).



## Running this project

Download & install [Docker](https://www.docker.com)

### Build it
`docker build -t dbs-scraper .`

### Run it
* Run `docker run -it --rm --name scraper -p 3000:3000 dbs-scraper`
* Now visit `localhost:3000`

### Running for development
* Download the latest `cards.json` file from the [releases section of this repo](https://github.com/hay-espacio-en-el-taco/dbs-scraper/releases)
* Copy the `cards.json` file into the `/web-page/src` folder
* Run `docker run -it --rm --name scraper -v ${PWD}/web-page/src:/home/node/app/web-page/src -p 3000:3000 dbs-scraper` (note that we are mounting a volume)



### Updating the url list to get the newest cards
Add the new urls in `DBS_DATA_URLS` array located at [./scraper/src/index.js](scraper/src/index.js) file.