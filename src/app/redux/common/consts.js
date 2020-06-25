import { NSP_COMMON } from 'app/consts';

export const KEY_REDUCER_SAGA = 'commonReducer';

export const SIDEBAR_TOGGLE = `${NSP_COMMON}SIDEBAR_TOGGLE`;
export const LOADING_OPEN = `${NSP_COMMON}LOADING_OPEN`;
export const LOADING_CLOSE = `${NSP_COMMON}LOADING_CLOSE`;
export const ACTION_CONFIRM = `${NSP_COMMON}ACTION_CONFIRM`;
export const RESET_ACTION_CONFIRM = `${NSP_COMMON}RESET_ACTION_CONFIRM`;
export const OK_ACTION = `${NSP_COMMON}OK_ACTION`;
export const CANCEL_ACTION = `${NSP_COMMON}CANCEL_ACTION`;

export const FIELDS_STATE = {
    SIDEBAR_TOGGLE: 'sidebarToggle',
    IS_LOADING: 'isLoading',
    ACTION_CONFIRM: 'actionConfirm',
};
