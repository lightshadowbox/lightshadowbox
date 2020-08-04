import React, { memo, Suspense, lazy, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import { Avatar, Menu, Badge } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import coin from 'app/consts/coin';
import { getIconBySymbol } from 'app/utils';
import { masterAccount as MasterAccount } from 'app/services/incognito';
import { onIncognitoPrivacyTokenSelected, updateAvailableBalance } from 'app/redux/incognito/actions';
import { makeSelectPrivacyTokenSelected, makeSelectAccountSelected } from 'app/redux/incognito/selector';
import PRVIcon from 'assets/prv@2x.png';
import DefaultIcon from 'assets/200x200.png';

const PrivacyTokenAmount = lazy(() => import('app/pages/account/components/privacyTokenAmount'));

const PrivacyToken = ({ data }) => {
    const dispatch = useDispatch();
    const tokenSelected = useSelector(makeSelectPrivacyTokenSelected());
    const accountSelected = useSelector(makeSelectAccountSelected());

    const onSelectedPrivacyToken = useCallback(
        async (item) => {
            dispatch(onIncognitoPrivacyTokenSelected(item));
            if (!isEmpty(accountSelected?.name)) {
                const account = await MasterAccount.getAccountByName(accountSelected?.name);
                let balance;
                if (item?.tokenId === coin.PRV_ID) {
                    balance = await account.nativeToken.getAvaiableBalance();
                } else {
                    const token = await account.getFollowingPrivacyToken(item?.tokenId);
                    balance = token && (await token.getAvaiableBalance());
                }
                const availableBalance = (!isEmpty(balance) && balance.toNumber()) || 0;
                await dispatch(updateAvailableBalance({ tokenId: item?.tokenId, availableBalance }));
            }
        },
        [accountSelected, dispatch],
    );

    return (
        <Menu mode="inline" className="no-border" selectedKeys={[tokenSelected?.tokenId]} defaultSelectedKeys={[coin.PRV_ID]}>
            {!isEmpty(data) &&
                data.map((ac) => {
                    const { isVerified, tokenId, symbol } = ac;
                    const avatar = isEqual(tokenId, coin.PRV_ID) ? PRVIcon : getIconBySymbol(symbol);
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
                                                            alt={symbol}
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
                                                        alt={symbol}
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
