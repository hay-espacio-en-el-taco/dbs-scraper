#!/bin/bash
CARDS_FILE=./web-page/src/cards.json
if [ ! -f "$CARDS_FILE" ]; then
    docker run --name dbs-scraper dbs-scraper
    docker cp dbs-scraper:/home/node/app/cards.json $CARDS_FILE
    docker rm dbs-scraper
fi
