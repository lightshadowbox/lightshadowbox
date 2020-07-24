import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import styled from 'styled-components';

const PrivateLayoutStyled = styled.div`
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
    background-color: #fafafa;
    main {
        box-sizing: border-box;
        margin: 0;
        min-width: 0;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        overflow-y: auto;
        overflow-x: hidden;
        -webkit-flex: 1;
        -ms-flex: 1;
        flex: 1;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
    }
    .wrap {
        width: 85vw;
    }
`;

const PrivateLayout = ({ children }) => {
    const { Content } = Layout;
    return (
        <PrivateLayoutStyled>
            <Content>{children}</Content>
        </PrivateLayoutStyled>
    );
};

PrivateLayout.propTypes = {
    children: PropTypes.node,
};

export default PrivateLayout;
