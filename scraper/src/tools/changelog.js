'use strict'
const FS = require('fs')
const Path = require('path');

const changelogOutput = process.env.CARDS_CHANGELOG_OUTPUT || './changelog.cards.txt'
let cardsPath = process.argv[2]
if (!cardsPath) {
    return console.error('Must provide the path where the cards file is located.')
}
cardsPath = Path.normalize( Path.join(cardsPath) )

const fileContents = FS.readFileSync(cardsPath, 'utf8')
const cardsObj = JSON.parse(fileContents)


const leaderCount = cardsObj.cards.filter(c => c.type === 'LEADER').length
const battleCount = cardsObj.cards.filter(c => c.type === 'BATTLE').length
const extraCount = cardsObj.cards.filter(c => c.type === 'EXTRA').length

const seriesDict = cardsObj.cards.reduce(
    (dict, { seriesName, seriesFullName }) => {
        const key = `${seriesName} ${seriesFullName}`
        if (typeof dict[key] !== 'number') {
            dict[key] = 0
        }
        dict[key]++

        return dict
    },
    {}
)

const seriesMrkdwn = Object.keys(seriesDict).map(
    series => `* ${series}: **${seriesDict[series]}**`
).join('\n')


const changelogMrkd = `
Found *${cardsObj.cards.length}* cards:
* Leader cards: **${leaderCount}**
* Battle cards: **${battleCount}**
* Extra cards: **${extraCount}**

From *${cardsObj.urlsList.length}* series:
${seriesMrkdwn}
`

FS.writeFileSync(changelogOutput, changelogMrkd)
console.log(changelogMrkd)
console.log('Changelog generated succesfully!')
