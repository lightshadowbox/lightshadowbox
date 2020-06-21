import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { intlReducer } from 'react-intl-redux';
import history from 'app/routes/history';
import loadingAppReducer from 'app/components/loadingApp/reducer';

const rootReducer = (asyncReducers = {}) => {
    return combineReducers({
        router: connectRouter(history),
        intl: intlReducer,
        loadingAppReducer,
        ...asyncReducers,
    });
};
export default rootReducer;
