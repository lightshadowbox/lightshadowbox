import { CaretDownOutlined, CopyOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Dropdown, Layout, Menu, Row, Tooltip, Typography } from 'antd';
import { makeSelectAccounts } from 'app/redux/incognito/selector';
import Logo from 'assets/logo.png';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useImmer } from 'use-immer';

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
                        margin-left: 0.875rem;
                        min-width: 0;
                        display: flex;
                        flex-direction: column;
                    }
                }
            }
        }
    }
`;

const AccountDetail = () => {
    const masterAccount = useSelector(makeSelectAccounts());
    const { Header, Content, Sider } = Layout;
    const { Title, Text } = Typography;
    const [accountList, setAccountList] = useState(null);
    const [accountSelected, setAccountSelected] = useState(null);
    const [accountDetailSelected, setAccountDetailSelected] = useState(null);
    const [accountDetailState, setAccountDetailState] = useImmer({
        name: '',
        paymentAddress: '',
        totalBalance: null,
        avaiableBalance: null,
    });

    useEffect(() => {
        // const loadWebAssembly = async () => {
        //     if (masterAccount) {
        //         const accounts = masterAccount.getAccounts();
        //         // const totalBalance = await accounts[0].nativeToken.getTotalBalance();
        //         // const avBalance = await accounts[0].nativeToken.getAvaiableBalance();
        //         // console.log('Native token total balance', totalBalance.toNumber());
        //         // console.log('Native token available balance', avBalance.toNumber());
        //         setAccountSelected(accounts[0]);
        //         setAccountList(accounts);
        //     }
        // };
        // loadWebAssembly();
        // return () => {
        //     setAccountSelected(null);
        //     setAccountList(null);
        // };
    }, [masterAccount]);

    const onHandleAccoutSelected = (account) => {
        if (account) {
            setAccountSelected(account);
            setAccountDetailSelected(account?.nativeToken?.accountKeySet);
        }
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
                                                    <Menu.Item key={idx} onClick={() => onHandleAccoutSelected(ac)}>
                                                        <span>{ac?.name}</span>
                                                    </Menu.Item>
                                                ))}
                                        </Menu>
                                    }
                                    trigger={['click']}>
                                    <Title className="title pointer" level={3}>
                                        {accountSelected?.name} <CaretDownOutlined />
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
                            {!isEmpty(accountList) &&
                                accountList.map((ac, idx) => (
                                    <Menu.Item key={idx} className="wallet-balance">
                                        <div className="inner">
                                            <Avatar size={40} icon={<img src={Logo} alt="WELCOME TO INCOGNITO WEB WALLET" />} />
                                            <div className="content">
                                                {ac ? (
                                                    <>
                                                        <h4 className="title-amount line-height">{ac?.nativeToken?.name}</h4>
                                                        <Text className="title-value no-margin line-height">{ac?.nativeToken?.symbol}</Text>
                                                    </>
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                        </div>
                                    </Menu.Item>
                                ))}
                        </Menu>
                    </Sider>
                    <Content>
                        <Header className="header">
                            <Row>
                                <Col span={12} className="text-left">
                                    <div className="wallet-balance title">
                                        <div className="inner">
                                            <Avatar size={40} icon={<img src={Logo} alt="WELCOME TO INCOGNITO WEB WALLET" />} />
                                            <div className="content">
                                                {accountSelected ? (
                                                    <>
                                                        <h4 className="title-amount line-height">{accountSelected?.nativeToken?.name}</h4>
                                                        <Text className="title-value no-margin line-height">
                                                            {accountSelected?.nativeToken?.symbol}
                                                        </Text>
                                                    </>
                                                ) : (
                                                    <></>
                                                )}
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
