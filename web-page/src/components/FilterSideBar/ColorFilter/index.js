import React from 'react'
import FilterButtonsRow from '../FilterButtonsRow'
import { attributes as CardAttributes} from '../../../cards.json'

const COLOR_ABRV_DICT = {
    Black: 'B',
    Blue: 'U',
    Green: 'G',
    Yellow: 'Y',
    Red: 'R'
}

const CARD_COLORS = CardAttributes.color.map(
    colorString => ({
        value: colorString,
        label: Object.entries(COLOR_ABRV_DICT).reduce(
            (result, [key, val]) => result.replace(key, val),
            colorString
        )
    })
)

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
