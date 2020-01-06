FROM node:13.5

ENV WEBPAGE_FOLDER /home/node/app

WORKDIR ${WEBPAGE_FOLDER}
ADD ./package.json ${WEBPAGE_FOLDER}/package.json
RUN npm install

ADD . ${WEBPAGE_FOLDER}
RUN ls ./src

EXPOSE 3000
EXPOSE 9229

CMD [ "npm", "start" ]