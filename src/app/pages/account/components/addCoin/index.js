import React, { useCallback } from 'react';
// import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { isEmpty } from 'lodash';
import { Modal, List, notification, Typography } from 'antd';
import { Config } from 'configs';
import { LOCAL_STORAGE_KEY, MSG } from 'app/consts';
import LocalStorageServices from 'app/utils/localStorage';
import { makeSelectPCustomeTokens, makeSelectAccountSelected } from 'app/redux/incognito/selector';
import { masterAccount as MasterAccount, IncognitoInstance } from 'app/services/incognito';
import { onSetAddCointState } from 'app/pages/account/redux/slice';
import { makeSelectAddCoinStatus } from 'app/pages/account/redux/selectors';

const AddCoinStyled = styled.div`
    flex: 1;
    .ant-modal-body {
        padding-left: 0;
        padding-right: 0;
    }
    .coins {
        max-height: 400px;
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

const CreateAccount = () => {
    const dispatch = useDispatch();
    const { Title, Text } = Typography;
    const visible = useSelector(makeSelectAddCoinStatus());
    const accountSelected = useSelector(makeSelectAccountSelected());
    const pCustomeTokens = useSelector(makeSelectPCustomeTokens());
    const onHandleCancel = () => {
        dispatch(onSetAddCointState(false));
    };
    const onAddCoin = useCallback(
        async (event, coinToken) => {
            event.preventDefault();
            if (!isEmpty(accountSelected) && !isEmpty(coinToken)) {
                const { name } = accountSelected;
                const followStatus = await MasterAccount.followTokenById(name, coinToken);
                if (followStatus.status === MSG.SUCCESS) {
                    notification.open({
                        message: 'Success',
                    });
                    const backupWalletString = IncognitoInstance.wallet.backup(Config.WALLET_PASS);
                    LocalStorageServices.setItem(LOCAL_STORAGE_KEY.WALLET, backupWalletString);
                } else {
                    notification.open({
                        message: followStatus?.message,
                    });
                }
                dispatch(onSetAddCointState(false));
            }
        },
        [accountSelected, dispatch],
    );

    return (
        <Modal footer={null} visible={visible} onCancel={onHandleCancel} className="text-center">
            <AddCoinStyled>
                <h3>Coins</h3>
                <div className="coins">
                    <List
                        itemLayout="horizontal"
                        bordered
                        dataSource={pCustomeTokens}
                        renderItem={(item) => (
                            <List.Item key={item?.ID}>
                                <div className="inner pointer" onClick={(event) => onAddCoin(event, item?.TokenID)}>
                                    <div className="content">
                                        <Title level={4}>{item?.Name}</Title>
                                        <Text>{item?.Symbol}</Text>
                                    </div>
                                    <Text>Added</Text>
                                </div>
                            </List.Item>
                        )}
                    />
                </div>
            </AddCoinStyled>
        </Modal>
    );
};

CreateAccount.propTypes = {};

export default CreateAccount;
