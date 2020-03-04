import React from 'react'
import FilterButtonsRow from '../FilterButtonsRow'
import { attributes as CardAttributes} from '../../../cards.json'


const CARD_TYPES = Array.from(
    CardAttributes.energy.reduce(
        (resultSet, item) => {
            const { groups: { number } } = item.match(/^(?<number>\d*)/)
            if (number.length === 0) {
                return resultSet
            }

            const energyCost = Number.parseInt(number, 10)
            resultSet.add(energyCost)
            return resultSet
        },
        new Set()
    ).values()
).sort(
    (a, b) => a -b
).map(
    i => ({ value: i, label: i })
)

const createFilter = (selectedValues = []) => {
    return card => {
        if (typeof card.energy !== 'string') {
            return false
        }
        
        const { groups: { number } } = card.energy.match(/^(?<number>\d*)/)
        if (number.length === 0) {
            return false
        }
        
        const energyCost = Number.parseInt(number, 10)
        if (Number.isNaN(energyCost)) {
            return false
        }
        
        return undefined !== selectedValues.find(
            item => {
                if (item === 6) {
                    return energyCost >= item 
                }

                return item === energyCost
            }
        )
    }
}

const CardTypeFilter = () => {
    return (
        <FilterButtonsRow
            title={'Energy Cost'}
            filterGenerator={createFilter}
            items={CARD_TYPES}
        />
    )
}

export default CardTypeFilter