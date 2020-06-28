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
    [nameActs.onIncognitoLoadWallet]: (state) => {
        state[FIELDS_STATE.INCOGNITO_LOADING] = true;
    },
    [nameActs.onIncognitoCreateWallet]: (state) => {
        state[FIELDS_STATE.INCOGNITO_LOADING] = true;
    },
    [nameActs.onIncognitoLoadWalletSucceeded]: (state, action) => {
        const { payload } = action;
        state[FIELDS_STATE.WALLET] = payload ? JSON.stringify(payload) : null;
        state[FIELDS_STATE.INCOGNITO_ERROR] = initState[FIELDS_STATE.INCOGNITO_ERROR];
        state[FIELDS_STATE.INCOGNITO_LOADING] = false;
    },
    [nameActs.onIncognitoLoadWalletFailed]: (state, action) => {
        const { payload } = action;
        state[FIELDS_STATE.WALLET] = initState[FIELDS_STATE.WALLET];
        state[FIELDS_STATE.INCOGNITO_ERROR] = payload;
        state[FIELDS_STATE.INCOGNITO_LOADING] = false;
    },
});

export default incognitoDataReducer;
