import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useImmer } from 'use-immer';
import { CaretDownOutlined, CopyOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Dropdown, Layout, Menu, Row, Tooltip, Typography } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import history from 'app/routes/history';
import RouterApp from 'app/routes/consts';
import { makeSelectAccounts } from 'app/redux/incognito/selector';
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
    // const [accountList, setAccountList] = useState(null);
    const [accountSelected, setAccountSelected] = useState(null);
    const [accountDetailSelected, setAccountDetailSelected] = useState(null);
    const [accountDetailState, setAccountDetailState] = useImmer({
        name: '',
        paymentAddress: '',
        totalBalance: null,
        avaiableBalance: null,
    });

    const onHandleAccoutSelected = (account) => {
        if (account) {
            setAccountSelected(account);
            setAccountDetailSelected(account?.nativeToken?.accountKeySet);
        }
    };

    useEffect(() => {
        if (!isEmpty(masterAccount)) {
            setAccountSelected(masterAccount[0]);
        }
    }, [masterAccount]);

    return (
        <AccountDetailStyled>
            <Helmet>
                <title>Import account from private keys</title>
            </Helmet>
            <div className="wrap">
                <Layout>
                    <Sider className="account-sidebar bg-white" width={300}>
                        <span onClick={() => history.push(`${RouterApp.rAccount}${RouterApp.rImport}`)}>Import </span>
                        <Row>
                            <Col span={24} className="text-center">
                                <Avatar size={70} icon={<img src={Logo} alt="WELCOME TO INCOGNITO WEB WALLET" />} />
                                <Dropdown
                                    overlay={
                                        <Menu>
                                            {!isEmpty(masterAccount) &&
                                                masterAccount.map((ac, idx) => (
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
                                <CopyToClipboard text={accountSelected?.paymentAddressKeySerialized}>
                                    <Tooltip placement="bottom" title="Copy to clipboard" arrowPointAtCenter>
                                        <Button className="address">
                                            <span className="ellipsis">{accountSelected?.paymentAddressKeySerialized}</span>
                                            <span className="indent">{accountSelected?.paymentAddressKeySerialized}</span>
                                            <CopyOutlined />
                                        </Button>
                                    </Tooltip>
                                </CopyToClipboard>
                            </Col>
                        </Row>
                        <Menu mode="inline" defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']}>
                            {!isEmpty(masterAccount) &&
                                masterAccount.map((ac, idx) => (
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
