import React from 'react'
import FilterButtonsRow from '../FilterButtonsRow'
import { attributes as CardAttributes} from '../../../cards.json'

const CARD_TYPES = CardAttributes.type.sort().map(
    item => ({ label: item, value: item})
)

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