const {
    getUniqueValuesByProperty
} = require('./utils')


const INPUT_ARR = [
    {
        name: 'another',
        power: 10000,
        energy: null,
        cardBack: null
    },
    {
        name: 'first',
        power: 15000,
        energy: '0a',
        cardBack: {
            energy: 'a0'
        }
    },
    {
        name: 'second',
        power: 5000,
        energy: '1b',
        cardBack: null
    }
]

// const OUTPUT_OBJ = {
//     name: new Set([ 'another', 'first', 'second' ]),
//     power: new Set([ 10000, 15000, 5000 ]),
//     energy: new Set([ '0a', '1b' ]),
//     cardBack: {
//         energy: new Set([ 'a0' ])
//     },
// }

const OUTPUT_OBJ = {
    name: [ 'another', 'first', 'second' ],
    power: [ 10000, 15000, 5000 ],
    energy: [ '0a', '1b' ],
    cardBack: {
        energy: [ 'a0' ]
    },
}

describe('Testing file scraper/src/utils.js', () => {
    test('Extract properties values into set', () => {
        expect(
            getUniqueValuesByProperty(INPUT_ARR)
        ).toEqual(OUTPUT_OBJ)
    })
})
