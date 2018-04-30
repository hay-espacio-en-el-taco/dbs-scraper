FROM node:9

ENV SCRAPER_FOLDER /home/node/app/scraper
ENV WEBPAGE_FOLDER /home/node/app/web-page
ENV CARDS_DATA_OUTPUT ${WEBPAGE_FOLDER}/cards.json

WORKDIR ${SCRAPER_FOLDER}
ADD ./scraper/package.json ${SCRAPER_FOLDER}/package.json
RUN npm install

WORKDIR ${WEBPAGE_FOLDER}
ADD ./web-page/package.json ${WEBPAGE_FOLDER}/package.json
RUN npm install

ADD ./scraper ${SCRAPER_FOLDER}
ADD ./web-page ${WEBPAGE_FOLDER}

EXPOSE 3000

RUN if [ ! -f ${CARDS_DATA_OUTPUT} ]; then \
    npm start --prefix ${SCRAPER_FOLDER} ; \
    fi


CMD [ "npm", "start" ]