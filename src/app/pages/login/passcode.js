import React, { memo } from 'react'

import { Col, Row, Typography } from 'antd'
import { META_TITLE_PAGE } from 'app/consts'
import { loadingClose, loadingOpen } from 'app/redux/common/actions'
import { onIncognitoGetAccounts, onIncognitoGetPCustomeToken } from 'app/redux/incognito/actions'
import loadIncognito from 'app/services/incognito'
import { walletInstance } from 'app/services/incognito/wallet'
import Logo from 'assets/logo.gif'
import ReactCodeInput from 'react-code-input'
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

const PasscodeStyled = styled(ReactCodeInput)`
  input:focus {
    outline: none !important;
    border-color: #719ece;
    box-shadow: 0 0 10px #719ece;
  }
`

const PasscodePage = () => {
  const dispatch = useDispatch()
  const [passcodeValue, setPasscode] = React.useState('')
  const [isInvalid, setIsInvalid] = React.useState(false)

  React.useMemo(async () => {
    if (passcodeValue.length >= 4) {
      try {
        await walletInstance.restoreWallet(passcodeValue)
        setIsInvalid(false)
        dispatch(onIncognitoGetPCustomeToken())
        dispatch(loadingOpen())
        await loadIncognito(passcodeValue)
        dispatch(onIncognitoGetAccounts())
        dispatch(loadingClose())
      } catch (err) {
        setIsInvalid(true)
      }
    } else {
      setIsInvalid(false)
    }
  }, [passcodeValue, dispatch])

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
            <PasscodeStyled
              type="password"
              fields={4}
              isValid={!isInvalid}
              onChange={setPasscode}
              inputStyle={{
                textAlign: 'center',
                MozAppearance: 'textfield',
                width: 57,
                borderRadius: 10,
                fontSize: 30,
                height: 70,
                padding: 8,
                backgroundColor: '#ffffff',
                color: 'black',
                marginLeft: 32,
                border: '1px solid rgba(0,0,0,0.3)',
                outline: 'none !important',
              }}
              inputStyleInvalid={{
                textAlign: 'center',
                MozAppearance: 'textfield',
                width: 57,
                borderRadius: 10,
                fontSize: 30,
                height: 70,
                padding: 8,
                backgroundColor: '#ffffff',
                color: 'black',
                marginLeft: 32,
                border: '2px solid rgba(221,19,67,0.5)',
                outline: 'none !important',
              }}
            />
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default memo(PasscodePage)
