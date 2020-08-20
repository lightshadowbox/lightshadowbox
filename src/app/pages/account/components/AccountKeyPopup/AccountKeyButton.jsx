import React from 'react'

import { Button, Tooltip } from 'antd'
import LocalStorageServices from 'app/utils/localStorage'
import KeyIcon from 'assets/keys.png'
import styled from 'styled-components'

import { AccountKeyPopup } from './AccountKeyPopup'

const ButtonStyled = styled(Button)`
  width: 40px;
  height: 40px;
  background: #ffb800;
  border: 1px solid #ffb800;
  box-sizing: border-box;
  border-radius: 10px;
  img {
    max-width: 18px;
  }
  &&& {
    &:hover {
      border: 1px solid #ffb800;
      color: #40a9ff;
      background: rgba(255, 208, 85, 0.9);
      border-color: #ffb800;
    }
    &:active {
      border: 1px solid #ffb800;
      color: #40a9ff;
      background: rgba(255, 208, 85, 0.9);
      border-color: #ffb800;
    }
  }
`
export const AccountKeyButton = ({ accountName }) => {
  const isReturn = LocalStorageServices.getItem('IS_RETURN')
  const [isVisible, setIsVisible] = React.useState(!isReturn)
  return (
    <div>
      <Tooltip title={`Backup keys for Account: "${accountName}"`}>
        <ButtonStyled icon={<img src={KeyIcon} alt="Account Keys" />} onClick={() => setIsVisible(true)} />
      </Tooltip>

      <AccountKeyPopup
        visible={isVisible}
        closeModal={() => {
          setIsVisible(false)
          LocalStorageServices.setItem('IS_RETURN', true)
        }}
        accountName={accountName}
      />
    </div>
  )
}
