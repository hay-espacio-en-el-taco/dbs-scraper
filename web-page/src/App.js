import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'materialize-css/dist/css/materialize.min.css'

import { searchCards, addFilter, removeFilter } from './redux/modules/search'
import logo from './logo.svg';
import './App.css';
import FilterBox from './components/FilterBox';
import Card from './components/Card';


const
    mapStateToProps = state => state,
    mapDispatchToProps = { searchCards, addFilter, removeFilter }

class App extends Component {
    constructor(props) {
        super(props)
        
        const { search: { cardsDictionary } } = props
        this.state = {
            fieldsToSearch: this.getFieldsToSearch( cardsDictionary[ Object.keys(cardsDictionary)[4] ] ),
        }
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
        ).sort(
            (a, b) => {
                if (a.label > b.label) return 1
                else if (a.label < b.label) return -1
                return 0
            }
        )

        return struct
    }

    render() {
        const { fieldsToSearch, cardsContent } = this.state
        const {
            //State
            search: { result:cards, filters },

            // Actions
            searchCards, addFilter, removeFilter
        } = this.props;


        let cardsFound = null
        if (cards.length > 0 && filters.length > 0) {
            cardsFound = cards.map( card => <Card key={card.cardNumber} cardInfo={card}/> )
        }

        return (
            <div className="App">
                <header className="App-header grey darken-3">
                    <div className="container">
                        <FilterBox
                            fieldOptions={fieldsToSearch}
                            appliedFilters={filters}
                            onFilterAdd={addFilter}
                            onFilterRemove={removeFilter}
                        />
                        { filters.length > 0 ? 
                            <div className="col 4 white-text">Total cards found: {cards.length}</div>
                            : null
                        }
                    </div>
                </header>
                <div className="row">
                    {cardsFound}
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
