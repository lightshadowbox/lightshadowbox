import { createSelector } from 'reselect';
import { FIELDS_STATE, KEY_REDUCER_SAGA } from './consts';
import { initState } from './reducer';

const commonSelector = (state) => state[KEY_REDUCER_SAGA] || initState;

export const makeSelectLoading = () => createSelector(commonSelector, (item) => item[FIELDS_STATE.IS_LOADING]);
export const makeSelectLoadingAction = () => createSelector(commonSelector, (item) => item[FIELDS_STATE.IS_LOADING_ACION]);
