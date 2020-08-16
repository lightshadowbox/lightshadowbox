import incognitoSaga from 'app/redux/incognito/saga'
import { all, fork } from 'redux-saga/effects'

export default function* rootSaga() {
  yield all([fork(incognitoSaga)])
}
