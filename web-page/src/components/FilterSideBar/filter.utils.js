import React from 'react'
import FilterButton from '../FilterButton'

const NUMERIC_REGEXP = '^(?<condition>[<>]=?)\\s*?(?<criteria>\\d+)'
const NUMERIC_REGEXP_WITH_OPERATORS = '^(?<criteria>\\d+)\\s*?(?<condition>[+-])'
const TYPES = ['BATTLE', 'EXTRA', 'LEADER']
const COLORS = ['B', 'U', 'G', 'Y', 'R']
const ENERGYS = ['0', '1', '2', '3', '4', '5', '6+']
const COMBOENERGYS = ['0', '1', '2']
const FILTER_FIELDNAME = {
    TYPE: 'type',
    COLOR: 'color',
    ENERGY: 'energy',
    COMBO_ENERGY: 'comboEnergy'
}

const findArrayItemsInArrayOrString = (filterConditions, valuesToSearchOn) => {
    return !!filterConditions.find(values => {
        const { conditionType, condition, criteria, negate } = values
        return valuesToSearchOn.find(
            value => {
                if (conditionType === 'numeric') {
                    const nValue = Number(value.replace(/\D+/g, ""))
                    switch (condition) {
                        case '<': return nValue < Number(criteria)
                        case '>': return nValue > Number(criteria)
                        case '<=': 
                        case '-': return nValue <= Number(criteria)
                        case '>=':
                        case '+': return nValue >= Number(criteria)
                        default: break
                    }
                }

                const val = value.toString().toLocaleLowerCase().includes(criteria.toString().toLocaleLowerCase())
                return negate ? !val : val
            }
        )
    })
}

export const getFieldsToSearch = (card) => {
    const struct = Object.keys(card).reduce(
        (result, fieldName) => {
            let type = typeof card[fieldName]
            if (Array.isArray( card[fieldName] )) {
                type = 'array'
            }

            result.push({ fieldName, type, label: fieldName })
            return result
        },
        []
    ).sort(
        (a, b) => {
            if (a.label > b.label) return 1
            else if (a.label < b.label) return -1
            return 0
        }
    )

    return struct
}

export const isInFilters = (ar, field, current) => (
    ar.find(({ id })=> id.toLocaleLowerCase().startsWith(field.toLocaleLowerCase()) && id.toLocaleLowerCase().includes(current.toLocaleLowerCase()))
)

export const mapIdToColor = {
    B: "Black",
    U: "Blue",
    G: "Green",
    Y: "Yellow",
    R: "Red"
}

export const parseFilterText = text => {
    const criteriaArray = text.trim().toLocaleLowerCase().split(/\s*\|\|\s*/gm)
    return criteriaArray.map(
        txt => {
            const foundNumericCondition = (new RegExp(NUMERIC_REGEXP, 'g')).exec(txt)
            const foundNumericConditionFinal = foundNumericCondition ? foundNumericCondition : (new RegExp(NUMERIC_REGEXP_WITH_OPERATORS, 'g')).exec(txt) 
            if (foundNumericConditionFinal) {
                const { groups: { condition, criteria } } = foundNumericConditionFinal
                return { conditionType: 'numeric', criteria: criteria.includes('not') ? criteria.split(/\s/gm)[1] : criteria, condition, negate: criteria.includes('not') }
            }
            return { conditionType: 'contains', criteria: txt.includes('not') ? txt.split(/\s/gm)[1].trim() : txt, negate: txt.includes('not') }
        }
    )
}

const createButtons = (appliedFilters, onAddFilterButtonHandler, buttons, field) => (
    buttons.map((current, ind) =>
        <FilterButton
            key={field + ind}
            label={current}
            highlighted={isInFilters(appliedFilters, field, field === FILTER_FIELDNAME.COLOR ? mapIdToColor[current] : current)}
            onClick={onAddFilterButtonHandler}
        />
    )
)

export const createAllButtons = (appliedFilters, onAddFilterButtonHandler) => {
    return {
        type: createButtons(appliedFilters, onAddFilterButtonHandler, TYPES, FILTER_FIELDNAME.TYPE),
        color: createButtons(appliedFilters, onAddFilterButtonHandler, COLORS, FILTER_FIELDNAME.COLOR),
        energy: createButtons(appliedFilters, onAddFilterButtonHandler, ENERGYS, FILTER_FIELDNAME.ENERGY),
        comboEnergy: createButtons(appliedFilters, onAddFilterButtonHandler, COMBOENERGYS, FILTER_FIELDNAME.COMBO_ENERGY)
    }
}

export const createFilter = (fieldName, filterConditions, type) => {
    let filter = card => {
        let criteriaToSearchOn
        if (type === 'object') {// no implementation yet, so we search in the whole object
            criteriaToSearchOn = [JSON.stringify( card[fieldName] )]
        }
        else {
            let val = card[fieldName]
            if (val === null || val === undefined) {
                return false
            }
            criteriaToSearchOn = Array.isArray(val) ? val.slice() : [val]
            // We look for the field in the back of the card and add it to our search
            if (card['cardBack'] && card['cardBack'][fieldName]) {
                val = card['cardBack'][fieldName]
                if (Array.isArray(val)) {
                    criteriaToSearchOn = criteriaToSearchOn.concat(val)
                }
                else {
                    criteriaToSearchOn.push( val )
                }
            }
        }

        return findArrayItemsInArrayOrString(filterConditions, criteriaToSearchOn)
    }
    return filter
}
