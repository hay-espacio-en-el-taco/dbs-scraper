'use stric'

import { from } from "rxjs";
import { ofType } from 'redux-observable';
import { map, mergeMap } from 'rxjs/operators';

import AllCards from '../../cards.json'

const CARDS_DICTIONARY = AllCards.reduce(
        (result, card) => {
            result[card.cardNumber] = card
            return result
        },
        {}
)

// Utils
const _searchCards = async (filters = []) => {
    if (filters.length === 0) {
        console.log('Wow, such debugging')
        return AllCards
    }

    var t0 = performance.now();
    const cardsFound = AllCards.filter(
        card => {
            for (let index = 0; index < filters.length; index++) {
                if ( !filters[index].filterFn(card) ) {
                    return false
                }
            }
            return true
        }
    )
    var t1 = performance.now();
    console.log("Search cards took " + (t1 - t0) + " miliseconds.")
    return cardsFound

    // return AllCards.filter(
    //     card => {
    //         for (let index = 0; index < filters.length; index++) {
    //             if ( !filters[index].filterFn(card) ) {
    //                 return false
    //             }
    //         }
    //         return true
    //     }
    // )
}

// Initial State
const initState = {
    cardsDictionary: CARDS_DICTIONARY,
    filters: [],
    result: AllCards,
    isSearching: false
}


// Actions
const
    SEARCH_CARDS = 'dbs-scraper/search/SEARCH_CARDS',
    SEARCH_CARDS_SUCCESS = 'dbs-scraper/search/SEARCH_CARDS_SUCCESS',
    ADD_FILTER = 'dbs-scraper/search/ADD_FILTER',
    REMOVE_FILTER = 'dbs-scraper/search/REMOVE_FILTER',
    CLEAR_FILTERS = 'dbs-scraper/search/CLEAR_FILTERS'


// Reducer
export default function reducer(state = initState, action = {}) {
    switch(action.type) {

        case SEARCH_CARDS: return { ...state, isSearching: true }
        case SEARCH_CARDS_SUCCESS: return { ...state, isSearching: false, result: action.result }

        case ADD_FILTER: {
            if (state.filters.find( f => f.id === action.id )) {
                return state// Avoid adding duplicated filters
            }
            const newFilterArray = state.filters.slice()
            newFilterArray.push({id: action.id, filterFn: action.filter})
            return { ...state, filters: newFilterArray }
        }

        case REMOVE_FILTER: {
            const newFilterArray = state.filters.slice()
            const index = newFilterArray.findIndex( f => f.id === action.filterId)
            newFilterArray.splice(index, 1)
            return { ...state, filters: newFilterArray }
        }

        case CLEAR_FILTERS:
            return { ...state, filters: [] }

        default:  return state
    }
}


// Action Creators
export const searchCards = () => ({
    type: SEARCH_CARDS
})

export const searchCardsSuccess = (result) => ({
    type: SEARCH_CARDS_SUCCESS,
    result
})

export const addFilter = (id, filter) => ({
    type: ADD_FILTER,
    id, filter
})

export const removeFilter = filterId => ({
    type: REMOVE_FILTER,
    filterId
})

export const clearFilters = () => ({
    type: CLEAR_FILTERS
})


// Side effects
export const updateSearchEpic = action$ => action$.pipe(
    ofType(ADD_FILTER, REMOVE_FILTER),
    map( searchCards )
)

export const searchCardsEpic = (action$, state$) => action$.pipe(
    ofType( SEARCH_CARDS ),
    map( () => state$.value ),
    mergeMap(
        ({ search }) => from( _searchCards(search.filters) )
    ),
    // tap( console.log ),
    map( searchCardsSuccess )
)
