'use stric'

// import 'rxjs/add/operator/map'
// import 'rxjs/add/operator/do'
// import 'rxjs/add/operator/ignoreElements'

import AllCards from '../../cards.json'

const CARDS_DICTIONARY = Object.keys(AllCards).reduce(
        (result, card) => {
            result[card.cardNumber] = card
            return result
        },
        {}
)

// Utils
const _searchCards = (filters) => {
    if (filters.length === 0) {
        return AllCards
    }

    return AllCards.filter( card => filters.reduce(
        (carry, filter) => carry && filter(card), 
        true
    ) )
}

// Initial State
const initState = {
    cardsDictionary: CARDS_DICTIONARY,
    filters: [],
    result: null
}


// Actions
const
    SEARCH_CARDS = 'dbs-scraper/search/SEARCH_CARDS',
    ADD_FILTER = 'dbs-scraper/search/ADD_FILTER',
    REMOVE_FILTER = 'dbs-scraper/search/REMOVE_FILTER',
    CLEAR_FILTERS = 'dbs-scraper/search/CLEAR_FILTERS'


// Reducer
export default function reducer(state = initState, action = {}) {
    switch(action.type) {

        case SEARCH_CARDS: return { ...state, ...{ result: _searchCards(state.filters) } }

        case ADD_FILTER: {
            const newFilterArray = state.filters.slice()
            newFilterArray.push(action.filter)
            return { ...state, ...{ filters: newFilterArray } }
        }

        case REMOVE_FILTER: {
            const newFilterArray = state.filters.slice()
            const index = newFilterArray.indexOf(action.filter)
            newFilterArray.splice(index, 1)
            return { ...state, ...{ filters: newFilterArray } }
        }

        case CLEAR_FILTERS:
            return { ...state, ...{ filters: [] } }

        default:  return state
    }
}


// Action Creators
export const searchCards = () => ({
    type: SEARCH_CARDS
})

export const addFilter = filter => ({
    type: ADD_FILTER,
    filter
})

export const removeFilter = filter => ({
    type: REMOVE_FILTER,
    filter
})

export const clearFilters = () => ({
    type: CLEAR_FILTERS
})
