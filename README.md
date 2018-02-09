# dbs-scraper

### Build it
`docker build -t dbs-scrapper .`

### Run it
`docker run -it --rm --name scrapper -e OUTPUT_PATH=${PWD}\cards.json -v ${PWD}/src:/home/node/app/src dbs-scrapper`