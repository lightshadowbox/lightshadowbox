import React, { memo } from 'react'

import { Button, Col, Form, Input, message, Row, Steps, Typography } from 'antd'
import { META_TITLE_PAGE } from 'app/consts'
import { loadingClose, loadingOpen } from 'app/redux/common/actions'
import { onIncognitoGetAccounts, onIncognitoGetPCustomeToken } from 'app/redux/incognito/actions'
import RouterApp from 'app/routes/consts'
import { updateWallet } from 'app/services/incognito'
import loadWASM from 'app/services/wasm'
import Logo from 'assets/logo.gif'
import { Config } from 'configs'
import { WalletInstance } from 'incognito-js'
import { isEmpty } from 'lodash'
import querystring from 'query-string'
import ReactCodeInput from 'react-code-input'
import { Helmet } from 'react-helmet'
import { useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router'
import styled from 'styled-components'

const { Title, Paragraph } = Typography
const { Step } = Steps
const InitWalletStyled = styled.div`
  .wrap {
    max-width: 46.375rem;
    padding-top: 3rem;
    .title {
      margin-bottom: 1.25rem;
    }
  }
`
const InputStyled = styled(Input)`
  &&& {
    padding: 8px 12px;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    width: 350px;
    border-radius: 10px;
  }
`

const StepStyled = styled(Steps)`
  padding: 64px 8px;
`

const WalletNameStep = ({ nextStep, value, update }) => {
  const onFinish = ({ walletName }) => {
    update(walletName)
    nextStep()
  }
  return (
    <Form layout="vertical" onFinish={onFinish} initialValues={{ walletName: value }}>
      <Title className="title" level={3}>
        Migrate Your Wallet From incwallet.app
      </Title>
      <Paragraph>Your wallet name is here. You can change your name now!</Paragraph>
      <Form.Item name="walletName" rules={[{ required: true, message: 'Please enter name wallet' }]}>
        <InputStyled spellCheck="false" value={value} />
      </Form.Item>
      <Button type="primary" size="large" htmlType="submit">
        Next
      </Button>
    </Form>
  )
}

const PasscodeStyled = styled(ReactCodeInput)`
  input:focus {
    outline: none !important;
    border-color: #719ece;
    box-shadow: 0 0 10px #719ece;
  }
`

const PasscodeComponent = ({ value, onChange, isInvalid }) => {
  return (
    <PasscodeStyled
      type="password"
      fields={4}
      onChange={onChange}
      value={value}
      isValid={!isInvalid}
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
        margin: 16,
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
        margin: 16,
        border: '2px solid rgba(221,19,67,0.5)',
        outline: 'none !important',
      }}
    />
  )
}
const PasscodeStep = ({ nextStep, update }) => {
  const [pass1, setPass1] = React.useState('')
  const [isInValid, setIsInValid] = React.useState(false)
  const [pass2, setPass2] = React.useState('')
  const [isConfirming, setIsConfirming] = React.useState(false)

  const reset = () => {
    setPass1('')
    setPass2('')
    setIsConfirming(false)
    setIsInValid(false)
  }

  React.useMemo(async () => {
    if (isConfirming && pass2.length >= 4) {
      if (pass1 !== pass2) {
        setIsInValid(true)
        return
      }
      update(pass1)

      nextStep()
      return
    }
    if (pass1.length >= 4) {
      setIsConfirming(true)
    }
  }, [pass1, pass2, isConfirming, nextStep, update])

  return (
    <div>
      {!isConfirming ? (
        <div>
          <Title className="title" level={3}>
            Set up wallet passcode
          </Title>
          <Paragraph>More secure to your wallet by providing passcode</Paragraph>
          <PasscodeComponent key={1} value={pass1} onChange={setPass1} isInValid={false} />
          <SoluganTextStyled>Enter a 4 digit number you want to use as your passcode.</SoluganTextStyled>
        </div>
      ) : (
        <div>
          <Title className="title" level={3}>
            Re-confirm your passcode
          </Title>
          <Paragraph>Enter again your passcode</Paragraph>
          <PasscodeComponent key={2} value={pass2} onChange={setPass2} isInvalid={isInValid} />
          <SoluganTextStyled>Enter a 4 digit number you want to use as your passcode.</SoluganTextStyled>
          <br />
          {isInValid && (
            <Button type="ghost" onClick={reset}>
              {' '}
              Not Match - Reset
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

const LogoImage = styled.img`
  max-width: 120px;
`
const SoluganTextStyled = styled.p`
  margin-top: 12px;
  font-size: 10px;
`
const MigrateFinishStep = ({ value }) => {
  const dispatch = useDispatch()
  const onFinish = async () => {
    if (value) {
      const { wallet } = value
      const { walletName, passcode } = value

      if (isEmpty(passcode) || isEmpty(walletName)) {
        message.error('Please complete step 1 and step 2 before.')
        return
      }
      dispatch(onIncognitoGetPCustomeToken())
      dispatch(loadingOpen())
      await updateWallet(wallet, walletName, passcode)
      dispatch(onIncognitoGetAccounts())
      dispatch(loadingClose())
    }
  }

  return (
    <Row gutter={[30, 30]}>
      <Col className="text-center" span={24}>
        <LogoImage src={Logo} alt="LIGHT SHADOW BOX" />
        <Typography.Title level={4}>Hello {value.walletName}!</Typography.Title>
        <br />
        <Button type="primary" size="large" onClick={onFinish}>
          Click Here To Start
        </Button>
      </Col>
    </Row>
  )
}

const MigrateWallet = () => {
  const { search } = useLocation()
  const query = querystring.parse(search)
  const history = useHistory()

  if (!query.token) {
    history.push(RouterApp.rInitWallet)
  }

  const [wallet, setWallet] = React.useState(null)
  const [isLoading, setIsLoadingWallet] = React.useState(true)
  const [error, setError] = React.useState(null)

  React.useLayoutEffect(() => {
    const restoreWallet = async () => {
      try {
        await loadWASM()
        console.log('restore wallet:', query.token)
        const decode = window.atob(query.token)
        const tempWallet = await WalletInstance.restore(decode, Config.WALLET_PASS)
        setWallet(tempWallet)
        setIsLoadingWallet(false)
        console.log(tempWallet.name)
      } catch (err) {
        console.log(err)
        setError(err)
      }
    }
    restoreWallet()
  }, [query.token])

  if (isLoading) {
    return (
      <InitWalletStyled>
        <Helmet>
          <title>{META_TITLE_PAGE.INIT_WALLET}</title>
        </Helmet>
        <div className="wrap">
          <Row gutter={[30, 30]}>
            <Col className="text-center" offset={2} span={20}>
              <Row gutter={[30, 30]}>
                <Col className="text-center" span={24}>
                  <LogoImage src={Logo} alt="LIGHT SHADOW BOX" />
                  <Paragraph>We are processing... please wait!</Paragraph>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </InitWalletStyled>
    )
  }

  if (error) {
    return (
      <InitWalletStyled>
        <Helmet>
          <title>{META_TITLE_PAGE.INIT_WALLET}</title>
        </Helmet>
        <div className="wrap">
          <Row gutter={[30, 30]}>
            <Col className="text-center" offset={2} span={20}>
              <Row gutter={[30, 30]}>
                <Col className="text-center" span={24}>
                  <LogoImage src={Logo} alt="LIGHT SHADOW BOX" />
                  <Paragraph>ERROR! Something wrong, please try again!</Paragraph>
                  <Paragraph>{error}</Paragraph>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </InitWalletStyled>
    )
  }

  return (
    <InitWalletStyled>
      <Helmet>
        <title>{META_TITLE_PAGE.INIT_WALLET}</title>
      </Helmet>
      <div className="wrap">
        <Row gutter={[30, 30]}>
          <Col className="text-center" offset={2} span={20}>
            <MigrateStep wallet={wallet} />
          </Col>
        </Row>
      </div>
    </InitWalletStyled>
  )
}

const MigrateStep = ({ wallet }) => {
  const [step, setStep] = React.useState(0)
  const [walletName, setWalletName] = React.useState(wallet.name)
  const [passcode, setPasscode] = React.useState('')

  const nextStep = (newStep) => {
    if (newStep >= 2) {
      if (isEmpty(passcode) || isEmpty(walletName)) {
        return
      }
    }
    setStep(newStep)
  }

  const stepContents = [
    <WalletNameStep key={0} nextStep={() => nextStep(1)} value={walletName} update={setWalletName} />,
    <PasscodeStep key={1} nextStep={() => nextStep(2)} value={passcode} update={setPasscode} />,
    <MigrateFinishStep key={2} value={{ walletName, passcode, wallet }} />,
  ]
  return (
    <>
      <StepStyled size="small" current={step} onChange={nextStep}>
        <Step title="Start Migrate" />
        <Step title="Secure Your Wallet" />
        <Step title="Finished" />
      </StepStyled>
      {stepContents[step]}
    </>
  )
}

export default memo(MigrateWallet)
