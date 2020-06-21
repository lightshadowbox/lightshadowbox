import React from 'react';
import { Row, Col, Avatar, Typography, Button } from 'antd';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import history from 'app/routes/history';
import RouterApp from 'app/routes/consts';
import LocalStorageServices from 'app/utils/localStorage';
import { LOCAL_STORAGE_KEY } from 'app/consts';
import Logo from 'assets/logo.png';

const OnboardingStyled = styled.div`
    .ant-avatar {
        margin-bottom: 40px;
    }
`;

const Onboarding = () => {
    const { Title } = Typography;

    return (
        <OnboardingStyled>
            <Helmet>
                <title>Welcome to Incognito Web Wallet</title>
            </Helmet>
            <div className="wrap">
                <Row gutter={[30, 30]}>
                    <Col className="text-center" span={24}>
                        <Avatar size={150} icon={<img src={Logo} alt="WELCOME TO INCOGNITO WEB WALLET" />} />
                        <Title level={3}>WELCOME TO INCOGNITO WEB WALLET</Title>
                        <Button
                            type="primary"
                            size="large"
                            onClick={() => {
                                LocalStorageServices.setItem(LOCAL_STORAGE_KEY.IS_DASHBOARD, true);
                                history.push(RouterApp.rAccount);
                            }}>
                            Get Started
                        </Button>
                    </Col>
                </Row>
            </div>
        </OnboardingStyled>
    );
};

export default Onboarding;
