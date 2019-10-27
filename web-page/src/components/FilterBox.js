import React, { Component } from 'react'
import { connect } from 'react-redux'
import { searchCards, addFilter, removeFilter } from '../redux/modules/search'
import './FilterBox.css'
import Filter from './Filter'

const NUMERIC_REGEXP = '^(?<condition>[<>]=?)\\s*?(?<criteria>\\d+)'

const findArrayItemsInArrayOrString = (filterConditions, valuesToSearchOn) => {

    for (let index  = 0; index < filterConditions.length; index++) {
        const { conditionType, condition, criteria } = filterConditions[index]
        const found = valuesToSearchOn.find(
            value => {
                if (conditionType === 'numeric') {
                    switch(condition) {
                        case '<': return  Number(value) < Number(criteria)
                        case '<=': return  Number(value) <= Number(criteria)
                        case '>': return  Number(value) > Number(criteria)
                        case '>=': return  Number(value) >= Number(criteria)
                        default: break;
                    }
                }

                return value.toString().toLocaleLowerCase().includes(
                    criteria.toString().toLocaleLowerCase()
                )
            }
        )

        if (found) {
            return true
        }
    }
    return false
}

const getFieldsToSearch = (card) => {
    const struct = Object.keys(card).reduce(
        (result, fieldName) => {
            let type = typeof card[fieldName]
            if (Array.isArray( card[fieldName] )) {
                    type = 'array'
            }

            result.push({ fieldName, type, label: fieldName })
            return result
        },
        []
    ).sort(
        (a, b) => {
            if (a.label > b.label) return 1
            else if (a.label < b.label) return -1
            return 0
        }
    )

    return struct
}

class FilterBox extends Component {

    constructor(props) {
        super(props)

        this.state = {
            filterText: '',
            fieldToSearch: props.fieldOptions[0],
            isFilterNegation: false
        }
    }

    parseFilterText = text => {
        const criteriaArray = text.trim().toLocaleLowerCase().split(/\s*\|\|\s*/gm)

        return criteriaArray.map(
            txt => {
                const foundNumericCondition = (new RegExp(NUMERIC_REGEXP, 'g')).exec(txt)
                if (foundNumericCondition) {
                    const { groups: { condition, criteria }} = foundNumericCondition
                    return { conditionType: 'numeric', criteria, condition }
                }

                return { conditionType: 'contains', criteria: txt }
            }
        )
    }

    onAddFilterClickHandler = () => {
        const { onFilterAdd, appliedFilters } = this.props
        if (typeof onFilterAdd !== 'function') {
            return// No handler, so do nothing
        }

        const { filterText:origText, fieldToSearch: { type, fieldName }, isFilterNegation } = this.state
        let filterText = origText.trim()

        if (typeof filterText !== 'string') {
            return// Empty string
        }

        if (appliedFilters.find(a => a.id === `${fieldName}-${filterText}`)) {
            return// Filter already added
        }

        const filterConditions = this.parseFilterText(filterText)
        let filter = card => {
            let criteriaToSearchOn
            if (type === 'object') {// no implementation yet, so we search in the whole object
                criteriaToSearchOn = [JSON.stringify( card[fieldName] )]
            }
            else {
                let val = card[fieldName]
                if (val === null || val === undefined) {
                    return false
                }
                criteriaToSearchOn = Array.isArray(val) ? val.slice() : [val]

                // We look for the field in the back of the card and add it to our search
                if (card['cardBack'] && card['cardBack'][fieldName]) {
                    val = card['cardBack'][fieldName]
                    if (Array.isArray(val)) {
                        criteriaToSearchOn = criteriaToSearchOn.concat(val)
                    }
                    else {
                        criteriaToSearchOn.push( val )
                    }
                }
            }

            return findArrayItemsInArrayOrString(filterConditions, criteriaToSearchOn)
        }

        if (isFilterNegation) {
            const oldFilter = filter
            filter = card => !oldFilter(card)
        }

        onFilterAdd(`${fieldName}: ${isFilterNegation ? 'NOT ' : ''} ${filterText}`, filter)
    }

    onFieldSelectionChangeHandler = event => {
        const { fieldOptions } = this.props
        this.setState({ fieldToSearch: fieldOptions[event.target.value] })
    }

    onFilterTextChangeHandler = (event) => {
        this.setState({ filterText: event.target.value })
    }

    onNegationFilterChangeHandler = (event) => {
        this.setState({ isFilterNegation: event.target.checked })
    }

