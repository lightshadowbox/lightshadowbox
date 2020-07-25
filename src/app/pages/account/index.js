import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useInjectReducer } from 'redux-injectors';
import isEmpty from 'lodash/isEmpty';
import { CaretDownOutlined, CopyOutlined, PlusOutlined, DownloadOutlined, CheckOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Dropdown, Layout, Menu, Row, Tooltip, Typography, Spin } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { LOCAL_STORAGE_KEY } from 'app/consts';
import coin from 'app/consts/coin';
import { getBackgroundColor, getName } from 'app/utils';
import LocalStorageServices from 'app/utils/localStorage';
import { loadingClose, loadingOpen, loadingOpenAction, loadingCloseAction } from 'app/redux/common/actions';
import { makeSelectAccounts, makeSelectPrivacyTokens } from 'app/redux/incognito/selector';
import loadIncognito, { masterAccount as MasterAccount } from 'app/services/incognito';
import accountReducer, {
    KEY_REDUCER_SAGA,
    onSetCreateAccountState,
    onSetImportAccountState,
    onSetAddCointState,
} from 'app/pages/account/redux/slice';
import {
    onIncognitoGetAccounts,
    onIncognitoPrivacyTokens,
    onIncognitoAccountSelected,
    onIncognitoPrivacyTokenSelected,
} from 'app/redux/incognito/actions';
import { CreateAccount, ImportAccount, AddCoin } from 'app/pages/account/components';
import Logo from 'assets/logo.png';

const PrivacyToken = lazy(() => import('app/pages/account/components/privacyToken'));
const Transaction = lazy(() => import('app/pages/account/components/transaction'));

const AccountStyled = styled.div`
    height: 100%;
    flex: 1;
    padding-top: 2rem;
    .wrap-header {
        width: 85vw;
        margin: 0 auto;
        background: transparent;
        height: auto;
        padding-bottom: 1.5rem;
        .logo-box {
            align-items: center;
            display: flex;
            > img {
                margin-right: 0.875rem;
            }
        }
    }
    .spiner {
        padding: 2rem 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .wrap {
        width: 85vw;
        padding-top: 3rem;
        box-shadow: 0 0 0.438rem 0 rgba(0, 0, 0, 0.08);
        padding: 0;
        margin-bottom: 10vh;
        display: flex;
        flex: 1;
        min-height: 82vh;
        .account-sidebar {
            padding-top: 2.5rem;
            padding-bottom: 1.5rem;
        }
        .ant-layout {
            background: #fff;
            border-right: 0.063rem solid #f0f0f0;
            .ant-layout-header {
                padding: 1rem 2rem 0.5rem;
                line-height: inherit;
                height: auto;
                .btn-send {
                    margin-right: 1.5rem;
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
                        font-size: 1rem;
                    }
                }
            }
            .account-sidebar {
                border-right: 0.063rem solid #f0f0f0;
            }
        }
        .header {
            border-bottom: 0.063rem solid #f0f0f0;
        }
        .big-account {
            .ant-avatar-string {
                font-size: 2rem;
                font-weight: 600;
            }
        }
        .btn-add-coin {
            margin-top: 1.5rem;
        }
    }
`;

