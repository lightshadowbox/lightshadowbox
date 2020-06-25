import { createAction } from '@reduxjs/toolkit';
import * as nameConst from './consts';

export const onSidebarToggle = createAction(nameConst.SIDEBAR_TOGGLE, (active) => ({ payload: active }));
export const onResetActionConfirm = createAction(nameConst.RESET_ACTION_CONFIRM);
export const onActionConfirm = createAction(nameConst.ACTION_CONFIRM, (data) => ({
    payload: data,
}));
export const loadingOpen = createAction(nameConst.LOADING_OPEN);
export const loadingClose = createAction(nameConst.LOADING_CLOSE);
