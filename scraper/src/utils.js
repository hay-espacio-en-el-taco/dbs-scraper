'use strict'
const groupValuesInSets = (dict = {}, obj) => {
    if (!obj) {
        return dict
    }

    for (let [key, value] of Object.entries(obj)) {
        
        const isAnidated = !(dict[key] instanceof Set) && typeof dict[key] === 'object'
        if (isAnidated || (value && typeof value === 'object' && !Array.isArray(value)) ) {
            dict[key] = groupValuesInSets(dict[key], value)
            continue
        }

        if (typeof value !== 'number' && !value) {
            // Value is null, empty string or undefined
            continue
        }

        
        if (!dict[key]) {
            dict[key] = new Set()
        }
        
        if (Array.isArray(value)) {
            value.forEach(dict[key].add.bind(dict[key]))
        }
        else {
            dict[key].add(value)
        }
    }

    return dict
}

const unfoldSetsIntoarrays = (obj) => {
    if (obj instanceof Set) {
        return Array.from(obj.values())
    }

    const result = {}
    for (let [key, value] of Object.entries(obj)) {
        result[key] = unfoldSetsIntoarrays(value)
    }

    return result
}

const getUniqueValuesByProperty = allCards => unfoldSetsIntoarrays(
    allCards.reduce(groupValuesInSets, {})
)

module.exports = {
    getUniqueValuesByProperty
}
