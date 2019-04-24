import React, { Component } from 'react';
import { connect } from 'react-redux';
import { test } from './redux/modules/test'
import { searchCards, addFilter, removeFilter } from './redux/modules/search'
import logo from './logo.svg';
import './App.css';
import FilterBox from './components/FilterBox';
import Card from './components/Card';


const
    mapStateToProps = state => state,
    mapDispatchToProps = { testAction:test, searchCards, addFilter, removeFilter }

class App extends Component {
    constructor(props) {
        super(props)
        
        const { search: { cardsDictionary } } = props
        this.state = {
            fieldsToSearch: this.getFieldsToSearch( cardsDictionary[ Object.keys(cardsDictionary)[4] ] )
        }
    }

    onClickHandler() {
        this.props.testAction('hola')
        this.props.searchCards()
    }

    getFieldsToSearch = (card) => {
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
        )

        console.log(card, struct)
        return struct
    }

    render() {
        const { fieldsToSearch } = this.state
        const {
            //State
            test: { testCount }, search: { result:cards, filters },

            // Actions
            searchCards, addFilter, removeFilter
        } = this.props;




        let cardsFound = null
        if (cards.length > 0 && filters.length > 0) {
            cardsFound = cards.map( card => <Card cardInfo={card}/> )
        }

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <FilterBox
                    fieldOptions={fieldsToSearch}
                    appliedFilters={filters}
                    onFilterAdd={addFilter}
                    onFilterRemove={removeFilter}
                />
                {filters.length > 0 ? 
                    'Total cards found: ' + cards.length
                    : null
                }
                {cardsFound}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
