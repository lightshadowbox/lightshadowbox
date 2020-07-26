import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { Typography } from 'antd';
import { pDecimalBalance, formatAmount } from 'app/utils/format';

const PrivacyTokenAmount = ({ token }) => {
    const { Text } = Typography;
    const [balance, setBalance] = useState(0);
    useEffect(() => {
        if (!isEmpty(token)) {
            const { totalBalance, pDecimals } = token;
            const pAmount = pDecimalBalance(totalBalance, pDecimals);
            setBalance(formatAmount(pAmount) || 0);
        }
    }, [token]);

    return (
        <>
            <div className="content">
                <h4 className="title-amount no-margin line-height">{token?.name}</h4>
                <Text>{token?.amount}</Text>
            </div>
            <div className="balance">
                <Text className="title-value no-margin line-height">
                    {balance} {token?.symbol}
                </Text>
            </div>
        </>
    );
};

PrivacyTokenAmount.propTypes = {
    token: PropTypes.object,
};

export default memo(PrivacyTokenAmount);
