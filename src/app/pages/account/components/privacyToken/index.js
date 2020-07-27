import React, { memo, Suspense, lazy, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import { Avatar, Menu, Badge } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import coin from 'app/consts/coin';
import { onIncognitoPrivacyTokenSelected } from 'app/redux/incognito/actions';
import { makeSelectPrivacyTokenSelected } from 'app/redux/incognito/selector';
import PRVIcon from 'assets/prv@2x.png';
import DefaultIcon from 'assets/200x200.png';

const PrivacyTokenAmount = lazy(() => import('app/pages/account/components/privacyTokenAmount'));

const PrivacyToken = ({ data }) => {
    const dispatch = useDispatch();
    const tokenSelected = useSelector(makeSelectPrivacyTokenSelected());

    const onSelectedPrivacyToken = useCallback(
        (token) => {
            dispatch(onIncognitoPrivacyTokenSelected(token));
        },
        [dispatch],
    );

    return (
        <Menu mode="inline" className="no-border" selectedKeys={[tokenSelected?.tokenId]} defaultSelectedKeys={[coin.PRV_ID]}>
            {!isEmpty(data) &&
                data.map((ac) => {
                    const { isVerified, tokenId } = ac;
                    const avatar = isEqual(tokenId, coin.PRV_ID)
                        ? PRVIcon
                        : `https://storage.googleapis.com/incognito/wallet/tokens/icons/${tokenId}.png`;
                    return (
                        <Menu.Item key={tokenId} className="wallet-balance" onClick={() => onSelectedPrivacyToken(ac)}>
                            {ac ? (
                                <div className="inner">
                                    {isVerified ? (
                                        <Badge count={<CheckOutlined />} className="custome-badge">
                                            <Avatar
                                                size={40}
                                                className="coin-avatar"
                                                icon={
                                                    avatar ? (
                                                        <img
                                                            src={avatar}
                                                            alt="WELCOME TO INCOGNITO WEB WALLET"
                                                            width="40"
                                                            onError={(e) => {
                                                                e.target.src = DefaultIcon;
                                                            }}
                                                        />
                                                    ) : null
                                                }
                                            />
                                        </Badge>
                                    ) : (
                                        <Avatar
                                            size={40}
                                            className="coin-avatar"
                                            icon={
                                                avatar ? (
                                                    <img
                                                        src={avatar}
                                                        alt="WELCOME TO INCOGNITO WEB WALLET"
                                                        width="40"
                                                        onError={(e) => {
                                                            e.target.src = DefaultIcon;
                                                        }}
                                                    />
                                                ) : null
                                            }
                                        />
                                    )}
                                    <Suspense fallback={<h1>Loading…</h1>}>
                                        <PrivacyTokenAmount token={ac} />
                                    </Suspense>
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

export default memo(PrivacyToken);
