import loadingAppReducer from 'app/components/loadingApp/reducer';
import * as incognitoConst from 'app/redux/incognito/consts';
import incognitoDataReducer from 'app/redux/incognito/reducer';
import history from 'app/routes/history';
import { connectRouter } from 'connected-react-router';
import { intlReducer } from 'react-intl-redux';
import { combineReducers } from 'redux';

const rootReducer = (asyncReducers = {}) => {
    return combineReducers({
        router: connectRouter(history),
        intl: intlReducer,
        [incognitoConst.KEY_REDUCER_INCOGNITO]: incognitoDataReducer,
        loadingAppReducer,
        ...asyncReducers,
    });
};
export default rootReducer;
