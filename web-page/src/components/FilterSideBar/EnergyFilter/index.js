import React from 'react'
import FilterButtonsRow from '../FilterButtonsRow'
import { attributes as CardAttributes} from '../../../cards.json'


const ENERGY_VALUES = Array.from(
    CardAttributes.energy.reduce(
        (resultSet, item) => {
            const match = item.match(/^(?<number>\d*)/)
            if (!match) {
                return resultSet
            }
            
            const { groups: { number } } = match
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
        
        const match = card.energy.match(/^(?<number>\d*)/)
        if (!match) {
            return false
        }
        
        const { groups: { number } } = match
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
            items={ENERGY_VALUES}
        />
    )
}

export default CardTypeFilter