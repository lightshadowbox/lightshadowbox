import React from 'react'

import { Layout } from 'antd'
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
`

const PublicLayout = ({ children }) => {
  const { Content } = Layout
  return (
    <PublicLayoutStyled>
      <Content>{children}</Content>
    </PublicLayoutStyled>
  )
}

PublicLayout.propTypes = {
  children: PropTypes.node,
}

export default PublicLayout
