import React from 'react';
import { useDispatch } from 'react-redux';
import { Row, Col, Avatar, Typography, Button } from 'antd';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { LOCAL_STORAGE_KEY, META_TITLE_PAGE } from 'app/consts';
import LocalStorageServices from 'app/utils/localStorage';
import RouterApp from 'app/routes/consts';
import history from 'app/routes/history';
import { loadingClose, loadingOpen } from 'app/redux/common/actions';
import { onIncognitoGetAccounts, onIncognitoGetPCustomeToken } from 'app/redux/incognito/actions';
import loadIncognito from 'app/services/incognito';
import Logo from 'assets/logo.png';

const OnboardingStyled = styled.div`
    .ant-avatar {
        margin-bottom: 2.5rem;
    }
`;

const Onboarding = () => {
    const dispatch = useDispatch();
    const { Title } = Typography;
    const onAccessWallet = async () => {
        dispatch(onIncognitoGetPCustomeToken());
        if (!LocalStorageServices.getItem(LOCAL_STORAGE_KEY.WALLET)) {
            history.push(RouterApp.rInitWallet);
        } else {
            dispatch(loadingOpen());
            await loadIncognito();
            dispatch(onIncognitoGetAccounts());
            dispatch(loadingClose());
        }
    };
    return (
        <OnboardingStyled>
            <Helmet>
                <title>{META_TITLE_PAGE.WELCOME}</title>
            </Helmet>
            <div className="wrap">
                <Row gutter={[30, 30]}>
                    <Col className="text-center" span={24}>
                        <Avatar size={150} icon={<img src={Logo} alt="WELCOME TO INCOGNITO WEB WALLET" />} />
                        <Title level={3}>WELCOME TO INCOGNITO WEB WALLET</Title>
                        <Button type="primary" className="btn" size="large" onClick={onAccessWallet}>
                            Get Started
                        </Button>
                    </Col>
                </Row>
            </div>
        </OnboardingStyled>
    );
};

export default Onboarding;
