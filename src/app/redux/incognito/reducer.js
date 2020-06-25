import { createReducer } from '@reduxjs/toolkit';
import * as nameActs from './actions';
import { FIELDS_STATE } from './consts';

export const initState = {
    [FIELDS_STATE.WALLET]: null,
    [FIELDS_STATE.MASTER_ACCOUNT]: null,
    [FIELDS_STATE.INCOGNITO_LOADING]: false,
    [FIELDS_STATE.INCOGNITO_ERROR]: null,
};

const incognitoDataReducer = createReducer(initState, {
    [nameActs.onIncognitoInit]: (state) => {
        state[FIELDS_STATE.INCOGNITO_LOADING] = true;
    },
    [nameActs.onIncognitoInitSucceeded]: (state, action) => {
        const { payload } = action;
        state[FIELDS_STATE.WALLET] = payload.wallet;
        state[FIELDS_STATE.WALLET] = payload.masterAccount;
        state[FIELDS_STATE.INCOGNITO_LOADING] = false;
    },
    [nameActs.onIncognitoInitFailed]: (state, action) => {
        const { payload } = action;

        state[FIELDS_STATE.COUNTRY_ERROR] = payload;
        state[FIELDS_STATE.INCOGNITO_LOADING] = false;
    },
});

export default incognitoDataReducer;
