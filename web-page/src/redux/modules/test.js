'use stric';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/ignoreElements';

// Initial State
const initState = {
    testCount: 0
}


// Actions
const
    TEST = 'dbs-scraper/test/TEST',
    TEST_SUCCESS = 'dbs-scraper/test/TEST_SUCCESS'


// Reducer
export default function reducer(state = initState, action = {}) {
    switch(action.type) {
        case TEST: return { ...state, ...{
            testCount: state.testCount + 1 
        }}

        default:  return state
    }
}


// Action Creators
export const test = text => ({
    type: TEST,
    text
})

export const testSuccess = _ => ({
    type: TEST_SUCCESS
})


// Side effects
export const testEpic = action$ => 
    action$
        .ofType(TEST)
        .map( testSuccess )

export const testSuccessEpic = action$ => 
    action$
        .ofType(TEST_SUCCESS)
        .do( _ => console.log('Test Success!') )
        .ignoreElements()