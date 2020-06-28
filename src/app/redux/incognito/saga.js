import { all, call, fork, put, take } from 'redux-saga/effects';
import { MSG } from 'app/consts';
import { loadingCloseAction, loadingOpenAction } from 'app/redux/common/actions';
import { loadWallet, createWallet } from 'app/services/incognito';
import * as nameEvents from './actions';
import * as nameConst from './consts';

function* loadWalletSaga() {
    while (true) {
        yield take(nameConst.INCOGNITO_LOAD_WALLET);
        yield put(loadingOpenAction());
        const result = yield call(loadWallet);
        if (!result || result?.error) {
            yield put(nameEvents.onIncognitoLoadWalletFailed(result?.error || MSG.RESTORED_WALLET_FAILED));
        } else {
            yield put(nameEvents.onIncognitoLoadWalletSucceeded(result));
        }
        yield put(loadingCloseAction());
    }
}

function* createWalletSaga() {
    while (true) {
        const data = yield take(nameConst.INCOGNITO_CREATE_WALLET);
        yield put(loadingOpenAction());
        const result = yield call(createWallet, data.payload);
        if (!result || result?.error) {
            yield put(nameEvents.onIncognitoLoadWalletFailed(result?.error || MSG.RESTORED_WALLET_FAILED));
        } else {
            yield put(nameEvents.onIncognitoLoadWalletSucceeded(result));
        }
        yield put(loadingCloseAction());
    }
}

export default function* root() {
    yield all([fork(loadWalletSaga), fork(createWalletSaga)]);
}
