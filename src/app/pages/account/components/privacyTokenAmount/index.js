import React, { memo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import { Typography } from 'antd';
import { MSG } from 'app/consts';
import { pDecimalBalance, formatAmount } from 'app/utils/format';
import coin from 'app/consts/coin';
import { masterAccount as MasterAccount } from 'app/services/incognito';
import { updateTotalBalance, updateAvailableBalance } from 'app/redux/incognito/actions';
import { makeSelectAccountSelected } from 'app/redux/incognito/selector';

const PrivacyTokenAmount = ({ token }) => {
    const dispatch = useDispatch();
    const { Text } = Typography;
    const [balance, setBalance] = useState(0);
    const accountSelected = useSelector(makeSelectAccountSelected());
    const { tokenId, name, amount, symbol, pDecimals } = token;
    useEffect(() => {
        const fetchBalanceToken = async (name, token) => {
            let bl = 0;
            let av = 0;
            if (isEqual(tokenId, coin.PRV_ID)) {
                bl = await MasterAccount.getTotalBalanceCoin(name);
                av = await MasterAccount.getAvaialbleBalanceCoin(name);
            } else {
                bl = await MasterAccount.getTotalBalanceToken(name, token);
                av = await MasterAccount.getAvaialbleBalanceToken(name, token);
            }
            if (bl.status === MSG.SUCCESS) {
                if (!isEmpty(bl.data)) {
                    const totalBalance = bl.data.toNumber() || 0;
                    const pAmount = pDecimalBalance(totalBalance, pDecimals);
                    setBalance(formatAmount(pAmount));
                    dispatch(updateTotalBalance({ tokenId, totalBalance }));
                }
                if (!isEmpty(av.data)) {
                    const availableBalance = bl.data.toNumber() || 0;
                    dispatch(updateAvailableBalance({ tokenId, availableBalance }));
                }
            }
        };
        if (!isEmpty(accountSelected) && !isEmpty(tokenId)) {
            fetchBalanceToken(accountSelected.name, tokenId);
        }
    }, [accountSelected, tokenId, pDecimals, dispatch]);

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
    token: PropTypes.object,
};

export default memo(PrivacyTokenAmount);
