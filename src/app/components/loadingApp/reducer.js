/* eslint-disable no-param-reassign */
import { createReducer } from '@reduxjs/toolkit';

import * as nameActs from './action';
import { FIELDS_STATE } from './const';

export const initState = {
    [FIELDS_STATE.LOADING]: false,
};

const Loading = createReducer(initState, {
    [nameActs.loadingOpen]: (state) => {
        state[FIELDS_STATE.LOADING] = true;
        return state;
    },
    [nameActs.loadingClose]: (state) => {
        state[FIELDS_STATE.LOADING] = false;
        return state;
    },
});

export default Loading;
