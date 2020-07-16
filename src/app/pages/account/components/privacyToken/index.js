import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Avatar, Menu, Typography } from 'antd';

const PrivacyToken = ({ data }) => {
    console.log(data);
    const { Text } = Typography;
    return (
        <Menu mode="inline" defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']}>
            {!isEmpty(data) &&
                data.map((ac, idx) => {
                    const { Image, Name, Symbol, Amount } = ac;
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
                                            {Amount} {Symbol}
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
