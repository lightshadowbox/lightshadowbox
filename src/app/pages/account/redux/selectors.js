import { createSelector } from 'reselect';
import { KEY_REDUCER_SAGA, initialState } from './slice';

const accountSelector = (state) => state[KEY_REDUCER_SAGA] || initialState;

export const makeSelectCreatedAccountStatus = () => createSelector(accountSelector, (item) => item.isCreateAccount);
export const makeSelectImportedAccountStatus = () => createSelector(accountSelector, (item) => item.isImportAccount);
export const makeSelectAddCoinStatus = () => createSelector(accountSelector, (item) => item.isAddCoin);
export const makeSelectSendAssetStatus = () => createSelector(accountSelector, (item) => item.isSendAsset);
export const makeSelectReceiveAssetStatus = () => createSelector(accountSelector, (item) => item.isReceiveAsset);
