const NUMERIC_REGEXP = '^(?<condition>[<>]=?)\\s*?(?<criteria>\\d+)'
const NUMERIC_REGEXP_WITH_OPERATORS = '^(?<criteria>\\d+)\\s*?(?<condition>[+-])'

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
