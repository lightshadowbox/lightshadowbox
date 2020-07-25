import { createAction } from '@reduxjs/toolkit';
import * as nameConst from './consts';

export const onIncognitoPrivacyTokens = createAction(nameConst.INCOGNITO_GET_PRIVACY_TOKENS);
export const updateTotalBalance = createAction(nameConst.UPDATE_TOTAL_BALANCE, (data) => ({ payload: data }));
export const updateAvailableBalance = createAction(nameConst.UPDATE_AVAILABLE_BALANCE, (data) => ({ payload: data }));
export const onIncognitoGetPCustomeToken = createAction(nameConst.INCOGNITO_GET_PCUSTOM_TOKEN);
export const onIncognitoGetPCustomeSucceeded = createAction(nameConst.INCOGNITO_GET_PCUSTOM_TOKEN_SUCCEEDED, (data) => ({ payload: data }));
export const onIncognitoGetPCustomeFailed = createAction(nameConst.INCOGNITO_GET_PCUSTOM_TOKEN_FAILED, (error) => ({ payload: error }));
export const onIncognitoGetAccounts = createAction(nameConst.INCOGNITO_GET_ACCOUNTS, (data) => ({ payload: data }));
export const onIncognitoGetAccountsSucceeded = createAction(nameConst.INCOGNITO_GET_ACCOUNTS_SUCCEEDED, (data) => ({ payload: data }));
export const onIncognitoAccountSelected = createAction(nameConst.INCOGNITO_ACCOUNT_SELECTED, (data) => ({ payload: data }));
export const onIncognitoCreateAccountSucceeded = createAction(nameConst.INCOGNITO_CREATE_ACCOUNT, (data) => ({ payload: data }));
export const onIncognitoRemoveAccountSucceeded = createAction(nameConst.INCOGNITO_REMOVE_ACCOUNT, (data) => ({ payload: data }));
export const onIncognitoError = createAction(nameConst.INCOGNITO_REMOVE_ERROR, (data) => ({ payload: data }));
export const onIncognitoPrivacyTokenSelected = createAction(nameConst.INCOGNITO_PRIVACY_TOKEN_SELECTED, (data) => ({ payload: data }));
