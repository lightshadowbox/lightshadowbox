import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useInjectReducer } from 'redux-injectors';
import isEmpty from 'lodash/isEmpty';
import { CaretDownOutlined, CopyOutlined, PlusOutlined, DownloadOutlined, CheckOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Dropdown, Layout, Menu, Row, Tooltip, Typography, Spin } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { createCookie, readCookie } from 'app/utils/cookieStorage';
import { LOCAL_STORAGE_KEY, MSG } from 'app/consts';
import coin from 'app/consts/coin';
import { getBackgroundColor, getName } from 'app/utils';
import LocalStorageServices from 'app/utils/localStorage';
import { loadingClose, loadingOpen, loadingOpenAction, loadingCloseAction } from 'app/redux/common/actions';
import { makeSelectAccounts, makeSelectPrivacyTokens, makeSelectPCustomeTokens } from 'app/redux/incognito/selector';
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
    updateTotalBalance,
    updateAvailableBalance,
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
    const pTokens = useSelector(makeSelectPCustomeTokens());
    const { Content, Sider } = Layout;
    const { Title } = Typography;
    const [accountSelected, setAccountSelected] = useState(null);

    const getBalanceNative = useCallback(
        async (name) => {
            const bl = await MasterAccount.getTotalBalanceCoin(name);
            if (bl.status === MSG.SUCCESS && !isEmpty(bl.data)) {
                const totalBalance = bl.data.toNumber() || 0;
                await dispatch(updateTotalBalance({ tokenId: coin.PRV_ID, totalBalance }));
            }
            const av = await MasterAccount.getAvaialbleBalanceCoin(name);
            if (av.status === MSG.SUCCESS && !isEmpty(av.data)) {
                const availableBalance = av.data.toNumber() || 0;
                await dispatch(updateAvailableBalance({ tokenId: coin.PRV_ID, availableBalance }));
            }
        },
        [dispatch],
    );

    const getBalanceByFollowTokens = useCallback(
        async (name) => {
            const tokens = await MasterAccount.getAllFollowingPrivacyTokens(name);
            if (tokens.status === MSG.SUCCESS && !isEmpty(tokens?.data)) {
                const { data } = tokens;
                try {
                    data.forEach(async (token) => {
                        setTimeout(async () => {
                            const bl = token && (await token.getTotalBalance());
                            const totalBalance = bl.toNumber() || 0;
                            await dispatch(updateTotalBalance({ tokenId: token.tokenId, totalBalance }));
                        }, 3000);
                        // setTimeout(async () => {
                        //     const av = token && (await token.getAvaiableBalance());
                        //     const availableBalance = av.toNumber() || 0;
                        //     await dispatch(updateAvailableBalance({ tokenId: token.tokenId, availableBalance }));
                        // }, 3000);
                    });
                } catch (error) {
                    console.debug('CAN GET COIN BALANCE', error);
                }
            }
        },
        [dispatch],
    );

    const fetchPrivacyTokens = useCallback(
        async (privacyTokenIds, address) => {
            const TOKEN_LOCAL_KEY = `${LOCAL_STORAGE_KEY.PRIVACY_TOKENS}_${address}`;
            let followTokens = [];
            if (!isEmpty(privacyTokenIds)) {
                if (readCookie(TOKEN_LOCAL_KEY) && JSON.parse(readCookie(TOKEN_LOCAL_KEY))) {
                    followTokens = JSON.parse(readCookie(TOKEN_LOCAL_KEY));
                    dispatch(onIncognitoPrivacyTokens([coin.PRV, ...followTokens]));
                } else {
                    privacyTokenIds.forEach((t) => {
                        const hasIndex = pTokens.findIndex((item) => item.TokenID === t);
                        if (hasIndex !== -1) {
                            const { TokenID, PricePrv, Name, Verified, PSymbol, Symbol, PDecimals } = pTokens[hasIndex];
                            const param = {
                                tokenId: TokenID,
                                name: Name,
                                pSymbol: PSymbol,
                                symbol: Symbol,
                                image: `https://storage.googleapis.com/incognito/wallet/tokens/icons/${TokenID}.png`,
                                pDecimals: PDecimals,
                                isVerified: Verified,
                                totalBalance: null,
                                availableBalance: null,
                                pricePrv: PricePrv,
                            };
                            followTokens.push(param);
                        }
                    });
                    createCookie(TOKEN_LOCAL_KEY, JSON.stringify(followTokens), 1);
                    dispatch(onIncognitoPrivacyTokens([coin.PRV, ...followTokens]));
                }
            } else {
                dispatch(onIncognitoPrivacyTokens([coin.PRV]));
            }
        },
        [pTokens, dispatch],
    );

    useEffect(() => {
        if (!isEmpty(masterAccount) && LocalStorageServices.getItem(LOCAL_STORAGE_KEY.WALLET)) {
            const data = [];
            masterAccount.forEach(async (ma) => {
                data.push({
                    ...ma,
                });
            });
            const account = masterAccount[0];
            setAccountSelected(account);
            dispatch(onIncognitoAccountSelected(account));
            dispatch(onIncognitoPrivacyTokenSelected(coin.PRV));
            getBalanceNative(account?.name);
            fetchPrivacyTokens(account?.privacyTokenIds, account?.paymentAddressKeySerialized);
            getBalanceByFollowTokens(account?.name);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onHandleAccoutSelected = useCallback(
        async (account) => {
            if (account) {
                const { name } = account;
                dispatch(loadingOpenAction());
                setAccountSelected(account);
                fetchPrivacyTokens(account?.privacyTokenIds, account?.paymentAddressKeySerialized);
                getBalanceNative(name);
                getBalanceByFollowTokens(name);
                dispatch(onIncognitoAccountSelected(account));
                dispatch(onIncognitoPrivacyTokenSelected(coin.PRV));
                dispatch(loadingCloseAction());
            }
        },
        [fetchPrivacyTokens, getBalanceNative, getBalanceByFollowTokens, dispatch],
    );

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
