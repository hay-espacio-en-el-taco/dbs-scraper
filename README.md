# DBS Scraper & Deck Builder  (WIP) ![Travis Status](https://travis-ci.org/hay-espacio-en-el-taco/dbs-scraper.svg?branch=master)

Visit the Github Page of this project at [hay-espacio-en-el-taco.github.io/dbs-scraper](https://hay-espacio-en-el-taco.github.io/dbs-scraper/).


## Running this project with VSCode

First you will need to download and install [VSCode (v1.33.1 or better)](https://code.visualstudio.com) & [Docker](https://www.docker.com)

### Running & debugging Scraper app
* Open **VSCode**
* Move to **Debug tab** in **VSCode**.
* Select `Run Scraper` in the dropdown menu next to run button.
* Click the `Run` button *(F5)*.
* Enjoy your breakpoints! =D

### Running the React App (UI)
* Open **VSCode**.
* Go to `"Terminal" > "Run Task..."` and run the next tasks:
    * If it's the first time you run this app run the `Get cards.json file into web-page folder` task.
    * Run the `Run react app (detached)` task.
* Wait for it to build your app. Please note that **first time may take several minutes**.
* Visit `http://localhost:3000/` in your browser.


## Updating the url list to get the newest cards
Add the new urls in `DBS_DATA_URLS` array located at [./scraper/src/index.js](scraper/src/index.js) file.


## Running this project with Docker

Download & install [Docker](https://www.docker.com)

### Build it
`docker build -t dbs-scraper .`

### Run it
* Run `docker run --rm --name scraper -p 80:3000 dbs-scraper`
* Now visit [http://localhost/](http://localhost)

### Running for development
* Download the latest `cards.json` file from the [releases section of this repo](https://github.com/hay-espacio-en-el-taco/dbs-scraper/releases)
* Copy the `cards.json` file into the `/web-page/src` folder
* Run `docker run -it --rm --name scraper -v ${PWD}/web-page/src:/home/node/app/web-page/src -p 80:3000 dbs-scraper` (note that we are mounting a volume)
* Now visit [http://localhost/](http://localhost)