    onInputTextKeyDownHandler = (event) => {
        const isEnter = event.keyCode === 13
        if (isEnter) {
            this.onAddFilterClickHandler()
        }
    }

    render() {
        const { filterText, isFilterNegation } = this.state
        const { fieldOptions, appliedFilters, onFilterRemove, totalCards } = this.props

        const removedOptions = ['availableDate', 'cardImageUrl', 'cardBack', 'era', /*'type', 'color', 'energy', 'comboEnergy', 'rarity', 'character', 'skillKeywords', 'cardNumber', */]
        const optionsToSelect = fieldOptions.map(
            (option, index) =>
                !removedOptions.includes(option.fieldName)
                ? <option key={option.fieldName} value={index}>
                    {option.label}
                </option>
                : null
        )

        const filtersApplied = appliedFilters.map(
            ({ id }) => <Filter key={id} id={id} onFilterRemove={onFilterRemove} />
        )

        return (
            <div className="col s12 filter-box white-text">
                <div className="row">
                    <div className="input-field col s12">
                        <div htmlFor="type">Card Type</div>
                        <div className="mx-auto btn-group-toggle btn-group">
                            {typeOptions}
                        </div>
                    </div>
                    <div className="input-field col s12">
                        <div htmlFor="color">Color</div>
                        <div id="color" className="mx-auto btn-group-toggle btn-group">
                            {colorOptions}
                        </div>
                    </div>
                    <div className="input-field col s12">
                        <div htmlFor="energy">Energy</div>
                        <div id="energy" className="mx-auto btn-group-toggle btn-group">
                            {energyOptions}
                        </div>
                    </div>
                    <div className="input-field col s12">
                        <div htmlFor="cboenergy">Combo Energy</div>
                        <div id="cboenergy" className="mx-auto btn-group-toggle btn-group">
                            {cboEnergyOptions}
                        </div>
                    </div>
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
                    <select id="filter-box-type-input" defaultValue={0} onChange={this.onFieldSelectionChangeHandler}> {optionsToSelect} </select>
                    <label htmlFor="filter-box-type-input">Field</label>
                </div>

                <div className="input-field col s12">
                    <input
                        id="filter-box-criteria-input"
                        type="text" placeholder="For an OR operation use ||"
                        value={filterText}
                        onChange={this.onFilterTextChangeHandler} 
                        onKeyDown={this.onInputTextKeyDownHandler} />
                    <label htmlFor="filter-box-criteria-input">Search</label>
                </div>

                <div className="input-field col s3">
                    <label>
                        <input type="checkbox" checked={isFilterNegation} onChange={this.onNegationFilterChangeHandler}/>
                        <span>
                            { isFilterNegation ? 'Not' : null }
                        </span>
                    </label>
                </div>

                <div className="input-field col s3">
                    <span><button className="waves-effect waves-light btn" onClick={this.onAddFilterClickHandler}>Add</button></span>
                </div>
                <div className="row">
                    <ul>{filtersApplied}</ul>
                </div>
                <div className="row">
                    <span className="white-text">Total of cards: {totalCards}</span>
                </div>
            </div>
        )
    }
}

const COLORS = ['B', 'U', 'G', 'Y', 'R']
const colorOptions = COLORS.map((currentColor) => <label id={currentColor} className="btn btn-secondary" key={currentColor}>{currentColor}</label>)

const TYPES = ['BATTLE', 'EXTRA', 'LEADER']
const typeOptions = TYPES.map((currentType) => <label id={currentType} className="btn btn-secondary" key={currentType}>{currentType}</label>)

const energyOptions = []
let i=0
for(i=0; i<=5; i++) {
    energyOptions[i] = <label id={i} className="btn btn-secondary">{i}</label>
}
energyOptions[i] = <label id={i} className="btn btn-secondary">{i}+</label>

const cboEnergyOptions = []
for(let i=0; i<=2; i++) {
    cboEnergyOptions[i] = <label id={i} className="btn btn-secondary">{i}</label>
}

const
    mapStateToProps = ({ search }) => ({
        totalCards: search.result.length,
        appliedFilters: search.filters,
        fieldOptions: getFieldsToSearch( search.cardsDictionary[ Object.keys(search.cardsDictionary)[4] ] )
    }),
    mapDispatchToProps = { searchCards, onFilterAdd: addFilter, onFilterRemove: removeFilter }
export default connect(mapStateToProps, mapDispatchToProps)(FilterBox)
