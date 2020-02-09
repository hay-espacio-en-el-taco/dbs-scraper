import React from 'react'
import FilterButtonsRow from '../FilterButtonsRow'


const CARD_TYPES = [
    { value: 0, label: '0' },
    { value: 1, label: '1' },
    { value: 2, label: '2' },
]

const createFilter = (selectedValues = []) => {
    return card => {
        if (typeof card.comboEnergy !== 'string') {
            return false
        }
        
        const { groups: { number } } = card.comboEnergy.match(/^(?<number>\d*)/)
        if (number.length === 0) {
            return false
        }
        
        const energyCost = Number.parseInt(number, 10)
        if (Number.isNaN(energyCost)) {
            return false
        }
        
        return selectedValues.find(
            item => {
                return item === energyCost
            }
        )
    }
}

const CardTypeFilter = () => {
    return (
        <FilterButtonsRow
            title={'Combo Energy'}
            filterGenerator={createFilter}
            items={CARD_TYPES}
        />
    )
}

export default CardTypeFilter