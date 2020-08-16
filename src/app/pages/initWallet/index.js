import React, { memo, useEffect } from 'react'

import { Button, Col, Form, Input, Row, Typography } from 'antd'
import { LOCAL_STORAGE_KEY, META_TITLE_PAGE } from 'app/consts'
import { loadingClose, loadingOpen } from 'app/redux/common/actions'
import { onIncognitoGetAccounts } from 'app/redux/incognito/actions'
import RouterApp from 'app/routes/consts'
import history from 'app/routes/history'
import { createIncognito } from 'app/services/incognito'
import LocalStorageServices from 'app/utils/localStorage'
import { Helmet } from 'react-helmet'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

const InitWalletStyled = styled.div`
  .wrap {
    max-width: 46.375rem;
    padding-top: 3rem;
    .title {
      margin-bottom: 1.25rem;
    }
  }
`

const InitWallet = () => {
  const dispatch = useDispatch()
  const { Title, Paragraph } = Typography

  useEffect(() => {
    if (LocalStorageServices.getItem(LOCAL_STORAGE_KEY.WALLET)) {
      history.push(RouterApp.rOnboarding)
    }
  }, [])

  const onFinish = async (values) => {
    if (values) {
      const { walletName } = values
      dispatch(loadingOpen())
      await createIncognito(walletName)
      dispatch(onIncognitoGetAccounts())
      dispatch(loadingClose())
    }
  }

  return (
    <InitWalletStyled>
      <Helmet>
        <title>{META_TITLE_PAGE.INIT_WALLET}</title>
      </Helmet>
      <div className="wrap">
        <Row gutter={[30, 30]}>
          <Col className="text-center" offset={2} span={20}>
            <Title className="title" level={3}>
              Name your wallet
            </Title>
            <Paragraph>How do you want to call this privacy-first web wallet?</Paragraph>
            <Form name="import-keys" layout="vertical" onFinish={onFinish}>
              <Form.Item name="walletName" rules={[{ required: true, message: 'Please enter name wallet' }]}>
                <Input.TextArea autoSize={{ minRows: 5, maxRows: 10 }} spellCheck="false" />
              </Form.Item>
              <Button type="primary" size="large" htmlType="submit">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </div>
    </InitWalletStyled>
  )
}

export default memo(InitWallet)
