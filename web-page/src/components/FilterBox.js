import React, { Component } from 'react';
import Filter from './Filter';


const findArrayItemsInArrayOrString = (itemsToFind, valueToSearchOn) => {

    for (let index  = 0; index < itemsToFind.length; index++) {
        if (valueToSearchOn.find(
            v => v.toString().toLocaleLowerCase().includes( itemsToFind[index].toString().toLocaleLowerCase() ) )
        ) {
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
            fieldToSearch: props.fieldOptions[0],
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
        if (type === 'object') {
            filter = card => findArrayItemsInArrayOrString(filterCondition, [JSON.stringify( card[fieldName] )])
        }
        else {
            filter = card => findArrayItemsInArrayOrString(filterCondition, [ card[fieldName] ])
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
        const { filterText, isFilterNegation, fieldToSearch } = this.state;
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
                <select defaultValue={0} onChange={this.onFieldSelectionChangeHandler}> {optionsToSelect} </select>
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
