import { loadingClose, loadingOpen } from 'app/redux/common/actions';
import initIcognito from 'app/services/incognito';
import { all, call, fork, put, take } from 'redux-saga/effects';
import * as nameEvents from './actions';
import * as nameConst from './consts';

function* incognitoSage() {
    while (true) {
        console.log('asdas');
        yield take(nameConst.INCOGNITO_INIT);
        yield put(loadingOpen());
        const data = yield call(initIcognito());
        if (data && data.error) {
            yield put(nameEvents.onIncognitoInitFailed(data.errorMess));
        } else {
            yield put(nameEvents.onIncognitoInitSucceeded(data));
        }
        yield put(loadingClose());
    }
}

export default function* root() {
    yield all([fork(incognitoSage)]);
}
