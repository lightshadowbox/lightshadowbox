import { createAction } from '@reduxjs/toolkit';
import * as nameConst from './consts';

export const onIncognitoGetAccounts = createAction(nameConst.INCOGNITO_GET_ACCOUNTS, (data) => ({ payload: data }));
export const onIncognitoGetAccountsSucceeded = createAction(nameConst.INCOGNITO_GET_ACCOUNTS_SUCCEEDED, (data) => ({ payload: data }));
export const onIncognitoAccountSelected = createAction(nameConst.INCOGNITO_ACCOUNT_SELECTED, (data) => ({ payload: data }));
export const onIncognitoCreateAccountSucceeded = createAction(nameConst.INCOGNITO_CREATE_ACCOUNT, (data) => ({ payload: data }));
export const onIncognitoRemoveAccountSucceeded = createAction(nameConst.INCOGNITO_REMOVE_ACCOUNT, (data) => ({ payload: data }));
export const onIncognitoError = createAction(nameConst.INCOGNITO_REMOVE_ERROR, (data) => ({ payload: data }));
