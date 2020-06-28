import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Spin } from 'antd';
import { makeSelectLoadingAction } from 'app/redux/common/selectors';

const LoadingActionStyled = styled.div`
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

const LoadingAction = () => {
    const isLoading = useSelector(makeSelectLoadingAction());
    if (!isLoading) {
        return null;
    }
    return (
        <LoadingActionStyled>
            <div className="full-screen-loading">
                <Spin />
            </div>
        </LoadingActionStyled>
    );
};

export default memo(LoadingAction);
