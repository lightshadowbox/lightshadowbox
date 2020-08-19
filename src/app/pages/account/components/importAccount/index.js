import React, { memo } from 'react'

import { Button, Form, Input, Modal, notification } from 'antd'
import { LOCAL_STORAGE_KEY, MSG } from 'app/consts'
import { makeSelectImportedAccountStatus } from 'app/pages/account/redux/selectors'
import { onSetImportAccountState } from 'app/pages/account/redux/slice'
import { IncognitoInstance, masterAccount as MasterAccount, TempData } from 'app/services/incognito'
import LocalStorageServices from 'app/utils/localStorage'
import isEmpty from 'lodash/isEmpty'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

const ImportAccountStyled = styled.div``

const ImportAccount = ({ onGetStatusImported }) => {
  const dispatch = useDispatch()
  const visible = useSelector(makeSelectImportedAccountStatus())
  const onHandleImportCancel = () => {
    dispatch(onSetImportAccountState(false))
  }

  const onImportAccount = async (values) => {
    if (values) {
      const { accountName, privateKey } = values
      const account = await MasterAccount.importAccount(accountName, privateKey)
      if (!isEmpty(account)) {
        if (account.status === MSG.ERROR) {
          const { message } = account
          notification.open({
            message,
          })
        } else {
          dispatch(onSetImportAccountState(false))
          notification.open({
            message: 'Success',
          })
          const backupWalletString = await IncognitoInstance.wallet.backup(TempData.password)
          LocalStorageServices.setItem(LOCAL_STORAGE_KEY.WALLET, backupWalletString)
          if (onGetStatusImported && typeof onGetStatusImported === 'function') {
            onGetStatusImported(backupWalletString)
          }
        }
      }
    }
  }

  return (
    <ImportAccountStyled>
      <Modal
        footer={null}
        title="IMPORT ACCOUNT FROM PRIVATE KEYS"
        visible={visible}
        onCancel={onHandleImportCancel}
        className="text-center custom-modal">
        <Form name="import-account" layout="vertical" onFinish={onImportAccount}>
          <Form.Item
            name="accountName"
            label="Enter your account’s name"
            rules={[{ required: true, message: 'Enter your account’s name' }]}>
            <Input spellCheck="false" />
          </Form.Item>
          <Form.Item
            name="privateKey"
            label={
              <span>
                Enter your account’s <strong>private keys</strong>
              </span>
            }
            rules={[{ required: true, message: 'Enter your account’s private keys' }]}>
            <Input.TextArea rows={4} spellCheck="false" />
          </Form.Item>
          <Form.Item className="button-actions">
            <Button type="default" size="large" htmlType="button" onClick={onHandleImportCancel}>
              Cancel
            </Button>
            <Button type="primary" size="large" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
        <p className="caption">
          All the wallet & account service will be sent directly to the main chain, we don’t store any data / keys on this website.
        </p>
      </Modal>
    </ImportAccountStyled>
  )
}

ImportAccount.propTypes = {
  onGetStatusImported: PropTypes.func,
}

export default memo(ImportAccount)
