/**
 * Combine all reducers in this file and export the combined reducers.
 */

import {AnyAction, combineReducers, Reducer} from '@reduxjs/toolkit';
import {connectRouter, RouterState} from 'connected-react-router';

import {history} from '../../utils/history';
import root from './root';

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export function createReducer() {
  return combineReducers({
    root,
    router: connectRouter(history) as Reducer<RouterState, AnyAction>,
  });
}
