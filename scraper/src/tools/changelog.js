'use strict'
const FS = require('fs')
const Path = require('path');

const changelogOutput = process.env.CARDS_CHANGELOG_OUTPUT || 'changelog.cards.txt'
let cardsPath = process.argv[2]
let oldCardsPath = process.argv[3]
if (!cardsPath) {
    return console.error('Must provide the path where the cards file is located.')
}
if (!oldCardsPath) {
    return console.error('Must provide the path where the previous cards file is located.')
}
cardsPath = Path.normalize( Path.join(cardsPath) )
oldCardsPath = Path.normalize( Path.join(oldCardsPath) )


const getDictionariesfromCardsFile = (filePath) => {
    const fileContents = FS.readFileSync(filePath, 'utf8')
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

    return {
        series: seriesDict, types: typesDict,
        cardsCount: cardsObj.cards.length,
        urlsCount: cardsObj.urlsList.length
    }
}

const getDiff = (oldObj, newObj) => {
    const oldKeys = Object.keys(oldObj)
    const newKeys = Object.keys(newObj)
    const allKeys = Array.from(new Set([...oldKeys, ...newKeys]))

    return {
        keysCountDiff: newKeys.length - oldKeys.length,
        allKeysDiff: allKeys.reduce(
            (result, key) => {
                result[key] = (newObj[key] || 0) - (oldObj[key] || 0)
                return result
            }, {}
        )
    }
}

const getTypesMrkdwn = (typesDict) => Object.keys(typesDict).map(
    type => `* \`${type}\` type: **${typesDict[type]}** cards`
).join('\n')

const getSeriesMrkdwn = (seriesDict) => Object.keys(seriesDict).map(
    series => `* \`${series}\`: **${seriesDict[series]}** cards`
).join('\n')



const newCardsObj = getDictionariesfromCardsFile(cardsPath)
const oldCardsObj = getDictionariesfromCardsFile(oldCardsPath)

const seriesDiff = getDiff(oldCardsObj.series, newCardsObj.series)
const typesDiff = getDiff(oldCardsObj.types, newCardsObj.types)

const diffMrkdwn = (seriesDiff, typesDiff) => {
    const result = []
    if (typesDiff.keysCountDiff !== 0) {
        result.push(`* Added ${typesDiff.keysCountDiff} type(s)`)
    }

    Object.keys(typesDiff.allKeysDiff).forEach(
        (key) => {
            const count = typesDiff.allKeysDiff[key]
            if (count !== 0) {
                result.push(`* Added ${count} \`${key}\` card(s)`)
            }
        }
    )

    if (seriesDiff.keysCountDiff !== 0) {
        result.push(`* Added ${seriesDiff.keysCountDiff} serie(s)`)
    }

    Object.keys(seriesDiff.allKeysDiff).forEach(
        (key) => {
            const count = seriesDiff.allKeysDiff[key]
            if (count !== 0) {
                result.push(`* Added ${count} card(s) to serie \`${key}\``)
            }
        }
    )

    return result.join('\n')
}

const changelogMrkd = `
<details>
    <summary>
        What's new?
    </summary>

<p>

${diffMrkdwn(seriesDiff, typesDiff)}
</p>

<details>
    <summary>
        Found a total of <strong>${newCardsObj.cardsCount}</strong> cards
    </summary>

<p>

${getTypesMrkdwn(newCardsObj.types)}
</p>
</details>

<details>
    <summary>
        Found a total of <strong>${newCardsObj.urlsCount}</strong> series urls </p>
    </summary>

<p>

${getSeriesMrkdwn(newCardsObj.series)}
</p>
</details>

</details>
`.trim()

FS.writeFileSync(changelogOutput, changelogMrkd)
console.log('Changelog generated succesfully!')