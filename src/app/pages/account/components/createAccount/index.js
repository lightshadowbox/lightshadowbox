import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { Button, Typography, Modal, Form, Input, notification } from 'antd';
import { Config } from 'configs';
import { LOCAL_STORAGE_KEY } from 'app/consts';
import LocalStorageServices from 'app/utils/localStorage';
import { masterAccount as MasterAccount, IncognitoInstance } from 'app/services/incognito';
import { onSetCreateAccountState } from 'app/pages/account/redux/slice';
import { makeSelectCreatedAccountStatus } from 'app/pages/account/redux/selectors';

const CreateAccount = ({ onGetStatusCreated }) => {
    const dispatch = useDispatch();
    const visible = useSelector(makeSelectCreatedAccountStatus());
    const { Title, Text } = Typography;
    const onHandleCreateCancel = () => {
        dispatch(onSetCreateAccountState(false));
    };

    const onCreateAccount = async (values) => {
        if (values) {
            const { accountName } = values;
            const account = await MasterAccount.createAccount(accountName);
            if (!isEmpty(account)) {
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
    };

    return (
        <>
            <Modal footer={null} visible={visible} onCancel={onHandleCreateCancel}>
                <Title>CREATE ACCOUNT</Title>
                <Form name="create-account" layout="vertical" onFinish={onCreateAccount}>
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
                <Text>
                    All the wallet & account service will be sent directly to the main chain, we don’t store any data / keys on this
                    website.
                </Text>
            </Modal>
        </>
    );
};

CreateAccount.propTypes = {
    onGetStatusCreated: PropTypes.func,
};

export default CreateAccount;
