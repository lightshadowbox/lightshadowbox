import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import { Typography } from 'antd';
import { MSG } from 'app/consts';
import { masterAccount as MasterAccount } from 'app/services/incognito';
import coin from 'app/consts/coin';
import { makeSelectAccountSelected } from 'app/redux/incognito/selector';

const PrivacyTokenAmount = ({ tokenId, name, amount, symbol }) => {
    const { Text } = Typography;
    const [balance, setBalance] = useState(0);
    const accountSelected = useSelector(makeSelectAccountSelected());

    useEffect(() => {
        const fetchBalanceToken = async (name, token) => {
            let bl = 0;
            if (isEqual(tokenId, coin.PRV_ID)) {
                bl = await MasterAccount.getTotalBalanceCoin(name);
            } else {
                bl = await MasterAccount.getTotalBalanceToken(name, token);
            }
            if (bl.status === MSG.SUCCESS && !isEmpty(bl.data)) {
                setBalance(bl.data.toNumber() || 0);
            }
        };
        if (!isEmpty(accountSelected) && !isEmpty(tokenId)) {
            fetchBalanceToken(accountSelected.name, tokenId);
        }
    }, [accountSelected, tokenId]);

    return (
        <>
            <div className="content">
                <h4 className="title-amount no-margin line-height">{name}</h4>
                <Text>{amount}</Text>
            </div>
            <div className="balance">
                <Text className="title-value no-margin line-height">
                    {balance} {symbol}
                </Text>
            </div>
        </>
    );
};

PrivacyTokenAmount.propTypes = {
    tokenId: PropTypes.string,
    name: PropTypes.string,
    amount: PropTypes.number,
    symbol: PropTypes.string,
};

export default PrivacyTokenAmount;
