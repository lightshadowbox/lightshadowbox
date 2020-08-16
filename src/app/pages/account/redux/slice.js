import { NSP_ACCOUNT_DATA } from 'app/consts'

import { createSlice } from '@reduxjs/toolkit'

export const KEY_REDUCER_SAGA = 'accountReducer'

export const initialState = {
  isCreateAccount: false,
  isImportAccount: false,
  isAddCoin: false,
  isSendAsset: false,
  isReceiveAsset: false,
}

const setCreateAccountState = (state, action) => {
  const { payload } = action
  state.isCreateAccount = payload
}
const setImportAccountState = (state, action) => {
  const { payload } = action
  state.isImportAccount = payload
}
const setAddCointState = (state, action) => {
  const { payload } = action
  state.isAddCoin = payload
}
const setSendAssetState = (state, action) => {
  const { payload } = action
  state.isSendAsset = payload
}
const setReceiveAssetState = (state, action) => {
  const { payload } = action
  state.isReceiveAsset = payload
}
const resetAccount = () => initialState

const accountSlice = createSlice({
  name: `${NSP_ACCOUNT_DATA}__`,
  initialState,
  reducers: {
    onSetCreateAccountState: setCreateAccountState,
    onSetImportAccountState: setImportAccountState,
    onSetAddCointState: setAddCointState,
    onSetSendAssetState: setSendAssetState,
    onSetReceiveAssetState: setReceiveAssetState,
    onResetAccount: resetAccount,
  },
})

export const {
  onSetCreateAccountState,
  onSetImportAccountState,
  onSetAddCointState,
  onSetSendAssetState,
  onSetReceiveAssetState,
  onResetAccount,
} = accountSlice.actions
export default accountSlice.reducer
