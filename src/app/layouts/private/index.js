import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Typography } from 'antd';
import styled from 'styled-components';
import Logo from 'assets/logo.png';

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
    header {
        background: rgb(255, 255, 255);
        height: auto;
        padding-top: 10px;
        padding-bottom: 10px;
        .logo-box {
            align-items: center;
            display: flex;
            > img {
                margin-right: 14px;
            }
        }
    }
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
`;

const PrivateLayout = ({ children }) => {
    const { Header, Content } = Layout;
    const { Title } = Typography;
    return (
        <PrivateLayoutStyled>
            <Header>
                <div className="wrap">
                    <div className="logo-box">
                        <img src={Logo} alt="Incognito Web Wallet" width="50" height="50" />
                        <Title className="no-margin" level={3}>
                            Incognito Web Wallet
                        </Title>
                    </div>
                </div>
            </Header>
            <Content>{children}</Content>
        </PrivateLayoutStyled>
    );
};

PrivateLayout.propTypes = {
    children: PropTypes.node,
};

export default PrivateLayout;
