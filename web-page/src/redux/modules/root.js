'use stric';

import { combineEpics } from 'redux-observable';
import { combineReducers } from 'redux';
import search, { updateSearchEpic, searchCardsEpic } from './search'
import deck from './deck'

export const rootEpic = combineEpics(

  // Search
  updateSearchEpic, searchCardsEpic
);

export const rootReducer = combineReducers({
    search, deck
});