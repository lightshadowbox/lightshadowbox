import React, { lazy } from 'react';
// import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Typography, Row, Col, Button, Avatar, Layout } from 'antd';
import { onSetSendAssetState } from 'app/pages/account/redux/slice';
import { makeSelectPrivacyTokenSelected } from 'app/redux/incognito/selector';

const SendAsset = lazy(() => import('app/pages/account/components/send'));

const TransactionStyled = styled.div``;

const Transaction = () => {
    const dispatch = useDispatch();
    const { Text } = Typography;
    const { Header } = Layout;
    const tokenSelected = useSelector(makeSelectPrivacyTokenSelected());

    const onOpenSendModal = () => {
        dispatch(onSetSendAssetState(true));
    };

    return (
        <TransactionStyled>
            <Header className="header bg-white">
                <Row>
                    <Col span={12} className="text-left">
                        <div className="wallet-balance title">
                            <div className="inner">
                                <Avatar size={40} icon={<img src={tokenSelected?.Image} alt="WELCOME TO INCOGNITO WEB WALLET" />} />
                                <div className="content">
                                    {tokenSelected ? (
                                        <>
                                            <h4 className="title-amount line-height">{tokenSelected?.Name}</h4>
                                            <Text className="title-value no-margin line-height">{tokenSelected?.symbol}</Text>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col span={12} className="text-right">
                        <Button className="btn-send" type="primary" size="large" htmlType="button" onClick={onOpenSendModal}>
                            Send
                        </Button>
                        <Button className="btn-receive" type="primary" size="large" htmlType="button">
                            Receive
                        </Button>
                    </Col>
                </Row>
            </Header>
            content
            <SendAsset />
        </TransactionStyled>
    );
};

Transaction.propTypes = {};

export default Transaction;
