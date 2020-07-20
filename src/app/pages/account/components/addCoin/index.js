import React, { useCallback } from 'react';
// import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { isEmpty } from 'lodash';
import { VariableSizeList as List } from 'react-window';
import { Modal, notification, Typography } from 'antd';
import { Config } from 'configs';
import { LOCAL_STORAGE_KEY, MSG } from 'app/consts';
import LocalStorageServices from 'app/utils/localStorage';
import { makeSelectPCustomeTokens, makeSelectAccountSelected } from 'app/redux/incognito/selector';
import { masterAccount as MasterAccount, IncognitoInstance } from 'app/services/incognito';
import { onSetAddCointState } from 'app/pages/account/redux/slice';
import { makeSelectAddCoinStatus } from 'app/pages/account/redux/selectors';

const AddCoinStyled = styled.div`
    flex: 1;
    .coins {
        max-height: 400px;
        overflow-x: hidden;
        overflow-y: auto;
        .scroll-coins {
            width: 100% !important;
        }
        .wrap-inner {
            padding: 5 15px;
            .inner {
                display: flex;
                flex: 1;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                border: 2px solid transparent;
                transition: all 0.3s ease-in;
                &:hover {
                    border-color: rgba(122, 201, 253, 0.5);
                }
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

    // eslint-disable-next-line react/prop-types
    const Row = ({ index, style }) => {
        const { TokenID, Name, Symbol } = pCustomeTokens[index];
        return (
            <div style={style}>
                <div className="wrap-inner">
                    <div className="inner pointer" onClick={(event) => onAddCoin(event, TokenID)}>
                        <div className="content">
                            <Title level={4}>{Name}</Title>
                            <Text>{Symbol}</Text>
                        </div>
                        <Text>Added</Text>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Modal footer={null} title="Coins" visible={visible} onCancel={onHandleCancel} className="text-center custom-modal no-p-modal">
            <AddCoinStyled>
                <div className="coins">
                    {!isEmpty(pCustomeTokens) && (
                        <List
                            className="scroll-coins"
                            useIsScrolling
                            height={300}
                            itemCount={pCustomeTokens.length}
                            itemSize={() => 75}
                            width={400}>
                            {Row}
                        </List>
                    )}
                </div>
            </AddCoinStyled>
        </Modal>
    );
};

CreateAccount.propTypes = {};

export default CreateAccount;
