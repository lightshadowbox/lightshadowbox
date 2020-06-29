import { createAction } from '@reduxjs/toolkit';
import * as nameConst from './consts';

export const onIncognitoLoadWallet = createAction(nameConst.INCOGNITO_LOAD_WALLET, (data) => ({ payload: data }));
export const onIncognitoCreateWallet = createAction(nameConst.INCOGNITO_CREATE_WALLET, (data) => ({ payload: data }));
export const onIncognitoLoadWalletFailed = createAction(nameConst.INCOGNITO_LOAD_WALLET_FAILED, (error) => ({ payload: error }));
export const onIncognitoLoadWalletSucceeded = createAction(nameConst.INCOGNITO_LOAD_WALLET_SUCCEEDED, (data) => ({ payload: data }));
export const onIncognitoAccountSelected = createAction(nameConst.INCOGNITO_ACCOUNT_SELECTED, (data) => ({ payload: data }));
