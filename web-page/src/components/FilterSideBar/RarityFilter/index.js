import React from 'react'
import FilterButtonsRow from '../FilterButtonsRow'
import { attributes as CardAttributes} from '../../../cards.json'

const CARD_RARITY_TYPES = CardAttributes.rarity.map(
    item => {
        const match = item.match(/.*\[(?<rarity>.+)\]/)
        if (!match) {
            return { label: item, value: item}
        }
        
        const { groups: { rarity } } = match
        return { label: rarity, value: item}
    } 
)

const createFilter = (carTypesArray = []) => {
    return card => carTypesArray.includes(card.rarity)
}

const CardTypeFilter = () => {
    return (
        <FilterButtonsRow
            title={'Rarity'}
            filterGenerator={createFilter}
            items={CARD_RARITY_TYPES}
        />
    )
}

export default CardTypeFilter