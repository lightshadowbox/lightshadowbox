import { createReducer } from '@reduxjs/toolkit';
import * as nameActs from './actions';
import { FIELDS_STATE } from './consts';

export const initState = {
    [FIELDS_STATE.IS_LOADING]: false,
    [FIELDS_STATE.IS_LOADING_ACION]: false,
};

const commonReducer = createReducer(initState, {
    [nameActs.loadingOpen]: (state) => {
        state[FIELDS_STATE.IS_LOADING] = true;
    },
    [nameActs.loadingClose]: (state) => {
        state[FIELDS_STATE.IS_LOADING] = false;
    },
    [nameActs.loadingOpenAction]: (state) => {
        state[FIELDS_STATE.IS_LOADING_ACION] = true;
    },
    [nameActs.loadingCloseAction]: (state) => {
        state[FIELDS_STATE.IS_LOADING_ACION] = false;
    },
});

export default commonReducer;
