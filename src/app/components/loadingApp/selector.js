import { createSelector } from 'reselect';

import { initState } from './reducer';
import { KEY_REDUCER_SAGA, FIELDS_STATE } from './const';

const selectLoading = (state) => state[KEY_REDUCER_SAGA] || initState;

const makeSelectLoading = () => createSelector(selectLoading, (item) => item[FIELDS_STATE.LOADING]);
export default makeSelectLoading;
