import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Avatar, Menu, Typography } from 'antd';
import { masterAccount as MasterAccount } from 'app/services/incognito';
import { makeSelectAccountSelected } from 'app/redux/incognito/selector';

const PrivacyToken = ({ data }) => {
    const { Text } = Typography;
    const accountSelected = useSelector(makeSelectAccountSelected());
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        const fetchBalanceToken = async (name, token) => {
            const balance = await MasterAccount.getTotalBalanceToken(name, token);
            setBalance(balance.toNumber());
        };
        if (!isEmpty(accountSelected) && !isEmpty(data)) {
            fetchBalanceToken(accountSelected.name, data.ID);
        }
    }, [accountSelected, data]);

    return (
        <Menu mode="inline" className="no-border" defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']}>
            {!isEmpty(data) &&
                data.map((ac, idx) => {
                    const { Image, Name, Symbol } = ac;
                    return (
                        <Menu.Item key={idx} className="wallet-balance">
                            {ac ? (
                                <div className="inner">
                                    <Avatar size={40} icon={<img src={Image} alt="WELCOME TO INCOGNITO WEB WALLET" />} />
                                    <div className="content">
                                        <h4 className="title-amount line-height">{Name}</h4>
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
