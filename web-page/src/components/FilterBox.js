import React, { Component } from 'react';
import Filter from './Filter';


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


        

        const filterConditions = this.parseFilterText(filterText)
        let filter = card => {
            let criteriaToSearchOn
            if (type === 'object') {// no implementation yet, so we search in the whole object
                criteriaToSearchOn = [JSON.stringify( card[fieldName] )]
            }
            else {
                let val = card[fieldName]
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
