import React from 'react'
import FilterButtonsRow from '../FilterButtonsRow'


const CARD_COLORS = [
    { value: 'black', label: 'B' },
    { value: 'blue', label: 'U' },
    { value: 'green', label: 'G' },
    { value: 'yellow', label: 'Y' },
    { value: 'red', label: 'R' },
    { value: 'red/green', label: 'R/G' },
    { value: 'blue/yellow', label: 'U/Y' },
    { value: 'red/yellow', label: 'R/Y' },
    { value: 'blue/green', label: 'U/G' },
    { value: 'red/blue', label: 'R/U' },
    { value: 'green/yellow', label: 'G/Y' },
]

const createFilter = (selectedItems = []) => {
    return card => {
        const value = card.color.toLowerCase()

        return selectedItems.find(
            item => value === item
        )
    }
}


const CardTypeFilter = () => {
    return (
        <FilterButtonsRow
            title={'Color'}
            filterGenerator={createFilter}
            items={CARD_COLORS}
        />
    )
}

export default CardTypeFilter
