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

const typesDict = cardsObj.cards.reduce(
    (dict, { type }) => {
        if (typeof dict[type] !== 'number') {
            dict[type] = 0
        }
        dict[type]++

        return dict
    },
    {}
)

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

const typesMrkdwn = Object.keys(typesDict).map(
    type => `* \`${type}\` type: **${typesDict[type]}** cards`
).join('\n')

const seriesMrkdwn = Object.keys(seriesDict).map(
    series => `* \`${series}\`: **${seriesDict[series]}** cards`
).join('\n')


const changelogMrkd = `
<details>
    <summary>
        Found a total of <strong>${cardsObj.cards.length}</strong> cards
    </summary>

<p>

${typesMrkdwn}
</p>
</details>

<details>
    <summary>
        Found a total of <strong>${cardsObj.urlsList.length}</strong> series </p>
    </summary>

<p>

${seriesMrkdwn}
</p>
</details>
`.trim()

FS.writeFileSync(changelogOutput, changelogMrkd)
console.log(changelogMrkd)
console.log('Changelog generated succesfully!')
