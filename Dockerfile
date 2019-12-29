FROM node:13.5

ENV SCRAPER_FOLDER /home/node/app/scraper
ENV WEBPAGE_FOLDER /home/node/app/web-page
ENV CARDS_DATA_OUTPUT ${SCRAPER_FOLDER}/src/cards.json

WORKDIR ${SCRAPER_FOLDER}
ADD ./scraper/package.json ${SCRAPER_FOLDER}/package.json
RUN npm install

WORKDIR ${WEBPAGE_FOLDER}
ADD ./web-page/package.json ${WEBPAGE_FOLDER}/package.json
RUN npm install

ADD ./scraper ${SCRAPER_FOLDER}
ADD ./web-page ${WEBPAGE_FOLDER}

EXPOSE 3000
EXPOSE 9229

RUN if [ ! -f ${CARDS_DATA_OUTPUT} ]; then \
    npm start --prefix ${SCRAPER_FOLDER} ; \
    cp ${CARDS_DATA_OUTPUT} ${WEBPAGE_FOLDER}/src/cards.json  ; \
    fi

CMD [ "npm", "start" ]