import { all, fork } from 'redux-saga/effects';
import incognitoSaga from 'app/redux/incognito/saga';

export default function* rootSaga() {
    yield all([fork(incognitoSaga)]);
}
