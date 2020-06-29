import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import { Helmet } from 'react-helmet';
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import history from 'app/routes/history';
import RouterApp from 'app/routes/consts';

const AccountStyled = styled.div`
    .wrap {
        max-width: 742px;
        padding-top: 3rem;
        .account-card {
            cursor: pointer;
            .anticon {
                font-size: 60px;
                margin-bottom: 12px;
            }
            &:before {
                content: '';
                padding-top: 60%;
                display: block;
            }
            > .ant-card-body {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
            }
        }
    }
`;

const Account = () => {
    const { Title, Paragraph } = Typography;

    return (
        <AccountStyled>
            <Helmet>
                <title>Account</title>
            </Helmet>
            <div className="wrap">
                <Row gutter={[30, 30]}>
                    <Col span={12}>
                        <Card
                            className="account-card text-center"
                            onClick={() => history.push(`${RouterApp.rAccount}${RouterApp.rImport}`)}>
                            <DownloadOutlined />
                            <Title className="no-margin" level={3}>
                                IMPORT ACCOUNT
                            </Title>
                            <Paragraph>Import account from private keys</Paragraph>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card className="account-card text-center">
                            <PlusOutlined />
                            <Title className="no-margin" level={3}>
                                CREATE NEW ACCOUNT
                            </Title>
                            <Paragraph>Create a brand new Incognito Wallet</Paragraph>
                        </Card>
                    </Col>
                </Row>
            </div>
        </AccountStyled>
    );
};

export default Account;
