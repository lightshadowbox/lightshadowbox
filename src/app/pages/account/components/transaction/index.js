/* eslint-disable no-param-reassign */
import React, { memo, lazy, useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { useImmer } from 'use-immer';
import isEqual from 'lodash/isEqual';
import styled from 'styled-components';
import { Typography, Row, Col, Button, Avatar, Layout, Table } from 'antd';
import { pDecimalBalance, formatAmount, formatDateTime } from 'app/utils/format';
import coin from 'app/consts/coin';
import { masterAccount as MasterAccount } from 'app/services/incognito';
import { onSetSendAssetState, onSetReceiveAssetState } from 'app/pages/account/redux/slice';
import { makeSelectPrivacyTokenSelected, makeSelectAccountSelected } from 'app/redux/incognito/selector';
import PRVIcon from 'assets/prv@2x.png';

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
        title: 'txId',
        dataIndex: 'txId',
        key: 'txId',
        width: 250,
        render: (text) => <strong>{text}</strong>,
    },
    {
        title: 'lockTime',
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

    const [tokenState, setTokenState] = useImmer({
        totalBalance: 0,
        availableBalance: 0,
    });
    const avatar = isEqual(tokenSelected?.tokenId, coin.PRV_ID) ? PRVIcon : tokenSelected?.image;

    const fetchHistories = useCallback(
        async (accountSelected) => {
            const { name } = accountSelected;
            setHistory(true);
            let history = null;
            if (isEqual(tokenSelected?.tokenId, coin.PRV_ID)) {
                console.log('get native history');
                history = await MasterAccount.getTxHistoriesCoin(name);
            } else {
                console.log('get privacy history');
                history = await MasterAccount.getTxHistoriesToken(name, tokenSelected?.tokenId);
            }
            setHistories(history?.data || []);
            setHistory(false);
            console.log(JSON.stringify(history));
        },
        [tokenSelected],
    );

    useEffect(() => {
        if (!isEmpty(tokenSelected)) {
            const { totalBalance, availableBalance, pDecimals } = tokenSelected;
            setTokenState((draft) => {
                draft.totalBalance = (totalBalance && pDecimals && formatAmount(pDecimalBalance(totalBalance, pDecimals))) || 0;
                draft.availableBalance = (availableBalance && pDecimals && formatAmount(pDecimalBalance(availableBalance, pDecimals))) || 0;
            });
        }
    }, [setTokenState, tokenSelected]);

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
                            {tokenState.availableBalance}&nbsp;
                            {tokenSelected?.symbol}
                        </Title>
                    </Col>
                </Row>
            </Header>
            <div className="table-transaction">
                <Table columns={columns} dataSource={histories} hasData={false} loading={isHistory} rowKey="txId" />
            </div>
            <SendAsset />
            <ReceiveAsset />
        </TransactionStyled>
    );
};

Transaction.propTypes = {};

export default memo(Transaction);
