import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Spin } from 'antd';
import makeSelectLoading from './selector';

const LoadingAppStyled = styled.div`
    .full-screen-loading {
        position: fixed;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;

        .ant-spin-text {
            color: white;
        }

        .ant-spin-dot-item {
            background: white;
        }
    }
`;

const LoadingApp = () => {
    const isLoading = useSelector(makeSelectLoading());
    if (!isLoading) {
        return null;
    }
    return (
        <LoadingAppStyled>
            <div className="full-screen-loading">
                <Spin tip="Loading..." />
            </div>
        </LoadingAppStyled>
    );
};

export default memo(LoadingApp);
