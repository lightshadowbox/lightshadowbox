import { createSelector } from 'reselect';
import { FIELDS_STATE, KEY_REDUCER_INCOGNITO } from './consts';
import { initState } from './reducer';

const incognitoSelector = (state) => state[KEY_REDUCER_INCOGNITO] || initState;

export const makeSelectIncognitoLoading = () => createSelector(incognitoSelector, (item) => item[FIELDS_STATE.INCOGNITO_LOADING]);
export const makeSelectAccounts = () => createSelector(incognitoSelector, (item) => item[FIELDS_STATE.ACCOUNTS]);
export const makeSelectAccountSelected = () => createSelector(incognitoSelector, (item) => item[FIELDS_STATE.ACCOUNT_SELECTED]);
