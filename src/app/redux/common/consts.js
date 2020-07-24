import { NSP_COMMON } from 'app/consts';

export const KEY_REDUCER_SAGA = 'commonReducer';

export const LOADING_OPEN = `${NSP_COMMON}LOADING_OPEN`;
export const LOADING_CLOSE = `${NSP_COMMON}LOADING_CLOSE`;

export const LOADING_OPEN_ACTION = `${NSP_COMMON}LOADING_OPEN_ACTION`;
export const LOADING_CLOSE_ACTION = `${NSP_COMMON}LOADING_CLOSE_ACTION`;

export const FIELDS_STATE = {
    IS_LOADING: 'isLoading',
    IS_LOADING_ACION: 'isLoadingActive',
};
