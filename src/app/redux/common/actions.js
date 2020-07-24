import { createAction } from '@reduxjs/toolkit';
import * as nameConst from './consts';

export const loadingOpen = createAction(nameConst.LOADING_OPEN);
export const loadingClose = createAction(nameConst.LOADING_CLOSE);

export const loadingOpenAction = createAction(nameConst.LOADING_OPEN_ACTION);
export const loadingCloseAction = createAction(nameConst.LOADING_CLOSE_ACTION);
