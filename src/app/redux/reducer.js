import { connectRouter } from 'connected-react-router';
import { intlReducer } from 'react-intl-redux';
import { combineReducers } from 'redux';
import commonReducer from 'app/redux/common/reducer';
import * as incognitoConst from 'app/redux/incognito/consts';
import incognitoDataReducer from 'app/redux/incognito/reducer';
import history from 'app/routes/history';

const rootReducer = (asyncReducers = {}) => {
    return combineReducers({
        router: connectRouter(history),
        intl: intlReducer,
        [incognitoConst.KEY_REDUCER_INCOGNITO]: incognitoDataReducer,
        commonReducer,
        ...asyncReducers,
    });
};
export default rootReducer;
