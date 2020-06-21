/* eslint-disable react-hooks/rules-of-hooks */
import { useInjectReducer, useInjectSaga } from 'redux-injectors';

const injectReducerSaga = (KEY_REDUCER_SAGA, reducer, saga) => {
    reducer && useInjectReducer({ key: KEY_REDUCER_SAGA, reducer });
    saga && useInjectSaga({ key: KEY_REDUCER_SAGA, saga });
};

export default injectReducerSaga;
