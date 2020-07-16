import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useInjectReducer } from 'redux-injectors';
import { isEmpty } from 'lodash';
import { CaretDownOutlined, CopyOutlined, SettingFilled } from '@ant-design/icons';
import { Avatar, Button, Col, Dropdown, Layout, Menu, Row, Tooltip, Typography } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { loadingClose, loadingOpen, loadingOpenAction, loadingCloseAction } from 'app/redux/common/actions';
import { makeSelectAccounts, makeSelectPCustomeTokens, makeSelectPrivacyTokens } from 'app/redux/incognito/selector';
import loadIncognito, { masterAccount as MasterAccount } from 'app/services/incognito';
import accountReducer, { KEY_REDUCER_SAGA, onSetCreateAccountState, onSetImportAccountState } from 'app/pages/account/redux/slice';
import { onIncognitoGetAccounts, onIncognitoPrivacyTokens } from 'app/redux/incognito/actions';
import { CreateAccount, ImportAccount } from 'app/pages/account/components';
import Logo from 'assets/logo.png';

const PrivacyToken = lazy(() => import('app/pages/account/components/privacyToken'));
// const privacyTokenIds = [
//     'f11a19ccd45858900f42ee264985526b4aa40c3f5e28d67a4409d8a5ea8908cb',
//     'cb401a57a9c4a54b13df630513470203fcf8416e218cfe25151a896fde59160b',
//     '6813af655262c8eecb6d58e78311da509607342533f7a710968fab67ff7d63a5',
// ];

const AccountDetailStyled = styled.div`
    .wrap {
        max-width: 1110px;
        padding-top: 3rem;
        .account-sidebar {
            padding-top: 2.5rem;
        }
        .ant-layout {
            height: 100vh;
            padding-bottom: 2rem;
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
                    justify-content: space-between;
                    .content {
                        margin-left: 0.875rem;
                        min-width: 0;
                        display: flex;
                        flex-direction: column;
                        flex: 1;
                    }
                }
            }
        }
    }
`;

const AccountDetail = () => {
    useInjectReducer({ key: KEY_REDUCER_SAGA, reducer: accountReducer });
    const dispatch = useDispatch();
    const masterAccount = useSelector(makeSelectAccounts());
    const pCustomeTokens = useSelector(makeSelectPCustomeTokens());
    const privacyTokens = useSelector(makeSelectPrivacyTokens());
    const { Header, Content, Sider } = Layout;
    const { Title, Text } = Typography;
    const [accountSelected, setAccountSelected] = useState(null);

    const onHandleAccoutSelected = async (account) => {
        if (account) {
            const { nativeToken, name } = account;
            console.log(account);
            dispatch(loadingOpenAction());
            const balanceBN = await MasterAccount.getAvaialbleBalanceCoin(name);
            // if (nativeToken && nativeToken?.tokenId) {
            //     const followingTokens = await MasterAccount.followTokenById(
            //         name,
            //         'f4c14af6e8bd471df5c126590b1572f6cf89d9ae5146afbedf66a79ac5cc2196',
            //     );
            //     console.log(followingTokens);
            // }
            const followingTokens = await MasterAccount.getFollowingPrivacyToken(
                name,
                'f11a19ccd45858900f42ee264985526b4aa40c3f5e28d67a4409d8a5ea8908cb',
            );
            console.log(followingTokens);
            setAccountSelected({ ...account, balanceBN: balanceBN.toNumber() });
            dispatch(loadingCloseAction());
        }
    };

    const onGetStatusAction = async (backupWalletString) => {
        if (backupWalletString) {
            dispatch(loadingOpen());
            await loadIncognito();
            dispatch(onIncognitoGetAccounts());
            dispatch(loadingClose());
        }
    };

    const onOpenCreateAccountModal = () => {
        dispatch(onSetCreateAccountState(true));
    };

    const onOpenImportAccountModal = () => {
        dispatch(onSetImportAccountState(true));
    };

    const onGetPrivacyTokens = useCallback(
        (tokenIds) => {
            const tokenDetails = [];
            if (!isEmpty(pCustomeTokens)) {
                tokenIds.forEach((token) => {
                    const hasIndex = pCustomeTokens.findIndex((item) => item.TokenID === token);
                    if (hasIndex !== -1) {
                        tokenDetails.push(pCustomeTokens[hasIndex]);
                    }
                });
            }
            dispatch(onIncognitoPrivacyTokens(tokenDetails));
        },
        [dispatch, pCustomeTokens],
    );

    useEffect(() => {
        if (!isEmpty(masterAccount) && MasterAccount) {
            const data = [];
            masterAccount.forEach(async (ma) => {
                data.push({
                    ...ma,
                });
            });
            const ac = masterAccount[0];
            setAccountSelected(ac);
            ac.privacyTokenIds && onGetPrivacyTokens(ac.privacyTokenIds);
        }
    }, [masterAccount, onGetPrivacyTokens]);

    console.log(privacyTokens);

    return (
        <AccountDetailStyled>
            <Helmet>
                <title>Import account from private keys</title>
            </Helmet>
            <div className="wrap">
                <Layout>
                    <Sider className="account-sidebar bg-white" width={400}>
                        <Dropdown
                            overlay={
                                <Menu>
                                    <Menu.Item onClick={onOpenCreateAccountModal}>
                                        <span>Create Account</span>
                                    </Menu.Item>
                                    <Menu.Item onClick={onOpenImportAccountModal}>
                                        <span>Import Account</span>
                                    </Menu.Item>
                                </Menu>
                            }
                            trigger={['click']}>
                            <Title className="title pointer" level={3}>
                                <SettingFilled />
                            </Title>
                        </Dropdown>
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
                            <Menu.Item key="prv" className="wallet-balance">
                                {accountSelected ? (
                                    <div className="inner">
                                        <Avatar size={40} icon={<img src={Logo} alt="WELCOME TO INCOGNITO WEB WALLET" />} />
                                        <div className="content">
                                            <h4 className="title-amount line-height">{accountSelected?.nativeToken?.name}</h4>
                                        </div>
                                        <div className="balance">
                                            <Text className="title-value no-margin line-height">
                                                {accountSelected?.balanceBN || 0} {accountSelected?.nativeToken?.symbol}
                                            </Text>
                                        </div>
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </Menu.Item>
                        </Menu>
                        <Suspense fallback={<h1>Still Loading…</h1>}>
                            <PrivacyToken data={privacyTokens} />
                        </Suspense>
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
                <CreateAccount onGetStatusCreated={onGetStatusAction} />
                <ImportAccount onGetStatusImported={onGetStatusAction} />
            </div>
        </AccountDetailStyled>
    );
};

export default AccountDetail;
