import React from 'react'
import FilterButtonsRow from '../FilterButtonsRow'


const CARD_TYPES = [
    { value: 'BATTLE', label: 'BATTLE' },
    { value: 'EXTRA', label: 'EXTRA' },
    { value: 'LEADER', label: 'LEADER' }
]

const createFilter = (carTypesArray = []) => {
    return card => carTypesArray.includes(card.type)
}

const CardTypeFilter = () => {
    return (
        <FilterButtonsRow
            title={'Card Type'}
            filterGenerator={createFilter}
            items={CARD_TYPES}
        />
    )
}

export default CardTypeFilter