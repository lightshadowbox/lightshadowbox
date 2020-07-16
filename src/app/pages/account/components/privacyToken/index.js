import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Avatar, Menu, Typography } from 'antd';
import { makeSelectPCustomeTokens } from 'app/redux/incognito/selector';
import Logo from 'assets/logo.png';

const PrivacyToken = ({ data }) => {
    const pCustomeTokens = useSelector(makeSelectPCustomeTokens());
    const { Text } = Typography;
    return (
        !isEmpty(data) &&
        data.map((ac, idx) => (
            <Menu.Item key={idx} className="wallet-balance">
                {ac ? (
                    <div className="inner">
                        <Avatar size={40} icon={<img src={Logo} alt="WELCOME TO INCOGNITO WEB WALLET" />} />
                        <div className="content">
                            <h4 className="title-amount line-height">{ac?.nativeToken?.name}</h4>
                            <Text className="title-value no-margin line-height">{ac?.nativeToken?.symbol}</Text>
                        </div>
                        <div className="balance">
                            <Text className="title-value no-margin line-height">{ac?.avaiableBalance}</Text>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </Menu.Item>
        ))
    );
};

PrivacyToken.propTypes = {
    data: PropTypes.array,
};

export default PrivacyToken;
