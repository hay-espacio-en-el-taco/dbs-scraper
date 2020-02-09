import React, { useState, useEffect, useCallback } from 'react'
import FilterButton from '../../FilterButton'
import { useDispatch } from 'react-redux'
import { updateFilter, removeFilter } from '../../../redux/modules/search/filters'


const IDENTIFIER_PREFIX = '_$hide:'

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
        const valuesList = Object.keys(selectedItemValues).filter(i => selectedItemValues[i])

        if (valuesList.length > 0) {
            dispatch( updateFilter({
                id: filterIdentifier, filter: filterGenerator(valuesList)
            }) )
            return
        }

        dispatch( removeFilter({ id: filterIdentifier }) )
    }, [selectedItemValues])


    const onClickHandler = useCallback(
        (event) => {
            const { target } = event;
            const newState = { ...selectedItemValues }
            newState[target.id] = !selectedItemValues[target.id]
            setSelectedItemValues(newState)
        },
        [selectedItemValues, setSelectedItemValues]
    )

    const buttonComponents = items.map(
        item => (
            <FilterButton
                id={item.value}
                key={item.value + item.label}
                label={item.label}
                highlighted={selectedItemValues[item.value] === true}
                onClick={onClickHandler}
            />
        )
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