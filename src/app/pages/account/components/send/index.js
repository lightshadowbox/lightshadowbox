import React, { memo, useCallback } from 'react';
// import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Modal, Form, Input, Button, notification, Tabs } from 'antd';
import { MSG } from 'app/consts';
import { nanoBalance, pDecimalBalance } from 'app/utils/format';
import { masterAccount as MasterAccount } from 'app/services/incognito';
import { makeSelectAccountSelected, makeSelectPrivacyTokenSelected } from 'app/redux/incognito/selector';
import { onSetSendAssetState } from 'app/pages/account/redux/slice';
import { makeSelectSendAssetStatus } from 'app/pages/account/redux/selectors';
import { isEmpty } from 'lodash';

const SendAssetStyled = styled.div`
    flex: 1;
    .ant-modal-body {
        padding-left: 0;
        padding-right: 0;
    }
    .ant-tabs-content-holder {
        padding: 1.5rem;
    }
    .coins {
        max-height: 25rem;
        overflow-x: hidden;
        overflow-y: auto;
        .inner {
            display: flex;
            flex: 1;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            .content {
                margin-left: 0.875rem;
                min-width: 0;
                display: flex;
                flex-direction: column;
                flex: 1;
                text-align: left;
            }
        }
    }
`;
const SendAsset = () => {
    const dispatch = useDispatch();
    const accountSelected = useSelector(makeSelectAccountSelected());
    const tokenSelected = useSelector(makeSelectPrivacyTokenSelected());
    const visible = useSelector(makeSelectSendAssetStatus());
    const [form] = Form.useForm();
    const { TabPane } = Tabs;

    const fetchExchangeRate = useCallback(async (accountSelected, tokenId) => {
        const { name } = accountSelected;
        const exchangeRate = await MasterAccount.hasExchangeRate(name, tokenId);
        console.log(exchangeRate);
    }, []);

    const onHandleCancel = () => {
        dispatch(onSetSendAssetState(false));
    };

    const getMinAmount = () => {
        // MIN = 1 nano
        if (tokenSelected?.pDecimals) {
            return 1 / 10 ** tokenSelected.pDecimals;
        }

        return 0;
    };

    const getMaxAmount = (estimateFeeData) => {
        const { fee = 0, feeUnitByTokenId } = estimateFeeData;
        let amount = tokenSelected?.amount;

        if (feeUnitByTokenId === tokenSelected?.tokenId) {
            const newAmount = (Number(amount) || 0) - (Number(fee) || 0);
            amount = newAmount > 0 ? newAmount : 0;
        }

        const maxAmount = pDecimalBalance(amount, tokenSelected?.pDecimals);

        return Math.max(maxAmount, 0);
    };

    const onGetMax = () => {
        if (!isEmpty(tokenSelected)) {
            const { availableBalance, pDecimals } = tokenSelected;
            form.setFieldsValue({
                amount: (availableBalance && pDecimalBalance(Number(availableBalance), pDecimals)) || 0,
            });
        }
    };
    const onSend = useCallback(
        async (values) => {
            if (!isEmpty(accountSelected) && !isEmpty(values)) {
                const { amount, paymentAddressStr, message } = values;
                const formated = {
                    amount: nanoBalance(Number(amount), tokenSelected?.pDecimals),
                    paymentAddressStr,
                    fee: Number(100),
                    message,
                };
                const transferStatus = await MasterAccount.transferCoin(accountSelected?.name, formated);
                if (transferStatus.status === MSG.ERROR) {
                    const { message } = transferStatus;
                    notification.open({
                        message,
                    });
                }
                dispatch(onSetSendAssetState(false));
            }
        },
        [dispatch, tokenSelected, accountSelected],
    );

    return (
        <Modal
            footer={null}
            visible={visible}
            title={`Send ${tokenSelected?.symbol}`}
            onCancel={onHandleCancel}
            className="text-center custom-modal popup-modal full-buttons">
            <SendAssetStyled>
                <Tabs defaultActiveKey="1" type="card" size="default">
                    <TabPane tab="In-network" key="1">
                        <Form
                            form={form}
                            name="import-account"
                            layout="vertical"
                            onFinish={onSend}
                            initialValues={{ fee: pDecimalBalance(100, tokenSelected?.pDecimals).toFixed(7) || 0 }}>
                            <Form.Item
                                name="amount"
                                label="Amount"
                                rules={[
                                    { required: true, message: 'Required' },
                                    {
                                        type: 'number',
                                        asyncValidator: (rule, value) => {
                                            return new Promise((resolve, reject) => {
                                                if (value < getMinAmount()) {
                                                    reject(`Amount must be larger than ${getMinAmount()} PRV`); // reject with error message
                                                } else if (value < getMinAmount()) {
                                                } else {
                                                    resolve();
                                                }
                                            });
                                        },
                                    },
                                ]}>
                                <Input type="number" spellCheck="false" suffix={<span onClick={onGetMax}>MAX</span>} />
                            </Form.Item>
                            <Form.Item name="paymentAddressStr" label={<span>To</span>} rules={[{ required: true, message: 'Required' }]}>
                                <Input.TextArea rows={2} spellCheck="false" placeholder="Enter Incognito address" />
                            </Form.Item>
                            <Form.Item name="fee" label={<span>Fee</span>}>
                                <Input spellCheck="false" placeholder="0" readOnly disabled suffix={tokenSelected?.symbol} />
                            </Form.Item>
                            <Form.Item name="message" label={<span>Memo</span>} rules={[{ required: true, message: 'Required' }]}>
                                <Input.TextArea rows={2} spellCheck="false" placeholder="Add a note" />
                            </Form.Item>
                            <Form.Item className="button-actions no-margin">
                                <Button type="default" size="large" htmlType="button" onClick={onHandleCancel}>
                                    Cancel
                                </Button>
                                <Button type="primary" size="large" htmlType="submit">
                                    Send
                                </Button>
                            </Form.Item>
                        </Form>
                    </TabPane>
                    <TabPane tab="Out-network" key="2">
                        Coming soon
                    </TabPane>
                </Tabs>
            </SendAssetStyled>
        </Modal>
    );
};

SendAsset.propTypes = {};

export default memo(SendAsset);
