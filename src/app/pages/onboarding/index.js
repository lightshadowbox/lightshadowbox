import React, { memo } from 'react'

import { Button, Col, Divider, Row, Typography } from 'antd'
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

const OnboardingStyled = styled.div``

const LogoImage = styled.img`
  max-width: 160px;
  margin: 2px;
`

const SoluganTextStyled = styled.p`
  margin-top: -12px;
  margin-bottom: -2px;
  font-size: 18px;
`

const StartButtonStyled = styled(Button)`
  width: 240px;
  height: 56px;
  border-radius: 15px;
  font-size: 18px;
`

const TextTip = styled(Typography.Link)`
  margin-top: -12px;
  font-size: 16px;
`

const Onboarding = () => {
  const dispatch = useDispatch()
  const onAccessWallet = async () => {
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
    <OnboardingStyled>
      <Helmet>
        <title>{META_TITLE_PAGE.WELCOME}</title>
      </Helmet>
      <div className="wrap">
        <Row gutter={[30, 30]}>
          <Col className="text-center" span={24}>
            <LogoImage src={Logo} alt="LIGHT SHADOW BOX" />
            <Typography.Title level={1}>LIGHT SHADOW BOX</Typography.Title>
            <SoluganTextStyled>Reclaim your crypto privacy</SoluganTextStyled>
          </Col>
        </Row>
        <Row>
          <Col className="text-center" md={{ span: 8, push: 8 }} sm={{ span: 24, push: 0 }} xs={{ span: 24, push: 0 }}>
            <StartButtonStyled type="primary" className="btn" size="large" onClick={onAccessWallet}>
              Get Started
            </StartButtonStyled>

            <Divider style={{ fontSize: 13 }}>or</Divider>
            <TextTip href={`https://old-incognito.vercel.app/migrate?callback=${window.location.origin}`}>
              Migrate your account from <b>incwallet.app</b>
            </TextTip>
          </Col>
        </Row>
      </div>
    </OnboardingStyled>
  )
}

export default memo(Onboarding)
