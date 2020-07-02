import { Avatar, List } from 'antd';
import { makeSelectAccounts } from 'app/redux/incognito/selector';
import isEmpty from 'lodash/isEmpty';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
const AccountListStyled = styled.div`
    .demo-infinite-container {
        border: 1px solid #e8e8e8;
        border-radius: 4px;
        overflow: auto;
        padding: 8px 24px;
        height: 300px;
    }
`;

const AccountList = () => {
    const accounts = useSelector(makeSelectAccounts());
    const [accountList, setAccountList] = useState([]);

    useEffect(() => {
        if (isEmpty(accountList)) {
            setAccountList(accounts);
        }
        return () => {
            setAccountList([]);
        };
    }, [accounts]);

    return (
        <AccountListStyled>
            <List
                dataSource={accountList}
                renderItem={(item) => (
                    <List.Item key={item.name}>
                        <List.Item.Meta
                            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                            title={<a href="https://ant.design">{item.name.last}</a>}
                            description={item.email}
                        />
                        <div>{item.name}</div> <div>{item.paymentAddressKeySerialized}</div>
                    </List.Item>
                )}></List>
        </AccountListStyled>
    );
};

export default AccountList;
