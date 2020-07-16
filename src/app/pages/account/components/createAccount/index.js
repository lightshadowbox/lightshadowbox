import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { isEmpty } from 'lodash';
import { Button, Modal, Form, Input, notification } from 'antd';
import { Config } from 'configs';
import { LOCAL_STORAGE_KEY } from 'app/consts';
import LocalStorageServices from 'app/utils/localStorage';
import { masterAccount as MasterAccount, IncognitoInstance } from 'app/services/incognito';
import { onSetCreateAccountState } from 'app/pages/account/redux/slice';
import { makeSelectCreatedAccountStatus } from 'app/pages/account/redux/selectors';

const CreateAccountStyled = styled.div`
    .caption {
        margin-top: 3em;
    }
`;

const CreateAccount = ({ onGetStatusCreated }) => {
    const dispatch = useDispatch();
    const visible = useSelector(makeSelectCreatedAccountStatus());
    const onHandleCreateCancel = () => {
        dispatch(onSetCreateAccountState(false));
    };

    const onCreateAccount = async (values) => {
        if (values) {
            const { accountName } = values;
            const account = await MasterAccount.createAccount(accountName);
            if (!isEmpty(account)) {
                if (account.status === 'ERROR') {
                    const { message } = account;
                    notification.open({
                        message,
                    });
                } else {
                    dispatch(onSetCreateAccountState(false));
                    notification.open({
                        message: 'Success',
                    });
                    const backupWalletString = await IncognitoInstance.wallet.backup(Config.WALLET_PASS);
                    LocalStorageServices.setItem(LOCAL_STORAGE_KEY.WALLET, backupWalletString);
                    if (onGetStatusCreated && typeof onGetStatusCreated === 'function') {
                        onGetStatusCreated(backupWalletString);
                    }
                }
            }
        }
    };

    return (
        <CreateAccountStyled>
            <Modal footer={null} visible={visible} onCancel={onHandleCreateCancel} className="text-center">
                <h3>CREATE ACCOUNT</h3>
                <Form className="form" name="create-account" layout="vertical" onFinish={onCreateAccount}>
                    <Form.Item
                        name="accountName"
                        label="Enter your account’s name"
                        rules={[{ required: true, message: 'Enter your account’s name' }]}>
                        <Input spellCheck="false" />
                    </Form.Item>
                    <Button type="primary" size="large" htmlType="submit">
                        Submit
                    </Button>
                </Form>
                <p className="caption">
                    All the wallet & account service will be sent directly to the main chain, we don’t store any data / keys on this
                    website.
                </p>
            </Modal>
        </CreateAccountStyled>
    );
};

CreateAccount.propTypes = {
    onGetStatusCreated: PropTypes.func,
};

export default CreateAccount;
