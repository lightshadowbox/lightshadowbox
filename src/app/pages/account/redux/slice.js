import { createSlice } from '@reduxjs/toolkit';
import { NSP_ACCOUNT_DATA } from 'app/consts';

export const KEY_REDUCER_SAGA = 'accountReducer';

export const initialState = {
    isCreateAccount: false,
    isImportAccount: false,
};

const setCreateAccountState = (state, action) => {
    const { payload } = action;
    state.isCreateAccount = payload;
};
const setImportAccountState = (state, action) => {
    const { payload } = action;
    state.isImportAccount = payload;
};
const resetAccount = () => initialState;

const accountSlice = createSlice({
    name: `${NSP_ACCOUNT_DATA}__`,
    initialState,
    reducers: {
        onSetCreateAccountState: setCreateAccountState,
        onSetImportAccountState: setImportAccountState,
        onResetAccount: resetAccount,
    },
});

export const { onSetCreateAccountState, onSetImportAccountState, onResetAccount } = accountSlice.actions;
export default accountSlice.reducer;
