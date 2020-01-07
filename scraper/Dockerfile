FROM node:13.5

ENV APP_FOLDER /home/node/app
ENV CARDS_DATA_OUTPUT ${APP_FOLDER}/cards.json

WORKDIR ${APP_FOLDER}
ADD ./package.json ${APP_FOLDER}/package.json
RUN npm install

ADD . ${APP_FOLDER}
EXPOSE 9229

CMD [ "npm", "start" ]
