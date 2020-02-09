import React, { useState, useEffect, useCallback } from 'react'
import FilterButton from '../../FilterButton'
import { useDispatch } from 'react-redux'
import { updateFilter, removeFilter } from '../../../redux/modules/search/filters'


export const IDENTIFIER_PREFIX = '_$hide:'

const FilterButtonsRow = (props) => {
    const {
        title = 'filterRow',
        filterGenerator,
        items
    } = props

    const filterIdentifier = IDENTIFIER_PREFIX + title

    const [selectedItemValues, setSelectedItemValues] = useState({})
    const dispatch = useDispatch()


    useEffect(() => {
        const valuesList = Object.values(selectedItemValues)

        if (valuesList.length > 0) {
            dispatch( updateFilter({
                id: filterIdentifier, filter: filterGenerator(valuesList)
            }) )
            return
        }

        dispatch( removeFilter({ id: filterIdentifier }) )
    }, [selectedItemValues])


    const onClickHandler = useCallback(
        (event, value) => {
            const { target: { id } } = event;
            const newState = { ...selectedItemValues }
            const isSelected = undefined !== selectedItemValues[id]
            
            if (isSelected) {
                delete newState[id]
            }
            else {// Not selected
                newState[id] = value
            }

            setSelectedItemValues(newState)
        },
        [selectedItemValues, setSelectedItemValues]
    )

    const buttonComponents = items.map(
        (item, index) => {
            const id = `filter-button-${title}-${item.label}-${index}`
            return (
                <FilterButton
                    id={id}
                    key={item.value + item.label}
                    label={item.label}
                    highlighted={selectedItemValues[id] !== undefined}
                    onClick={e => onClickHandler(e, item.value)}
                />
            )
        }
    )

    return (
        <div className="input-field col s12">
            <div htmlFor="type">{title}</div>
            <div className="mx-auto btn-group-toggle btn-group">
                {buttonComponents}
            </div>
        </div>
    )
}

export default FilterButtonsRow