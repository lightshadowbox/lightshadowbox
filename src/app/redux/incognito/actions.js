import { createAction } from '@reduxjs/toolkit';
import * as nameConst from './consts';

export const onIncognitoInit = createAction(nameConst.INCOGNITO_INIT, () => {});
export const onIncognitoInitFailed = createAction(nameConst.INCOGNITO_INIT_FAILED, (error) => ({ payload: error }));
export const onIncognitoInitSucceeded = createAction(nameConst.INCOGNITO_INIT_SUCCESSED, (data) => ({ payload: data }));
