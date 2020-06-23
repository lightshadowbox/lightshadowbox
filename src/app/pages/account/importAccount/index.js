import { Button, Col, Form, Input, Row, Typography } from 'antd';
import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';

const ImportAccountStyled = styled.div`
    .wrap {
        padding-top: 64px;
        .title {
            margin-bottom: 20px;
        }
    }
`;

const ImportAccount = () => {
    const { Title } = Typography;

    const onFinish = (values) => {
        console.log('Success:', values);
    };

    return (
        <ImportAccountStyled>
            <Helmet>
                <title>Import account from private keys</title>
            </Helmet>
            <div className="wrap">
                <Row gutter={[30, 30]}>
                    <Col className="text-center" offset={6} span={12}>
                        <Title className="title" level={3}>
                            Import account from private key
                        </Title>
                        <Form name="import-keys" layout="vertical" onFinish={onFinish}>
                            <Form.Item name="key" rules={[{ required: true, message: 'Please enter you account’s private key' }]}>
                                <Input.TextArea autoSize={{ minRows: 8, maxRows: 10 }} />
                            </Form.Item>
                            <Button type="primary" size="large" htmlType="submit">
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
