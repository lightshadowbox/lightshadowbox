import { createReducer } from '@reduxjs/toolkit';
import * as nameActs from './actions';
import { FIELDS_STATE } from './consts';

export const initState = {
    [FIELDS_STATE.SIDEBAR_TOGGLE]: true,
    [FIELDS_STATE.ACTION_CONFIRM]: null,
    [FIELDS_STATE.IS_LOADING]: false,
};

const commonReducer = createReducer(initState, {
    [nameActs.onSidebarToggle]: (state, action) => {
        const { payload } = action;
        state[FIELDS_STATE.SIDEBAR_TOGGLE] = payload;
    },
    [nameActs.onActionConfirm]: (state, action) => {
        const { payload } = action;
        state[FIELDS_STATE.ACTION_CONFIRM] = payload;
    },
    [nameActs.onResetActionConfirm]: (state) => {
        state[FIELDS_STATE.ACTION_CONFIRM] = { active: false };
    },
    [nameActs.loadingOpen]: (state) => {
        state[FIELDS_STATE.IS_LOADING] = true;
    },
    [nameActs.loadingClose]: (state) => {
        state[FIELDS_STATE.IS_LOADING] = false;
    },
});

export default commonReducer;
