import React from 'react'
import FilterButtonsRow from '../FilterButtonsRow'
import { attributes as CardAttributes} from '../../../cards.json'

const CARD_TYPES = CardAttributes.comboEnergy.sort().map(
    item => ({
        label: item,
        value: Number.parseInt(item, 10)
    })
)

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
        
        return undefined !== selectedValues.find(
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