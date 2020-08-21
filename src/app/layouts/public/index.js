import React from 'react'

import { Layout, PageHeader } from 'antd'
import logoPNG from 'assets/logo.png'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const PublicLayoutStyled = styled.div`
  box-sizing: border-box;
  margin: 0;
  min-width: 0;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  min-height: 100vh;
  color: #1e2026;
  background-color: #ffffff;
  > main {
    box-sizing: border-box;
    margin: 0;
    min-width: 0;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    overflow-y: auto;
    overflow-x: hidden;
    margin-top: 10%;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
  }
  .ant-page-header-heading-title {
    font-weight: lighter;
    color: transparent;
  }
  .ant-page-header-heading-sub-title {
    position: absolute;
    left: 78px;
    top: 55px;
    font-size: 12px;
  }
`

const PublicLayout = ({ children }) => {
  const { Content } = Layout
  return (
    <PublicLayoutStyled>
      <PageHeader
        title="."
        className="site-page-header"
        // extra={[
        //   <Button key="3">Operation</Button>,
        //   <Button key="2">Operation</Button>,
        //   <Button key="1" type="primary">
        //     Primary
        //   </Button>,
        // ]}
        avatar={{ src: logoPNG, size: 'large', shape: 'square', style: { width: 100 } }}>
        <Content>{children}</Content>
      </PageHeader>
    </PublicLayoutStyled>
  )
}

PublicLayout.propTypes = {
  children: PropTypes.node,
}

export default PublicLayout
