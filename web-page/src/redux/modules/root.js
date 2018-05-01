'use stric';

import { combineEpics } from 'redux-observable';
import { combineReducers } from 'redux';
import test, { testEpic, testSuccessEpic } from './test'

export const rootEpic = combineEpics(

  // Test
  testEpic, testSuccessEpic
);

export const rootReducer = combineReducers({
    test
});