import React, { useState, useEffect, useCallback } from 'react'
import FilterButton from '../../FilterButton'
import { useDispatch } from 'react-redux'
import { updateFilter, removeFilter } from '../../../redux/modules/search/filters'


const CARD_TYPES = [
    { value: 'BATTLE', label: 'BATTLE' },
    { value: 'EXTRA', label: 'EXTRA' },
    { value: 'LEADER', label: 'LEADER' }
]

const createFilter = (carTypesArray = []) => {
    return card => carTypesArray.includes(card.type)
}

const FILTER_ID = '_$hide:cardTypeFilter'


const CardTypeFilter = () => {
    const [selectedCardTypes, setSelectedCardTypes] = useState({})
    const dispatch = useDispatch()


    useEffect(() => {
        const cardTypesList = Object.keys(selectedCardTypes).filter(i => selectedCardTypes[i])

        if (cardTypesList.length > 0) {
            dispatch( updateFilter({
                id: FILTER_ID, filter: createFilter(cardTypesList)
            }) )
            return
        }

        dispatch( removeFilter({ id: FILTER_ID }) )
    }, [selectedCardTypes])


    const onClickHandler = useCallback(
        (event) => {
            const { target } = event;
            const newState = { ...selectedCardTypes }
            newState[target.id] = !selectedCardTypes[target.id]
            setSelectedCardTypes(newState)
        },
        [selectedCardTypes, setSelectedCardTypes]
    )

    const buttonComponents = CARD_TYPES.map(
        cardType => (
            <FilterButton
                key={cardType.value + cardType.label}
                label={cardType.label}
                highlighted={selectedCardTypes[cardType.value] === true}
                onClick={onClickHandler}
            />
        )
    )

    return (
        <div className="input-field col s12">
            <div htmlFor="type">Card Type</div>
            <div className="mx-auto btn-group-toggle btn-group">
                {buttonComponents}
            </div>
        </div>
    )
}

export default CardTypeFilter