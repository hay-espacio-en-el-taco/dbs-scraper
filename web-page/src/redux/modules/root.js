'use stric';

import { combineEpics } from 'redux-observable';
import { combineReducers } from 'redux';
import test, { testEpic, testSuccessEpic } from './test'
import search from './search'
import deck from './deck'

export const rootEpic = combineEpics(

  // Test
  testEpic, testSuccessEpic
);

export const rootReducer = combineReducers({
    test, search, deck
});