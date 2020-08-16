import React, { memo } from 'react'

import { Button, Col, Row, Typography } from 'antd'
import { LOCAL_STORAGE_KEY, META_TITLE_PAGE } from 'app/consts'
import { loadingClose, loadingOpen } from 'app/redux/common/actions'
import { onIncognitoGetAccounts, onIncognitoGetPCustomeToken } from 'app/redux/incognito/actions'
import RouterApp from 'app/routes/consts'
import history from 'app/routes/history'
import loadIncognito from 'app/services/incognito'
import LocalStorageServices from 'app/utils/localStorage'
import Logo from 'assets/logo.gif'
import { Helmet } from 'react-helmet'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

const LogoImage = styled.img`
  max-width: 200px;
  margin: 2px;
`
const SoluganTextStyled = styled.p`
  margin-top: -18px;
  size: 12px;
`
const StartButtonStyled = styled(Button)`
  width: 249px;
  height: 69px;
  border-radius: 15px;
  font-size: 24px;
`

const PasscodePage = () => {
  const dispatch = useDispatch()
  const onUnlockWallet = async () => {
    dispatch(onIncognitoGetPCustomeToken())
    if (!LocalStorageServices.getItem(LOCAL_STORAGE_KEY.WALLET)) {
      history.push(RouterApp.rInitWallet)
    } else {
      dispatch(loadingOpen())
      await loadIncognito()
      dispatch(onIncognitoGetAccounts())
      dispatch(loadingClose())
    }
  }
  return (
    <div>
      <Helmet>
        <title>{META_TITLE_PAGE.PASSCODE}</title>
      </Helmet>
      <div className="wrap">
        <Row gutter={[30, 30]}>
          <Col className="text-center" span={24}>
            <LogoImage src={Logo} alt="LIGHT SHADOW BOX" />
            <Typography.Title level={1}>WELCOME BACK</Typography.Title>
            <SoluganTextStyled>Input passcode to unlock your wallet</SoluganTextStyled>
          </Col>
        </Row>
        <Row>
          <Col className="text-center" span={24}>
            <StartButtonStyled type="primary" className="btn" size="large" onClick={onUnlockWallet}>
              Unlock
            </StartButtonStyled>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default memo(PasscodePage)