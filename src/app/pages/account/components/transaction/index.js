import React, { lazy, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useImmer } from 'use-immer';
import isEqual from 'lodash/isEqual';
import styled from 'styled-components';
import { Typography, Row, Col, Button, Avatar, Layout, Table } from 'antd';
import { pDecimalBalance, formatAmount } from 'app/utils/format';
import coin from 'app/consts/coin';
import { onSetSendAssetState, onSetReceiveAssetState } from 'app/pages/account/redux/slice';
import { makeSelectPrivacyTokenSelected } from 'app/redux/incognito/selector';
import PRVIcon from 'assets/prv@2x.png';
import { isEmpty } from 'lodash';

const SendAsset = lazy(() => import('app/pages/account/components/send'));
const ReceiveAsset = lazy(() => import('app/pages/account/components/receive'));

const TransactionStyled = styled.div``;

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text) => <a>{text}</a>,
    },
];

const Transaction = () => {
    const dispatch = useDispatch();
    const { Title, Text } = Typography;
    const { Header } = Layout;
    const tokenSelected = useSelector(makeSelectPrivacyTokenSelected());
    const [tokenState, setTokenState] = useImmer({
        totalBalance: 0,
        availableBalance: 0,
    });

    const onOpenSendModal = () => {
        dispatch(onSetSendAssetState(true));
    };

    const onOpenReceiveModal = () => {
        dispatch(onSetReceiveAssetState(true));
    };

    useEffect(() => {
        if (!isEmpty(tokenSelected)) {
            const { totalBalance, availableBalance, pDecimals } = tokenSelected;
            setTokenState((draft) => {
                draft.totalBalance = (totalBalance && pDecimals && formatAmount(pDecimalBalance(totalBalance, pDecimals))) || 0;
                draft.availableBalance = (availableBalance && pDecimals && formatAmount(pDecimalBalance(availableBalance, pDecimals))) || 0;
            });
        }
    }, [setTokenState, tokenSelected]);

    return (
        <TransactionStyled>
            <Header className="header bg-white">
                <Row>
                    <Col span={12} className="text-left">
                        <div className="wallet-balance title">
                            <div className="inner">
                                <Avatar
                                    size={40}
                                    icon={
                                        <img
                                            src={isEqual(tokenSelected?.tokenId, coin.PRV_ID) ? PRVIcon : tokenSelected?.image}
                                            alt="WELCOME TO INCOGNITO WEB WALLET"
                                        />
                                    }
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
            {/* <Table columns={columns} dataSource={data} /> */}
            <SendAsset />
            <ReceiveAsset />
        </TransactionStyled>
    );
};

Transaction.propTypes = {};

export default Transaction;
