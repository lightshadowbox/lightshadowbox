import React, { useCallback, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useImmer } from 'use-immer';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import { VariableSizeList as List } from 'react-window';
import { Modal, notification, Typography, Input } from 'antd';
import { Config } from 'configs';
import { LOCAL_STORAGE_KEY, MSG } from 'app/consts';
import LocalStorageServices from 'app/utils/localStorage';
import { onIncognitoPrivacyTokens } from 'app/redux/incognito/actions';
import { makeSelectPCustomeTokens, makeSelectAccountSelected, makeSelectPrivacyTokens } from 'app/redux/incognito/selector';
import { masterAccount as MasterAccount, IncognitoInstance } from 'app/services/incognito';
import { onSetAddCointState } from 'app/pages/account/redux/slice';
import { makeSelectAddCoinStatus } from 'app/pages/account/redux/selectors';

const AddCoinStyled = styled.div`
    flex: 1;
    .search-box {
        padding: 1rem 1rem 0.5rem;
    }
    .coins {
        max-height: 25rem;
        overflow-x: hidden;
        overflow-y: auto;
        .scroll-coins {
            width: 100% !important;
        }
        .wrap-inner {
            padding: 0.313rem 0.1rem;
            .inner {
                display: flex;
                flex: 1;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                border: 0.125rem solid transparent;
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
                    > h4,
                    > span {
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
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
    const privacyTokens = useSelector(makeSelectPrivacyTokens());
    const [options, setOptions] = useImmer([]);
    const onHandleCancel = () => {
        dispatch(onSetAddCointState(false));
    };

    useEffect(() => {
        if (!isEmpty(pCustomeTokens)) {
            setOptions(() => pCustomeTokens);
        }
    }, [pCustomeTokens, setOptions]);

    const onAddCoin = useCallback(
        async (event, token) => {
            event.preventDefault();
            if (!isEmpty(accountSelected) && !isEmpty(token)) {
                const { name } = accountSelected;
                const followStatus = await MasterAccount.followTokenById(name, token);
                if (followStatus.status === MSG.SUCCESS) {
                    notification.open({
                        message: 'Success',
                    });
                    const backupWalletString = IncognitoInstance.wallet.backup(Config.WALLET_PASS);
                    LocalStorageServices.setItem(LOCAL_STORAGE_KEY.WALLET, backupWalletString);
                    const followTokens =
                        (!isEmpty(followStatus?.data) &&
                            followStatus?.data.map((token) => {
                                const { tokenId, name, symbol, bridgeInfo } = token;
                                return {
                                    tokenId,
                                    name,
                                    symbol,
                                    image: '',
                                    pDecimals: bridgeInfo?.pDecimals || null,
                                    decimals: bridgeInfo?.decimals || null,
                                    isVerified: bridgeInfo?.verified || null,
                                };
                            })) ||
                        [];
                    dispatch(onIncognitoPrivacyTokens(followTokens));
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

    const onSearch = (event) => {
        const {
            target: { value },
        } = event;
        event.preventDefault();
        setOptions(() => {
            if (value.length === 0) {
                return pCustomeTokens;
            }
            const state = pCustomeTokens.filter((item) => {
                return item.Name.toLowerCase().indexOf(value.toLowerCase()) > -1;
            });
            return state;
        });
    };

    const checkPrivacyAdded = (tokenId) => privacyTokens && privacyTokens.findIndex((p) => p.tokenId === tokenId) !== -1;

    // eslint-disable-next-line react/prop-types
    const Row = ({ index, style }) => {
        const { TokenID, Name, Symbol } = options[index];
        return (
            <div style={style}>
                <div className="wrap-inner">
                    <div className="inner pointer" onClick={(event) => onAddCoin(event, TokenID)}>
                        <div className="content">
                            <Title level={4}>{Name}</Title>
                            <Text>{Symbol}</Text>
                        </div>
                        {checkPrivacyAdded(TokenID) && <Text>Added</Text>}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Modal
            footer={null}
            title="Coins"
            visible={visible}
            onCancel={onHandleCancel}
            className="text-center custom-modal add-coin-modal no-p-modal">
            <AddCoinStyled>
                <div className="search-box">
                    <Input placeholder="Search..." onChange={onSearch} />
                </div>
                <div className="coins">
                    {!isEmpty(options) && (
                        <List
                            className="scroll-coins"
                            useIsScrolling
                            height={300}
                            itemCount={options.length}
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
