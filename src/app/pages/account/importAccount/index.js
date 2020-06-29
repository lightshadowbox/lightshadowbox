import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, Typography } from 'antd';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { onIncognitoCreateWallet } from 'app/redux/incognito/actions';

const ImportAccountStyled = styled.div`
    .wrap {
        max-width: 742px;
        padding-top: 3rem;
        .title {
            margin-bottom: 20px;
        }
    }
`;

const ImportAccount = () => {
    const dispatch = useDispatch();
    const { Title } = Typography;
    const [loading, setLoading] = useState(false);

    const onFinish = (values) => {
        if (values) {
            const { encryptedWallet } = values;
            setLoading(true);
            dispatch(onIncognitoCreateWallet(encryptedWallet));
        }
    };

    return (
        <ImportAccountStyled>
            <Helmet>
                <title>Import account from private keys</title>
            </Helmet>
            <div className="wrap">
                <Row gutter={[30, 30]}>
                    <Col className="text-center" offset={2} span={20}>
                        <Title className="title" level={3}>
                            Import account from private key
                        </Title>
                        <Form name="import-keys" layout="vertical" onFinish={onFinish}>
                            <Form.Item
                                name="encryptedWallet"
                                rules={[{ required: true, message: 'Please enter you account’s private key' }]}>
                                <Input.TextArea autoSize={{ minRows: 8, maxRows: 10 }} spellCheck="false" />
                            </Form.Item>
                            <Button type="primary" size="large" htmlType="submit" loading={loading}>
                                Submit
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </div>
        </ImportAccountStyled>
    );
};

export default ImportAccount;
