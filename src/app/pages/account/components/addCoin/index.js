import React, { memo, useCallback, useEffect } from 'react'

import { Avatar, Badge, Empty, Input, Modal, notification, Typography } from 'antd'
import { LOCAL_STORAGE_KEY, MSG } from 'app/consts'
import { makeSelectAddCoinStatus } from 'app/pages/account/redux/selectors'
import { onSetAddCointState } from 'app/pages/account/redux/slice'
import { onIncognitoPrivacyTokens } from 'app/redux/incognito/actions'
import { makeSelectAccountSelected, makeSelectPCustomeTokens, makeSelectPrivacyTokens } from 'app/redux/incognito/selector'
import { IncognitoInstance, masterAccount as MasterAccount, TempData } from 'app/services/incognito'
import { getIconBySymbol } from 'app/utils'
import LocalStorageServices from 'app/utils/localStorage'
import DefaultIcon from 'assets/200x200.png'
import isEmpty from 'lodash/isEmpty'
// import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux'
import { VariableSizeList as List } from 'react-window'
import styled from 'styled-components'
import { useImmer } from 'use-immer'

import { CheckOutlined } from '@ant-design/icons'

const AddCoinStyled = styled.div`
  flex: 1;
  .search-box {
    padding: 1rem 1rem 0.5rem;
  }
  .coins {
    max-height: 25rem;
    overflow-x: hidden;
    overflow-y: auto;
    .scroll-coins {
      width: 100% !important;
    }
    img {
      background-image: url('http://placehold.it/200x200');
      overflow: hidden;
    }
    .wrap-inner {
      padding: 0.313rem 1rem;
      .inner {
        display: flex;
        flex: 1;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        border: 0.125rem solid transparent;
        transition: all 0.3s ease-in;
        &:hover {
          border-color: rgba(122, 201, 253, 0.5);
        }
        .content {
          margin-left: 0.875rem;
          min-width: 0;
          display: flex;
          flex-direction: column;
          flex: 1;
          text-align: left;
          > h4,
          > span {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          > h4 {
            margin: 0;
          }
        }
      }
      .custome-badge {
        .anticon {
          width: 1rem;
          height: 1rem;
          right: 0.1212rem;
        }
      }
    }
  }
`

const CreateAccount = () => {
  const dispatch = useDispatch()
  const { Title, Text } = Typography
  const visible = useSelector(makeSelectAddCoinStatus())
  const accountSelected = useSelector(makeSelectAccountSelected())
  const pCustomeTokens = useSelector(makeSelectPCustomeTokens())
  const privacyTokens = useSelector(makeSelectPrivacyTokens())
  const [options, setOptions] = useImmer([])
  const onHandleCancel = () => {
    dispatch(onSetAddCointState(false))
  }

  useEffect(() => {
    if (!isEmpty(pCustomeTokens)) {
      setOptions(() => pCustomeTokens)
    }
  }, [pCustomeTokens, setOptions])

  const checkPrivacyAdded = (tokenId) => privacyTokens && privacyTokens.findIndex((p) => p.tokenId === tokenId) !== -1

  const onAddCoin = useCallback(
    async (event, privacyToken) => {
      event.preventDefault()
      if (!isEmpty(accountSelected) && !isEmpty(privacyToken) && !checkPrivacyAdded(privacyToken?.TokenID)) {
        const { TokenID, PricePrv, Name, Verified, PSymbol, Symbol, PDecimals } = privacyToken
        const { name } = accountSelected
        const followStatus = await MasterAccount.followTokenById(name, TokenID)
        if (followStatus.status === MSG.SUCCESS) {
          notification.open({
            message: 'Success',
          })
          const backupWalletString = IncognitoInstance.wallet.backup(TempData.password)
          LocalStorageServices.setItem(LOCAL_STORAGE_KEY.WALLET, backupWalletString)
          const privacyTokenAdded = {
            tokenId: TokenID,
            name: Name,
            pSymbol: PSymbol,
            symbol: Symbol,
            pDecimals: PDecimals,
            isVerified: Verified,
            totalBalance: null,
            availableBalance: null,
            pricePrv: PricePrv,
          }
          dispatch(onIncognitoPrivacyTokens([...privacyTokens, privacyTokenAdded]))
        } else {
          notification.open({
            message: followStatus?.message,
          })
        }
        dispatch(onSetAddCointState(false))
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accountSelected, privacyTokens, dispatch],
  )

  const onSearch = (event) => {
    const {
      target: { value },
    } = event
    event.preventDefault()
    setOptions(() => {
      if (value.length === 0) {
        return pCustomeTokens
      }
      const state = pCustomeTokens.filter((item) => {
        return item.Name.toLowerCase().indexOf(value.toLowerCase()) > -1
      })
      return state
    })
  }

  // eslint-disable-next-line react/prop-types
  const Row = ({ index, style }) => {
    const { TokenID, Name, Symbol, Verified } = options[index]
    return (
      <div style={style}>
        <div className="wrap-inner">
          <div className="inner pointer" onClick={(event) => onAddCoin(event, options[index])}>
            {Verified ? (
              <Badge count={<CheckOutlined />} className="custome-badge">
                <Avatar
                  size={40}
                  className="coin-avatar"
                  icon={
                    <img
                      src={getIconBySymbol(Symbol)}
                      alt="WELCOME TO INCOGNITO WEB WALLET"
                      onError={(e) => {
                        e.target.src = DefaultIcon
                      }}
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
                    src={getIconBySymbol(Symbol)}
                    alt="WELCOME TO INCOGNITO WEB WALLET"
                    onError={(e) => {
                      e.target.src = DefaultIcon
                    }}
                    width="40"
                  />
                }
              />
            )}
            <div className="content">
              <Title level={4}>{Name}</Title>
              <Text>{Symbol}</Text>
            </div>
            {checkPrivacyAdded(TokenID) && <Text>Added</Text>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Modal
      footer={null}
      title="Coins"
      visible={visible}
      onCancel={onHandleCancel}
      className="text-center custom-modal popup-modal no-p-modal">
      <AddCoinStyled>
        <div className="search-box">
          <Input placeholder="Search..." onChange={onSearch} />
        </div>
        <div className="coins">
          {!isEmpty(options) ? (
            <List className="scroll-coins" useIsScrolling height={300} itemCount={options.length} itemSize={() => 75} width={400}>
              {Row}
            </List>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </div>
      </AddCoinStyled>
    </Modal>
  )
}

CreateAccount.propTypes = {}

export default memo(CreateAccount)
