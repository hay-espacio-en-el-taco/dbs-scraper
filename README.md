# dbs-scraper

### Build it
`docker build -t dbs-scrapper .`

### Run it
`docker run -it --rm --name scrapper -v ${PWD}/src:/home/node/app/src dbs-scrapper`