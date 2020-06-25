import { Button, Col, Avatar, Row, Layout, Menu, Typography } from 'antd';
import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import Logo from 'assets/logo.png';

const AccountDetailStyled = styled.div`
    .wrap {
        padding-top: 64px;
        .btn-send {
            margin-right: 20px;
        }
    }
`;

const AccountDetail = () => {
    const { Title } = Typography;
    const { Header, Content, Sider } = Layout;

    return (
        <AccountDetailStyled>
            <Helmet>
                <title>Import account from private keys</title>
            </Helmet>
            <div className="wrap">
                <Layout>
                    <Sider className="site-layout-background" width={300}>
                        <Row>
                            <Col span={24} className="text-center">
                                <Avatar size={70} icon={<img src={Logo} alt="WELCOME TO INCOGNITO WEB WALLET" />} />
                            </Col>
                        </Row>
                        <Menu mode="inline" defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']} style={{ height: '100%' }}>
                            <Menu.Item key="5">option5</Menu.Item>
                            <Menu.Item key="6">option6</Menu.Item>
                            <Menu.Item key="7">option7</Menu.Item>
                            <Menu.Item key="8">option8</Menu.Item>
                        </Menu>
                    </Sider>
                    <Content>
                        <Header className="header">
                            <Row>
                                <Col span={12} className="text-left">
                                    <Avatar size={50} icon={<img src={Logo} alt="WELCOME TO INCOGNITO WEB WALLET" />} />
                                </Col>
                                <Col span={12} className="text-right">
                                    <Button className="btn-send" type="primary" size="large" htmlType="button">
                                        Send
                                    </Button>
                                    <Button className="btn-receive" type="primary" size="large" htmlType="button">
                                        Receive
                                    </Button>
                                </Col>
                            </Row>
                        </Header>
                        content
                    </Content>
                </Layout>
            </div>
        </AccountDetailStyled>
    );
};

export default AccountDetail;
