const {
    getUniqueValuesByProperty
} = require('./utils')


const INPUT_ARR = [
    {
        name: 'another',
        power: 10000,
        energy: null,
        cardBack: null,
        skillKeywords: ['Barrier', 'Blocker'],

    },
    {
        name: 'first',
        power: 15000,
        energy: '0a',
        cardBack: {
            energy: 'a0'
        },
        skillKeywords: ['Auto', 'Blocker']
    },
    {
        name: 'second',
        power: 5000,
        energy: '1b',
        cardBack: null,
        skillKeywords: null
    }
]

const OUTPUT_OBJ = {
    name: [ 'another', 'first', 'second' ],
    power: [ 10000, 15000, 5000 ],
    energy: [ '0a', '1b' ],
    cardBack: {
        energy: [ 'a0' ]
    },
    skillKeywords: ['Barrier', 'Blocker', 'Auto']
}

describe('Testing file scraper/src/utils.js', () => {
    test('Extract properties values into set', () => {
        expect(
            getUniqueValuesByProperty(INPUT_ARR)
        ).toEqual(OUTPUT_OBJ)
    })
})
