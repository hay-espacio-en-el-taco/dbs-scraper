import React, { useState } from 'react'
import { connect } from 'react-redux'
import { searchCards } from '../../redux/modules/search'
import { addFilter, updateFilter, removeFilter } from '../../redux/modules/search/filters'
import './index.css'

import CardTypeFilter from './CardTypeFilter'
import ColorFilter from './ColorFilter'
import EnergyFilter from './EnergyFilter'
import ComboEnergyFilter from './ComboEnergyFilter'
import FiltersApplied from './FiltersApplied'

import { 
    parseFilterText, 
    getFieldsToSearch, 
    createFilter
} from './filter.utils'

const FilterBox = ({ totalCards, appliedFilters, fieldOptions, onFilterAdd }) => {
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

    const removedOptions = ['availableDate', 'cardImageUrl', 'cardBack', 'era', 'type', 'color', 'energy', 'comboEnergy', /*'rarity', 'character', 'skillKeywords', 'cardNumber', */]
    const optionsToSelect = fieldOptions.map(
        (option, index) =>
            !removedOptions.includes(option.fieldName)
                ? <option key={option.fieldName} value={index}>
                    {option.label}
                </option>
                : null
    )

    return (
        <div className="col s12 filter-box white-text">
            <div className="row">
                <CardTypeFilter />
                <ColorFilter />
                <EnergyFilter />
                <ComboEnergyFilter />
                
                <div className="input-field col s12">
                    <select id="rarity" className="mx-auto btn-group-toggle btn-group">
                        <option value="">Rarity</option>
                        <option value="Common[C]">Common[C]</option>
                        <option value="Rare[R]">Rare[R]</option>
                        <option value="Starter Rare[ST]">Starter Rare[ST]</option>
                        <option value="Super Rare[SR]">Super Rare[SR]</option>
                        <option value="Uncommon[UC]">Uncommon[UC]</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="input-field col s12">
                    <select id="character" className="mx-auto btn-group-toggle btn-group">
                        <option value="">Character</option>
                        <option value="Common[C]">Common[C]</option>
                        <option value="Rare[R]">Rare[R]</option>
                        <option value="Starter Rare[ST]">Starter Rare[ST]</option>
                        <option value="Super Rare[SR]">Super Rare[SR]</option>
                        <option value="Uncommon[UC]">Uncommon[UC]</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="input-field col s12">
                    <select id="skillKeywords" className="mx-auto btn-group-toggle btn-group">
                        <option value="">Skill Keywords</option>
                        <option value="Common[C]">Common[C]</option>
                        <option value="Rare[R]">Rare[R]</option>
                        <option value="Starter Rare[ST]">Starter Rare[ST]</option>
                        <option value="Super Rare[SR]">Super Rare[SR]</option>
                        <option value="Uncommon[UC]">Uncommon[UC]</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>
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
            <div className="row">
                <FiltersApplied filters={appliedFilters} />
            </div>
            <div className="row">
                <span className="white-text">Total of cards: {totalCards}</span>
            </div>
        </div>
    )
}

const
    mapStateToProps = ({ search }) => ({
        totalCards: search.result.length,
        appliedFilters: search.filters,
        fieldOptions: getFieldsToSearch( search.cardsDictionary[ Object.keys(search.cardsDictionary)[4] ] )
    }),
    mapDispatchToProps = { searchCards, onFilterAdd: addFilter, onUpdateFilter: updateFilter, onFilterRemove: removeFilter }
export default connect(mapStateToProps, mapDispatchToProps)(FilterBox)
