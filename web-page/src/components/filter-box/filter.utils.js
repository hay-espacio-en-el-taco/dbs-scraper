import React from 'react';
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

export const findArrayItemsInArrayOrString = (filterConditions, valuesToSearchOn) => {
    for (let index = 0; index < filterConditions.length; index++) {
        const { conditionType, condition, criteria } = filterConditions[index]
        const found = valuesToSearchOn.find(
            value => {
                if (conditionType === 'numeric') {
                    const nValue = Number(value.replace(/\D+/g, ""))
                    switch (condition) {
                        case '<': return nValue < Number(criteria)
                        case '<=': return nValue <= Number(criteria)
                        case '>': return nValue > Number(criteria)
                        case '>=': return nValue >= Number(criteria)
                        case '-': return nValue <= Number(criteria)
                        case '+': return nValue >= Number(criteria)
                        default: break;
                    }
                }

                return value.toString().toLocaleLowerCase().includes(
                    criteria.toString().toLocaleLowerCase()
                )
            }
        )
        if (found) {
            return true
        }
    }
    return false
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
    ar.find(a=> a.id.toLocaleLowerCase() === `${field}:  ${current.toString()}`.toLocaleLowerCase())
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
                return { conditionType: 'numeric', criteria, condition }
            }

            return { conditionType: 'contains', criteria: txt }
        }
    )
}

const createButtons = (appliedFilters, onAddFilterButtonHandler, buttons, field) => (
    buttons.map((current, ind) =>
        <FilterButton
            id={current}
            key={field + ind}
            fieldname={field}
            customClass={isInFilters(appliedFilters, field, field === FILTER_FIELDNAME.COLOR ? mapIdToColor[current] : current)}
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
