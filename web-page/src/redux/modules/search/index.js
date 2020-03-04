'use stric'
import { combineReducers } from 'redux';
import { createSlice } from '@reduxjs/toolkit'
import { ofType } from 'redux-observable'
import { map, withLatestFrom } from 'rxjs/operators'

import { cards as AllCards, attributes } from '../../../cards.json'
import { filterCards } from './helpers' 
import filtersReducer, { addFilter, updateFilter, removeFilter } from './filters' 


console.log('Wow, such attributes', attributes)

const resultSlice = createSlice({
    name: 'search/result',
    initialState: AllCards,
    reducers: {
        searchCards(_, action) {
            const { filters } = action.payload
            // const t0 = performance.now()

            
            const res = filterCards(AllCards, filters)
            return res
            // const t1 = performance.now()
            // console.log(`Filtering cards took "${t1 - t0}" miliseconds.`, state.length)
        }
    }
})

const CARDS_DICTIONARY = AllCards.reduce(
    (result, card) => {
        result[card.cardNumber] = card
        return result
    },
    {}
)

// Actions
export const { searchCards } = resultSlice.actions

// Reducer
export default combineReducers({
    filters: filtersReducer,
    result: resultSlice.reducer,
    allCards: () => AllCards,
    cardsDictionary: () => CARDS_DICTIONARY,
    isSearching: () => false
})

// Side effects
export const updateSearchEpic = (action$, state$)  => action$.pipe(
    ofType(addFilter, updateFilter, removeFilter),
    withLatestFrom(state$),
    map(([action, state]) => {
        const { search: { filters } } = state
        console.log('Wow, such action', action.type)
        return searchCards({ filters })
    })
)
