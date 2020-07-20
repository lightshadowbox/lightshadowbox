import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Avatar, Menu, Typography, Badge } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { CRYPTO_ICON_URL } from 'app/consts';
import { masterAccount as MasterAccount } from 'app/services/incognito';
import { onIncognitoPrivacyTokenSelected } from 'app/redux/incognito/actions';
import { makeSelectAccountSelected } from 'app/redux/incognito/selector';

const PrivacyToken = ({ data }) => {
    const dispatch = useDispatch();
    const { Text } = Typography;
    const accountSelected = useSelector(makeSelectAccountSelected());
    const [balance, setBalance] = useState(0);

    const onSelectedPrivacyToken = (token) => {
        dispatch(onIncognitoPrivacyTokenSelected(token));
    };

    useEffect(() => {
        const fetchBalanceToken = async (name, token) => {
            const balance = await MasterAccount.getTotalBalanceToken(name, token);
            setBalance(balance && balance.toNumber());
        };
        if (!isEmpty(accountSelected) && !isEmpty(data)) {
            fetchBalanceToken(accountSelected.name, data.ID);
        }
    }, [accountSelected, data]);

    return (
        <Menu mode="inline" className="no-border" defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']}>
            {!isEmpty(data) &&
                data.map((ac, idx) => {
                    const { Image, TokenID, Name, Symbol, Amount, IsPrivacy } = ac;
                    return (
                        <Menu.Item key={idx} className="wallet-balance" onClick={() => onSelectedPrivacyToken(ac)}>
                            {ac ? (
                                <div className="inner">
                                    {IsPrivacy ? (
                                        <Badge count={<CheckOutlined />} className="custome-badge">
                                            <Avatar
                                                size={40}
                                                className="coin-avatar"
                                                icon={
                                                    <img
                                                        src={Image || `${CRYPTO_ICON_URL}/${TokenID}.png`}
                                                        alt="WELCOME TO INCOGNITO WEB WALLET"
                                                        width="40"
                                                    />
                                                }
                                            />
                                        </Badge>
                                    ) : (
                                        <Avatar
                                            size={40}
                                            className="coin-avatar"
                                            icon={
                                                <img
                                                    src={Image || `${CRYPTO_ICON_URL}/${TokenID}.png`}
                                                    alt="WELCOME TO INCOGNITO WEB WALLET"
                                                    width="40"
                                                />
                                            }
                                        />
                                    )}
                                    <div className="content">
                                        <h4 className="title-amount line-height">{Name}</h4>
                                        <Text>{Amount}</Text>
                                    </div>
                                    <div className="balance">
                                        <Text className="title-value no-margin line-height">
                                            {balance} {Symbol}
                                        </Text>
                                    </div>
                                </div>
                            ) : (
                                <></>
                            )}
                        </Menu.Item>
                    );
                })}
        </Menu>
    );
};

PrivacyToken.propTypes = {
    data: PropTypes.array,
};

export default PrivacyToken;
