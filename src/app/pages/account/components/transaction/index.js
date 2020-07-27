/* eslint-disable no-param-reassign */
import React, { memo, lazy, useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import isEqual from 'lodash/isEqual';
import styled from 'styled-components';
import { Typography, Row, Col, Button, Avatar, Layout, Table } from 'antd';
import { pDecimalBalance, formatAmount, formatDateTime } from 'app/utils/format';
import coin from 'app/consts/coin';
import { masterAccount as MasterAccount } from 'app/services/incognito';
import { onSetSendAssetState, onSetReceiveAssetState } from 'app/pages/account/redux/slice';
import { makeSelectPrivacyTokenSelected, makeSelectAccountSelected } from 'app/redux/incognito/selector';
import PRVIcon from 'assets/prv@2x.png';
import { MSG } from 'app/consts';

const SendAsset = lazy(() => import('app/pages/account/components/send'));
const ReceiveAsset = lazy(() => import('app/pages/account/components/receive'));

const TransactionStyled = styled.div`
    .table-transaction {
        .ant-table-wrapper {
            padding: 1rem 1.5rem 0.5rem;
            .ant-table-content {
                table {
                    border: 0.063rem solid #f0f0f0;
                    border-bottom: none;
                }
            }
        }
    }
`;

const columns = [
    {
        title: 'TxId',
        dataIndex: 'txId',
        key: 'txId',
        width: 250,
        ellipsis: true,
        render: (text) => (
            <a href={`https://mainnet.incognito.org/tx/${text}`} target="_blank" rel="noreferrer">
                {text}
            </a>
        ),
    },
    {
        title: 'Fee',
        dataIndex: 'fee',
        key: 'fee',
        ellipsis: true,
        render: (text) => <span>{text}</span>,
    },
    {
        title: 'Send',
        dataIndex: 'amount',
        key: 'amount',
        ellipsis: true,
        render: (text) => <span>{text}</span>,
    },
    {
        title: 'To address',
        dataIndex: 'address',
        key: 'address',
        width: 250,
        ellipsis: true,
        render: (text) => (
            <>
                <span>{text}</span>
            </>
        ),
    },
    {
        title: 'Time',
        dataIndex: 'lockTime',
        key: 'lockTime',
        ellipsis: true,
        render: (text) => <span>{formatDateTime(text)}</span>,
    },
];

const Transaction = () => {
    const dispatch = useDispatch();
    const { Title, Text } = Typography;
    const { Header } = Layout;
    const tokenSelected = useSelector(makeSelectPrivacyTokenSelected());
    const accountSelected = useSelector(makeSelectAccountSelected());
    const [isHistory, setHistory] = useState(false);
    const [histories, setHistories] = useState(null);

    const avatar = isEqual(tokenSelected?.tokenId, coin.PRV_ID) ? PRVIcon : tokenSelected?.image;

    const fetchHistories = useCallback(
        async (accountSelected) => {
            const { name } = accountSelected;
            setHistory(true);
            let history = null;
            if (isEqual(tokenSelected?.tokenId, coin.PRV_ID)) {
                history = await MasterAccount.getTxHistoriesCoin(name);
            } else {
                history = await MasterAccount.getTxHistoriesToken(name, tokenSelected?.tokenId);
            }
            if (history.status === MSG.SUCCESS) {
                const { data } = history;
                const fmt = data.map((item) => {
                    const {
                        txId,
                        txType,
                        lockTime,
                        status,
                        nativeTokenInfo,
                        privacyTokenInfo,
                        accountPublicKeySerialized,
                        historyType,
                    } = item;
                    const payment = {
                        fee: null,
                        amount: null,
                        address: null,
                    };
                    if (!isEmpty(nativeTokenInfo)) {
                        payment.fee = nativeTokenInfo?.fee;
                        payment.amount = (nativeTokenInfo?.amount && formatAmount(pDecimalBalance(nativeTokenInfo?.amount, 9))) || 0;
                        payment.address = nativeTokenInfo?.paymentInfoList && nativeTokenInfo?.paymentInfoList[0]?.paymentAddressStr;
                    }
                    if (!isEmpty(privacyTokenInfo)) {
                        payment.fee = privacyTokenInfo?.fee;
                        payment.amount = (privacyTokenInfo?.amount && formatAmount(pDecimalBalance(privacyTokenInfo?.amount, 9))) || 0;
                        payment.address = privacyTokenInfo?.paymentInfoList && privacyTokenInfo?.paymentInfoList[0]?.paymentAddressStr;
                    }
                    return {
                        txId,
                        txType,
                        lockTime,
                        status,
                        ...payment,

                        nativeTokenInfo,
                        accountPublicKeySerialized,
                        historyType,
                        coin: !isEmpty(nativeTokenInfo) ? 'PRV' : '',
                    };
                });
                console.log(history);
                setHistories(fmt);
            }
            setHistory(false);
        },
        [tokenSelected],
    );

    useEffect(() => {
        if (!isEmpty(accountSelected)) {
            fetchHistories(accountSelected);
        }
    }, [accountSelected, fetchHistories]);

    const onOpenSendModal = () => {
        dispatch(onSetSendAssetState(true));
    };

    const onOpenReceiveModal = () => {
        dispatch(onSetReceiveAssetState(true));
    };

    return (
        <TransactionStyled>
            <Header className="header bg-white">
                <Row>
                    <Col span={12} className="text-left">
                        <div className="wallet-balance title">
                            <div className="inner">
                                <Avatar
                                    className="coin-avatar"
                                    size={40}
                                    icon={avatar ? <img src={avatar} alt="WELCOME TO INCOGNITO WEB WALLET" /> : null}
                                />
                                <div className="content">
                                    <h4 className="title-amount line-height">{tokenSelected?.name}</h4>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col span={12} className="text-right">
                        <Button className="btn btn-send" type="primary" size="large" htmlType="button" onClick={onOpenSendModal}>
                            Send
                        </Button>
                        <Button className="btn btn-receive" type="primary" size="large" htmlType="button" onClick={onOpenReceiveModal}>
                            Receive
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col span={12} className="text-left">
                        <Text>Transaction History</Text>
                    </Col>
                    <Col span={12} className="text-right">
                        <Title level={3} className="no-margin">
                            {formatAmount(pDecimalBalance(tokenSelected?.availableBalance, tokenSelected?.pDecimals)) || 0}&nbsp;
                            {tokenSelected?.symbol}
                        </Title>
                    </Col>
                </Row>
            </Header>
            <div className="table-transaction">
                <Table columns={columns} dataSource={histories} hasData={false} pagination={false} loading={isHistory} rowKey="txId" />
            </div>
            <SendAsset />
            <ReceiveAsset />
        </TransactionStyled>
    );
};

Transaction.propTypes = {};

export default memo(Transaction);
