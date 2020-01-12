#!/bin/bash
CARDS_FILE=${CARDS_OUTPUT:-./web-page/src/cards.json}
OLD_CARDS_FILE=${OLD_CARDS_FILE:-./web-page/src/cards.json}
CHANGELOG_OUTPUT=${CHANGELOG_OUTPUT:-./web-page/src/changelog.cards.txt}

CARDS_CONTAINER="/home/node/app/cards.json"
OLD_CARDS_CONTAINER="/home/node/app/cards.old.json"
CHANGELOG_CONTAINER="/home/node/app/changelog.cards.txt"
CHANGELOG_SCRIPT="/home/node/app/src/tools/changelog.js"

# Get the absolute paths
CARDS_FILE="$(cd "$(dirname "${CARDS_FILE}")"; pwd)/$(basename "${CARDS_FILE}")"
OLD_CARDS_FILE="$(cd "$(dirname "${OLD_CARDS_FILE}")"; pwd)/$(basename "${OLD_CARDS_FILE}")"

if [[ -f "$CARDS_FILE" && -f "$OLD_CARDS_FILE" ]]; 
    then
        docker run --name dbs-scraper -v ${CARDS_FILE}:${CARDS_CONTAINER} -v ${OLD_CARDS_FILE}:${OLD_CARDS_CONTAINER} dbs-scraper node ${CHANGELOG_SCRIPT} ${CARDS_CONTAINER} ${OLD_CARDS_CONTAINER}
        docker cp dbs-scraper:${CHANGELOG_CONTAINER} ${CHANGELOG_OUTPUT}
        docker rm dbs-scraper
        echo "Changelog file extracted to ${CHANGELOG_OUTPUT}"
    else 
        echo "Either ${CARDS_FILE} or ${OLD_CARDS_FILE} are files."
fi
