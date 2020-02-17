import React, { useState, useCallback } from 'react'
import { useSelector, useDispatch  } from 'react-redux'
import { addFilter } from '../../../redux/modules/search/filters'

import { 
    createFilter,
    getFieldsToSearch,
    parseFilterText
} from '../filter.utils'

const removedOptions = [
    'availableDate', 'cardImageUrl', 'cardBack', 'era', 'type', 'color', 'energy', 'comboEnergy',
    /*'rarity', 'character', 'skillKeywords', 'cardNumber', */
]

const fieldOptsSelector = ({ search }) => getFieldsToSearch(
    search.cardsDictionary[ Object.keys(search.cardsDictionary)[4] ]
)

const FilterBox = () => {
    const fieldOptions = useSelector(fieldOptsSelector)
    const dispatch = useDispatch()
    const onFilterAdd = useCallback(
        obj => dispatch( addFilter(obj) )
    , [dispatch])


    const finalFieldOptions = fieldOptions.filter(
        option => !removedOptions.includes(option)
    ).sort()

    const [ filterValues, setFilter ] = useState({ filterText: '', fieldToSearch: finalFieldOptions[0], isFilterNegation: false })
    const { filterText, isFilterNegation } = filterValues

    const onAddFilter = (type, fieldName, filterText, isFilterNegation) => {
        if (typeof filterText !== 'string') {
            return// Empty string
        }

        if(isFilterNegation)
            filterText = 'not ' + filterText
        const filterConditions = parseFilterText(filterText)
        const filter = createFilter(fieldName, filterConditions, type)
        onFilterAdd({ id: `${fieldName}: ${filterText}`, filter })
    }

    const onAddFilterClickHandler = _ => {
        const { filterText: origText, fieldToSearch: { type, fieldName }, isFilterNegation } = filterValues
        let filterText = origText.trim()
        onAddFilter(type, fieldName, filterText, isFilterNegation)
    }

    const onFieldSelectionChangeHandler = event => {
        setFilter({ ...filterValues, fieldToSearch: finalFieldOptions[event.target.value] })
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

    const optionsToSelect = finalFieldOptions.map(
        (option, index) => (
            <option key={option.fieldName} value={index}>
                {option.label}
            </option>
        )
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
