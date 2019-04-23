import React, { Component } from 'react';
import Filter from './Filter';


const findArrayItemsInArrayOrString = (itemsToFind, valueToSearchOn) => {
    if (Array.isArray(valueToSearchOn)) {// Transforms every value into a string lowercase
        valueToSearchOn = valueToSearchOn.map( str => str.toString().toLocaleLowerCase() )
    }
    else {// In case it's a number or boolean
        valueToSearchOn = valueToSearchOn.toString().toLocaleLowerCase()
    }

    for (let index  = 0; index < itemsToFind.length; index++) {
        if (valueToSearchOn.includes( itemsToFind[index].toString().toLocaleLowerCase() )) {
            return true
        }
    }
    return false
}


class FilterBox extends Component {

    constructor(props) {
        super(props)

        this.state = {
            filterText: '',
            fieldToSearch: null,
            isFilterNegation: false
        }
    }

    parseFilterText = text => {
        return text.split(/\s*\|\|\s*/gm).map(str => str.toLocaleLowerCase())
    }

    onAddFilterClickHandler = event => {
        const { onFilterAdd, appliedFilters } = this.props;
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


        const filterCondition = this.parseFilterText(filterText)
        let filter
        switch (true) {
            case type === 'array':
                filter = card => findArrayItemsInArrayOrString(filterCondition, card[fieldName])
                break;

            case type === 'object':
                filter = card => findArrayItemsInArrayOrString(filterCondition, JSON.stringify( card[fieldName] ))
                break;
            
            default:
                filter =  card => {
                    const value = card[fieldName] ? card[fieldName].toString().toLocaleLowerCase() : []
                    for (let index  = 0; index < filterCondition.length; index++) {
                        if (value.includes( filterCondition[index] )) {
                            return true
                        }
                    }
                    return false
                }
                break;
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

    render() {
        const { filterText, isFilterNegation } = this.state;
        const { fieldOptions, appliedFilters, onFilterRemove } = this.props;

        const optionsToSelect = fieldOptions.map(
            (option, index) =>
                <option key={option.fieldName} value={index}>
                    {option.label}
                </option>
        )

        const filtersApplied = appliedFilters.map(
            ({ id }) => <Filter key={id} id={id} onFilterRemove={onFilterRemove} />
        )

        return (
            <div>
                <select onChange={this.onFieldSelectionChangeHandler}> {optionsToSelect} </select>
                <span>
                    <input id="negation-checkbox" type="checkbox" checked={isFilterNegation} onChange={this.onNegationFilterChangeHandler}/>
                    { isFilterNegation ?  <label htmlFor="negation-checkbox">Not</label> : null }
                    <input type="text" placeholder="For an OR operation use ||" value={filterText} onChange={this.onFilterTextChangeHandler} />
                </span>
                <span><button onClick={this.onAddFilterClickHandler}>Add</button></span>
                <ul>{filtersApplied}</ul>
            </div>
        )
    }
}

export default FilterBox;
