import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Spin } from 'antd';
import { MSG } from 'app/consts';
import { makeSelectLoading } from 'app/redux/common/selectors';

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
`;

const LoadingApp = () => {
    const isLoading = useSelector(makeSelectLoading());
    if (!isLoading) {
        return null;
    }
    return (
        <LoadingAppStyled>
            <div className="full-screen-loading">
                <Spin className="loading-tip" tip={MSG.LOADING} />
            </div>
        </LoadingAppStyled>
    );
};

export default memo(LoadingApp);
