#!/bin/bash
CARDS_FILE=${CARDS_OUTPUT:-./web-page/src/cards.json}
CHANGELOG_FILE=${CARDS_CHANGELOG_OUTPUT:-./web-page/src/changelog.cards.txt}
CARDS_CONTAINER="/home/node/app/cards.json"
CHANGELOG_CONTAINER="/home/node/app/changelog.cards.txt"
if [ ! -f "$CARDS_FILE" ]; then
    docker run --name dbs-scraper dbs-scraper /bin/bash -c "npm start node /home/node/app/src/tools/changelog.js ${CARDS_CONTAINER}"
    docker cp dbs-scraper:${CARDS_CONTAINER} ${CARDS_FILE}
    docker cp dbs-scraper:${CHANGELOG_CONTAINER} ${CHANGELOG_FILE}
    docker rm dbs-scraper
fi
