import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { Helmet } from 'react-helmet';
import { Button, Col, Avatar, Row, Layout, Menu, Typography, Tooltip, Dropdown } from 'antd';
import { CopyOutlined, CaretDownOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { makeSelectMasterAccount } from 'app/redux/incognito/selector';
import Logo from 'assets/logo.png';

const AccountDetailStyled = styled.div`
    .wrap {
        max-width: 1110px;
        padding-top: 3rem;
        .account-sidebar {
            padding-top: 2.5rem;
        }
        .ant-layout {
            height: 82vh;
            .ant-layout-header {
                padding: 0 2rem;
                .btn-send {
                    margin-right: 1.5rem;
                }
            }
            .address {
                width: 200px;
                white-space: nowrap;
                padding: 0.1rem 1.7rem 0.1rem 0.65rem;
                margin-bottom: 1.4rem;
                > span {
                    white-space: nowrap;
                    overflow: hidden;
                    vertical-align: middle;
                    &.ellipsis {
                        display: inline-block;
                        width: calc(50% + 1.2rem);
                        text-overflow: ellipsis;
                    }

                    &.indent {
                        display: inline-flex;
                        width: calc(50% - 1.2rem);
                        justify-content: flex-end;
                    }
                }
            }
            .wallet-balance {
                height: auto;
                padding-top: 0.875rem;
                padding-bottom: 0.875rem;
                &:hover {
                    &:not(.title) {
                        background-color: #e6f7ff;
                    }
                }
                &.active {
                    background-color: #93949d;
                    .title-amount,
                    .title-value {
                        color: #fff;
                    }
                }
                > .inner {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    .content {
                        margin-left: 1rem;
                        min-width: 0;
                        display: flex;
                        flex-direction: column;
                        .title-value {
                            line-height: 1.4;
                        }
                    }
                }
            }
        }
    }
`;

const AccountDetail = () => {
    const masterAccount = useSelector(makeSelectMasterAccount());
    const { Header, Content, Sider } = Layout;
    const { Title, Text } = Typography;
    const [accountList, setAccountList] = useState(null);

    useEffect(() => {
        if (masterAccount) {
            const accounts = masterAccount.getAccounts();
            setAccountList(accounts);
        }
    }, [masterAccount]);

    const onHandleAccoutSelected = (event, account) => {
        console.log(account);
        event.preventDefault();
    };

    return (
        <AccountDetailStyled>
            <Helmet>
                <title>Import account from private keys</title>
            </Helmet>
            <div className="wrap">
                <Layout>
                    <Sider className="account-sidebar bg-white" width={300}>
                        <Row>
                            <Col span={24} className="text-center">
                                <Avatar size={70} icon={<img src={Logo} alt="WELCOME TO INCOGNITO WEB WALLET" />} />
                                <Dropdown
                                    overlay={
                                        <Menu>
                                            {!isEmpty(accountList) &&
                                                accountList.map((ac, idx) => (
                                                    <Menu.Item key={idx} onClick={(event) => onHandleAccoutSelected(event, ac)}>
                                                        <span>{ac?.name}</span>
                                                    </Menu.Item>
                                                ))}
                                        </Menu>
                                    }
                                    trigger={['click']}>
                                    <Title className="title pointer" level={3}>
                                        Account 1 <CaretDownOutlined />
                                    </Title>
                                </Dropdown>

                                <Tooltip placement="bottom" title="Copy to clipboard" arrowPointAtCenter>
                                    <Button className="address">
                                        <span className="ellipsis">0xEF544D54b4C533dfb1e606d96dcc7F641FFA9Af7</span>
                                        <span className="indent">0xEF544D54b4C533dfb1e606d96dcc7F641FFA9Af7</span>
                                        <CopyOutlined />
                                    </Button>
                                </Tooltip>
                            </Col>
                        </Row>
                        <Menu mode="inline" defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']}>
                            <Menu.Item key="1" className="wallet-balance active">
                                <div className="inner">
                                    <Avatar size={50} icon={<img src={Logo} alt="WELCOME TO INCOGNITO WEB WALLET" />} />
                                    <div className="content">
                                        <Title className="title-amount no-margin" level={4}>
                                            0 ETH
                                        </Title>
                                        <Text className="title-value no-margin">$0.00 USD</Text>
                                    </div>
                                </div>
                            </Menu.Item>
                            <Menu.Item key="2" className="wallet-balance">
                                <div className="inner">
                                    <Avatar size={50} icon={<img src={Logo} alt="WELCOME TO INCOGNITO WEB WALLET" />} />
                                    <div className="content">
                                        <Title className="title-amount no-margin" level={4}>
                                            0 ETH
                                        </Title>
                                        <Text className="title-value no-margin">$0.00 USD</Text>
                                    </div>
                                </div>
                            </Menu.Item>
                            <Menu.Item key="53" className="wallet-balance">
                                <div className="inner">
                                    <Avatar size={50} icon={<img src={Logo} alt="WELCOME TO INCOGNITO WEB WALLET" />} />
                                    <div className="content">
                                        <Title className="title-amount no-margin" level={4}>
                                            0 ETH
                                        </Title>
                                        <Text className="title-value no-margin">$0.00 USD</Text>
                                    </div>
                                </div>
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Content>
                        <Header className="header">
                            <Row>
                                <Col span={12} className="text-left">
                                    <div className="wallet-balance title">
                                        <div className="inner">
                                            <Avatar size={50} icon={<img src={Logo} alt="WELCOME TO INCOGNITO WEB WALLET" />} />
                                            <div className="content">
                                                <Title className="title-amount no-margin" level={4}>
                                                    0 ETH
                                                </Title>
                                                <Text className="title-value no-margin">$0.00 USD</Text>
                                            </div>
                                        </div>
                                    </div>
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