const Account = () => {
    useInjectReducer({ key: KEY_REDUCER_SAGA, reducer: accountReducer });
    const dispatch = useDispatch();
    const masterAccount = useSelector(makeSelectAccounts());
    const privacyTokens = useSelector(makeSelectPrivacyTokens());
    const { Content, Sider } = Layout;
    const { Title } = Typography;
    const [accountSelected, setAccountSelected] = useState(null);

    // const getBalanceByFollowTokens = async (followTokens, name) => {
    //     const balances = [];
    //     const tokens = [...followTokens, coin.PRV];
    //     tokens.forEach(async ({ tokenId }) => {
    //         let bl = 0;
    //         let av = 0;
    //         if (isEqual(tokenId, coin.PRV_ID)) {
    //             bl = await MasterAccount.getTotalBalanceCoin(name);
    //             av = await MasterAccount.getAvaialbleBalanceCoin(name);
    //         } else {
    //             bl = await MasterAccount.getTotalBalanceToken(name, tokenId);
    //             av = await MasterAccount.getAvaialbleBalanceToken(name, tokenId);
    //         }
    //         dispatch(updateTotalBalance({ tokenId, totalBalance }));
    //         dispatch(
    //             updateTotalBalance({
    //                 tokenId,
    //                 totalBalance: (bl.data && bl.data.toNumber()) || 0,
    //             }),
    //         );
    //         dispatch(
    //             updateAvailableBalance({
    //                 tokenId,
    //                 availableBalance: (av.data && av.data.toNumber()) || 0,
    //             }),
    //         );
    //     });
    //     console.log('End', balances);
    // };

    const fetchPrivacyTokens = useCallback(
        async (name) => {
            const ft = await MasterAccount.getFollowingPrivacyTokens(name);
            const followTokens =
                (ft &&
                    ft.map((token) => {
                        const { tokenId, name, symbol, bridgeInfo } = token;
                        return {
                            tokenId,
                            name,
                            symbol,
                            image: '',
                            pDecimals: bridgeInfo?.pDecimals || null,
                            isVerified: bridgeInfo?.verified || null,
                            totalBalance: null,
                            availableBalance: null,
                        };
                    })) ||
                [];
            dispatch(onIncognitoPrivacyTokens(followTokens));
            // getBalanceByFollowTokens(followTokens, name);
        },
        [dispatch],
    );

    useEffect(() => {
        if (!isEmpty(masterAccount) && LocalStorageServices.getItem(LOCAL_STORAGE_KEY.WALLET)) {
            const data = [];
            masterAccount.forEach(async (ma) => {
                data.push({
                    ...ma,
                });
            });
            const ac = masterAccount[0];
            setAccountSelected(ac);
            dispatch(onIncognitoAccountSelected(ac));
            dispatch(onIncognitoPrivacyTokenSelected(coin.PRV));
            fetchPrivacyTokens(ac?.name);
        }
    }, [masterAccount, fetchPrivacyTokens, dispatch]);

    const onHandleAccoutSelected = async (account) => {
        if (account) {
            const { name } = account;
            dispatch(loadingOpenAction());
            setAccountSelected(account);
            dispatch(onIncognitoAccountSelected(account));
            dispatch(onIncognitoPrivacyTokenSelected(coin.PRV));
            dispatch(loadingCloseAction());
            fetchPrivacyTokens(name);
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

    const onOpenAddCoinModal = () => {
        dispatch(onSetAddCointState(true));
    };

    const menu = (
        <Menu className="account-menu">
            <Menu.Item className="account-header">My Accounts</Menu.Item>
            <Menu.Divider />
            {!isEmpty(masterAccount) &&
                masterAccount.map((ac, idx) => (
                    <Menu.Item
                        key={idx}
                        onClick={() => onHandleAccoutSelected(ac)}
                        className={`account-item ${accountSelected?.name === ac?.name ? 'active' : 'inactive'}`}>
                        <span>
                            <CheckOutlined style={{ fontSize: '20px', color: 'rgba(0, 0, 0, 0.65)' }} className="account-icon" />
                            <Avatar
                                className="spacing-avatar identicon-avatar"
                                size={32}
                                style={{
                                    background: getBackgroundColor(ac?.privateKeySerialized),
                                }}
                                alt={ac?.name}>
                                {getName(ac?.name)}
                            </Avatar>
                            {ac?.name}
                        </span>
                    </Menu.Item>
                ))}
            <Menu.Divider />
            <Menu.Item className="account-item" onClick={onOpenCreateAccountModal}>
                <span>
                    <PlusOutlined style={{ fontSize: '24px', color: 'rgba(0, 0, 0, 0.65)' }} />
                    Create Account
                </span>
            </Menu.Item>
            <Menu.Item className="account-item" onClick={onOpenImportAccountModal}>
                <span>
                    <DownloadOutlined style={{ fontSize: '24px', color: 'rgba(0, 0, 0, 0.65)' }} />
                    Import Account
                </span>
            </Menu.Item>
        </Menu>
    );

    return (
        <AccountStyled>
            <Helmet>
                <title>Import account from private keys</title>
            </Helmet>
            <div className="wrap-header">
                <Row>
                    <Col span={12} className="text-left">
                        <div className="logo-box">
                            <img src={Logo} alt="Incognito Web Wallet" width="32" height="32" />
                            <Title className="no-margin" level={3}>
                                Incognito Web Wallet
                            </Title>
                        </div>
                    </Col>
                </Row>
            </div>
            <div className="wrap">
                <Layout className="full-width">
                    <Sider className="account-sidebar bg-white" width={400}>
                        <Row>
                            <Col span={24} className="text-center">
                                <Avatar
                                    size={70}
                                    style={{
                                        background: getBackgroundColor(accountSelected?.privateKeySerialized),
                                    }}
                                    className="big-account coin-avatar"
                                    alt={accountSelected?.name}>
                                    {getName(accountSelected?.name)}
                                </Avatar>
                                <Dropdown overlay={menu} trigger={['click']}>
                                    <Title className="title pointer" level={3}>
                                        {accountSelected?.name} <CaretDownOutlined />
                                    </Title>
                                </Dropdown>
                                <CopyToClipboard text={accountSelected?.paymentAddressKeySerialized}>
                                    <Tooltip placement="bottom" title="Copy to clipboard" arrowPointAtCenter>
                                        <Button className="address-clipboard">
                                            <span className="ellipsis">{accountSelected?.paymentAddressKeySerialized}</span>
                                            <span className="indent">{accountSelected?.paymentAddressKeySerialized}</span>
                                            <CopyOutlined />
                                        </Button>
                                    </Tooltip>
                                </CopyToClipboard>
                            </Col>
                        </Row>
                        {/* <Menu mode="inline" className="no-border" defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']}>
                            <Menu.Item key="prv" className="wallet-balance">
                                {accountSelected ? (
                                    <div className="inner">
                                        <Avatar size={40} icon={<img src={PRVIcon} alt="WELCOME TO INCOGNITO WEB WALLET" />} />
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
                        </Menu> */}
                        <Suspense fallback={<h4>Loading…</h4>}>
                            <PrivacyToken data={privacyTokens} />
                        </Suspense>
                        <div className="text-center">
                            <Button className="btn btn-add-coin" onClick={onOpenAddCoinModal}>
                                Add a coin +
                            </Button>
                        </div>
                    </Sider>
                    <Content>
                        <Suspense
                            fallback={
                                <div className="spiner">
                                    <Spin tip="Loading..." />
                                </div>
                            }>
                            <Transaction />
                        </Suspense>
                    </Content>
                </Layout>
                <CreateAccount onGetStatusCreated={onGetStatusAction} />
                <ImportAccount onGetStatusImported={onGetStatusAction} />
                <AddCoin />
            </div>
        </AccountStyled>
    );
};

export default Account;
