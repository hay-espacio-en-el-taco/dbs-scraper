#!/bin/bash
CARDS_OUTPUT=${CARDS_OUTPUT:-./web-page/src/cards.json}
CARDS_CONTAINER="/home/node/app/cards.json"
if [ ! -f "$CARDS_OUTPUT" ]; then
    docker run --name dbs-scraper dbs-scraper npm start
    docker cp dbs-scraper:${CARDS_CONTAINER} ${CARDS_OUTPUT}
    docker rm dbs-scraper
    echo "Cards file extracted to ${CARDS_OUTPUT}"
fi
