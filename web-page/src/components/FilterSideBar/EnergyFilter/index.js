import React from 'react'
import FilterButtonsRow from '../FilterButtonsRow'


const CARD_TYPES = [
    { value: 0, label: '0' },
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
    { value: 6, label: '6+' },
]

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