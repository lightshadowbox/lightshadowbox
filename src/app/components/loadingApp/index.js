import React, { memo } from 'react'

import { MSG } from 'app/consts'
import { makeSelectLoading } from 'app/redux/common/selectors'
import loadingBoxGif from 'assets/logo.gif'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

const LoadingAppStyled = styled.div`
  .full-screen-loading {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;

    .loading-tip {
      .ant-spin-text {
        color: #333333;
        font-size: 2rem;
      }
    }
  }
`

const GifContainerStyled = styled.div`
  text-align: center;
  img {
    max-width: 200px;
  }
  p {
    font-size: 32px;
  }
`

const LoadingApp = () => {
  const isLoading = useSelector(makeSelectLoading())
  if (!isLoading) {
    return null
  }
  return (
    <LoadingAppStyled>
      <div className="full-screen-loading">
        <GifContainerStyled>
          <img src={loadingBoxGif} alt="Loading" />
          <p>{MSG.LOADING}</p>
        </GifContainerStyled>
      </div>
    </LoadingAppStyled>
  )
}

export default memo(LoadingApp)
