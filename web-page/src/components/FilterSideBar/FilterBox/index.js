import React, { useState } from 'react'
import { 
    parseFilterText, 
    createFilter
} from '../filter.utils'

const FilterBox = (props) => {
    const {
        appliedFilters, fieldOptions, onFilterAdd,
    } = props
    const [ filterValues, setFilter ] = useState({ filterText: '', fieldToSearch: '', isFilterNegation: false })
    const { filterText, isFilterNegation } = filterValues

    const onAddFilterClickHandler = _ => {
        const { filterText: origText, fieldToSearch: { type, fieldName }, isFilterNegation } = filterValues
        let filterText = origText.trim()
        if (appliedFilters.find(a => a.id === `${fieldName}-${filterText}`)) {
            return// Filter already added
        }
        onAddFilter(type, fieldName, filterText, isFilterNegation)
    }

    const onAddFilter = (type, fieldName, filterText, isFilterNegation) => {
        if (typeof onFilterAdd !== 'function') {
            return// No handler, so do nothing
        }

        if (typeof filterText !== 'string') {
            return// Empty string
        }

        if(isFilterNegation)
            filterText = 'not ' + filterText
        const filterConditions = parseFilterText(filterText)
        const filter = createFilter(fieldName, filterConditions, type)
        onFilterAdd({ id: `${fieldName}: ${filterText}`, filter })
    }

    const onFieldSelectionChangeHandler = event => {
        setFilter({ ...filterValues, fieldToSearch: fieldOptions[event.target.value] })
    }

    const onFilterTextChangeHandler = (event) => {
        setFilter({ ...filterValues, filterText: event.target.value })
    }

    const onNegationFilterChangeHandler = (event) => {
        setFilter({ ...filterValues, isFilterNegation: event.target.checked })
    }

    const onInputTextKeyDownHandler = (event) => {
        const isEnter = event.keyCode === 13
        if (isEnter) {
            onAddFilterClickHandler()
        }
    }

    const removedOptions = [
        'availableDate', 'cardImageUrl', 'cardBack', 'era', 'type', 'color', 'energy', 'comboEnergy',
        /*'rarity', 'character', 'skillKeywords', 'cardNumber', */
    ]
    const optionsToSelect = fieldOptions.map(
        (option, index) =>
            !removedOptions.includes(option.fieldName)
                ? <option key={option.fieldName} value={index}>
                    {option.label}
                </option>
                : null
    )

    return (
        <React.Fragment>
            <div className="input-field col s12">
                <select id="filter-box-type-input" defaultValue={0} onChange={onFieldSelectionChangeHandler}> {optionsToSelect} </select>
                <label htmlFor="filter-box-type-input">Field</label>
            </div>

            <div className="input-field col s12">
                <input
                    id="filter-box-criteria-input"
                    type="text" placeholder="For an OR operation use ||"
                    value={filterText}
                    onChange={onFilterTextChangeHandler}
                    onKeyDown={onInputTextKeyDownHandler} />
                <label htmlFor="filter-box-criteria-input">Search</label>
            </div>

            <div className="input-field col s3">
                <label>
                    <input type="checkbox" checked={isFilterNegation} onChange={onNegationFilterChangeHandler}/>
                    <span>
                        { isFilterNegation ? 'Not' : null }
                    </span>
                </label>
            </div>

            <div className="input-field col s3">
                <span><button className="waves-effect waves-light btn" onClick={onAddFilterClickHandler}>Add</button></span>
            </div>
        </React.Fragment>
    )
}

export default FilterBox
