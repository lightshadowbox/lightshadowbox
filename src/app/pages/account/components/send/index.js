import React, { useCallback } from 'react';
// import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Modal, Form, Input, Button, notification } from 'antd';
import { MSG } from 'app/consts';
import { masterAccount as MasterAccount } from 'app/services/incognito';
import { makeSelectAccountSelected } from 'app/redux/incognito/selector';
import { onSetSendAssetState } from 'app/pages/account/redux/slice';
import { makeSelectSendAssetStatus } from 'app/pages/account/redux/selectors';
import { isEmpty } from 'lodash';

const SendAssetStyled = styled.div`
    flex: 1;
    .ant-modal-body {
        padding-left: 0;
        padding-right: 0;
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
const tokenSymbol = 'PRV';
const SendAsset = () => {
    const dispatch = useDispatch();
    const accountSelected = useSelector(makeSelectAccountSelected());
    const visible = useSelector(makeSelectSendAssetStatus());

    const onHandleCancel = () => {
        dispatch(onSetSendAssetState(false));
    };

    const onGetMax = () => {
        console.log('onget max');
    };

    const onSend = useCallback(
        async (values) => {
            if (!isEmpty(accountSelected) && !isEmpty(values)) {
                const { amount, paymentAddressStr, message } = values;
                const formated = {
                    amount: Number(amount),
                    paymentAddressStr,
                    fee: Number(20),
                    message,
                };
                const transferStatus = await MasterAccount.transfer(accountSelected?.name, formated);
                console.log(transferStatus);
                console.log(formated);
                if (transferStatus.status === MSG.ERROR) {
                    const { message } = transferStatus;
                    notification.open({
                        message,
                    });
                }
                dispatch(onSetSendAssetState(false));
            }
        },
        [dispatch, accountSelected],
    );

    return (
        <Modal
            footer={null}
            visible={visible}
            title={`Send ${tokenSymbol}`}
            onCancel={onHandleCancel}
            className="text-center custom-modal full-buttons">
            <SendAssetStyled>
                <Form name="import-account" layout="vertical" onFinish={onSend} initialValues={{ fee: 20 }}>
                    <Form.Item name="amount" label="Amount" rules={[{ required: true, message: 'Required' }]}>
                        <Input spellCheck="false" suffix={<span onClick={onGetMax}>MAX</span>} />
                    </Form.Item>
                    <Form.Item name="paymentAddressStr" label={<span>To</span>} rules={[{ required: true, message: 'Required' }]}>
                        <Input.TextArea rows={2} spellCheck="false" placeholder="Enter Incognito address" />
                    </Form.Item>
                    <Form.Item name="fee" label={<span>Fee</span>}>
                        <Input spellCheck="false" placeholder="0" readOnly disabled suffix={tokenSymbol} />
                    </Form.Item>
                    <Form.Item name="message" label={<span>Memo</span>}>
                        <Input.TextArea rows={2} spellCheck="false" placeholder="Add a note (optional)" />
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
            </SendAssetStyled>
        </Modal>
    );
};

SendAsset.propTypes = {};

export default SendAsset;
