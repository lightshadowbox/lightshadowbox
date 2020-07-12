import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Col, Form, Input, Row, Typography } from 'antd';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { LOCAL_STORAGE_KEY, META_TITLE_PAGE } from 'app/consts';
import RouterApp from 'app/routes/consts';
import history from 'app/routes/history';
import LocalStorageServices from 'app/utils/localStorage';
import loadIncognito from 'app/services/incognito';
import { loadingClose, loadingOpen } from 'app/redux/common/actions';
import { onIncognitoGetAccounts } from 'app/redux/incognito/actions';

const InitWalletStyled = styled.div`
    .wrap {
        max-width: 742px;
        padding-top: 3rem;
        .title {
            margin-bottom: 20px;
        }
    }
`;

const InitWallet = () => {
    const dispatch = useDispatch();
    const { Title, Paragraph } = Typography;

    const onFinish = async (values) => {
        if (values) {
            const { walletName } = values;
            dispatch(loadingOpen());
            await loadIncognito(walletName);
            dispatch(onIncognitoGetAccounts());
            dispatch(loadingClose());
        }
    };

    useEffect(() => {
        if (LocalStorageServices.getItem(LOCAL_STORAGE_KEY.WALLET)) {
            history.push(RouterApp.rOnboarding);
        }
    }, []);

    return (
        <InitWalletStyled>
            <Helmet>
                <title>{META_TITLE_PAGE.INIT_WALLET}</title>
            </Helmet>
            <div className="wrap">
                <Row gutter={[30, 30]}>
                    <Col className="text-center" offset={2} span={20}>
                        <Title className="title" level={3}>
                            Name your wallet
                        </Title>
                        <Paragraph>How do you want to call this privacy-first web wallet?</Paragraph>
                        <Form name="import-keys" layout="vertical" onFinish={onFinish}>
                            <Form.Item name="walletName" rules={[{ required: true, message: 'Please enter name wallet' }]}>
                                <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} spellCheck="false" />
                            </Form.Item>
                            <Button type="primary" size="large" htmlType="submit">
                                Submit
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </div>
        </InitWalletStyled>
    );
};

export default InitWallet;
