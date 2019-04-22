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
            filterText: null,
            fieldToSearch: null
        }
    }

    parseFilterText = text => {
        return text.trim().split(/\s*\|\|\s*/gm).map(str => str.toLocaleLowerCase())
    }

    onAddFilterClickHandler = event => {
        const { onFilterAdd, appliedFilters } = this.props;
        if (typeof onFilterAdd !== 'function') {
            return// No handler, so do nothing
        }
        
        const { filterText, fieldToSearch: { type, fieldName } } = this.state
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

        onFilterAdd(`${fieldName}-${filterText}`, filter)
    }

    onFieldSelectionChangeHandler = event => {
        const { fieldOptions } = this.props
        this.setState({ fieldToSearch: fieldOptions[event.target.value] })
    }

    onFilterTextChangeHandler = (event) => {
        this.setState({ filterText: event.target.value })
    }

    render() {
        const { filterText } = this.props;
        const { fieldOptions, appliedFilters, onFilterRemove } = this.props;

        const optionsToSelect = fieldOptions.map(
            (option, index) =>
                <option key={option.fieldName} value={index}>
                    {option.label}
                </option>
        )

        const filtersApplied = appliedFilters.map(
            ({ id }) =>  (
                <li key={id}>
                    {id}
                    <button onClick={_ => onFilterRemove(id)}>Remove</button>
                </li>
            )
        )
        return (
            <div>
                <select onChange={this.onFieldSelectionChangeHandler}> {optionsToSelect} </select>
                <span>
                    <input type="text" value={filterText} onChange={this.onFilterTextChangeHandler} />
                </span>
                <span><button onClick={this.onAddFilterClickHandler}>Add</button></span>
                <ul>{filtersApplied}</ul>
            </div>
        )
    }
}

export default FilterBox;
