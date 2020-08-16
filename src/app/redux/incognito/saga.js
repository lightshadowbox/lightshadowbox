import { MSG } from 'app/consts'
import { loadingCloseAction, loadingOpenAction } from 'app/redux/common/actions'
import { masterAccount } from 'app/services/incognito'
import { parseResponse } from 'app/services/parseResponse'
import isEmpty from 'lodash/isEmpty'
import { all, call, fork, put, take } from 'redux-saga/effects'

import * as nameEvents from './actions'
import { getPcustomeTokenListApi } from './api'
import * as nameConst from './consts'

function* getPCustomTokenSaga() {
  while (true) {
    yield take(nameConst.INCOGNITO_GET_PCUSTOM_TOKEN)
    const result = yield call(getPcustomeTokenListApi)
    const data = parseResponse(result)
    if (data && data.errMess) {
      yield put(nameEvents.onIncognitoGetPCustomeFailed('PCustomeToken failed to load.'))
    } else if (!isEmpty(data)) {
      yield put(nameEvents.onIncognitoGetPCustomeSucceeded(data?.Result || null))
    }
  }
}

function* getAccountsSaga() {
  while (true) {
    yield take(nameConst.INCOGNITO_GET_ACCOUNTS)
    const accounts = yield masterAccount.getAccounts()
    yield put(nameEvents.onIncognitoGetAccountsSucceeded(accounts))
  }
}

function* createAccountSaga() {
  while (true) {
    const data = yield take(nameConst.INCOGNITO_CREATE_ACCOUNT)
    yield put(loadingOpenAction())
    const result = yield call(masterAccount.createAccount, data.payload)
    if (!result || result?.error) {
      yield all([put(loadingCloseAction()), put(nameEvents.onIncognitoError(result?.error || MSG.RESTORED_WALLET_FAILED))])
    } else {
      yield all([put(loadingCloseAction()), put(nameEvents.onIncognitoCreateAccountSucceeded(result))])
    }
  }
}

// function* removeAccountSage() {
//     while (true) {
//         const data = yield take(nameConst.INCOGNITO_CREATE_ACCOUNT);
//         yield put(loadingOpenAction());
//         // const result = yield call(IncognitoInstance.masterAccount.removeAccount, data.payload);
//         // if (!result || result?.error) {
//         //     yield all([put(loadingCloseAction()), put(nameEvents.onIncognitoError(result?.error || MSG.RESTORED_WALLET_FAILED))]);
//         // } else {
//         //     yield all([put(loadingCloseAction()), put(nameEvents.onIncognitoRemoveAccountSucceeded(result))]);
//         // }
//     }
// }

export default function* root() {
  yield all([fork(getPCustomTokenSaga), fork(getAccountsSaga), fork(createAccountSaga)])
}
