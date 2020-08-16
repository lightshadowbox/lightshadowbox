import { MSG } from 'app/consts'
import get from 'lodash/get'

class MasterAccount {
  masterAccount

  constructor(wallet) {
    this.masterAccount = wallet.masterAccount
  }

  getAccounts() {
    const accounts = this.masterAccount.getAccounts().map((data) => {
      return {
        name: data.name,
        privacyTokenIds: data.privacyTokenIds,
        paymentAddressKeySerialized: get(data, 'nativeToken.accountKeySet.paymentAddressKeySerialized', ''),
        privateKeySerialized: get(data, 'nativeToken.accountKeySet.privateKeySerialized', ''),
        viewingKeySerialized: get(data, 'nativeToken.accountKeySet.viewingKeySerialized', ''),
        publicKeySerialized: get(data, 'nativeToken.accountKeySet.publicKeySerialized', ''),
        publicKeyCheckEncode: get(data, 'nativeToken.accountKeySet.publicKeyCheckEncode', ''),
        validatorKey: get(data, 'nativeToken.accountKeySet.validatorKey', ''),
        nativeToken: {
          name: get(data, 'nativeToken.name', ''),
          symbol: get(data, 'nativeToken.symbol', ''),
          tokenId: get(data, 'nativeToken.tokenId', ''),
        },
      }
    })
    return accounts
  }

  getAccountByName(accountName) {
    return this.masterAccount.child.find((item) => item.name === accountName)
  }

  getAccountIndexByName(accountName) {
    return this.masterAccount.child.findIndex((item) => item.name === accountName)
  }

  async getAllAcounts(accountName) {
    try {
      const account = await this.masterAccount.getAccountByName(accountName)
      return account
    } catch (error) {
      return { status: MSG.ERROR, message: 'Get Accounts Error' }
    }
  }

  async createAccount(accountName, shardId = null) {
    try {
      return await this.masterAccount.addAccount(accountName, shardId)
    } catch (error) {
      return { status: MSG.ERROR, message: 'Account was not created, please try again.' }
    }
  }

  async importAccount(accountName, privateKey) {
    try {
      await this.masterAccount.importAccount(accountName, privateKey)
      return { status: MSG.SUCCESS }
    } catch (error) {
      return { status: MSG.ERROR, message: 'Account was not imported, please try again.' }
    }
  }

  async followTokenById(accountName, tokenId) {
    try {
      const account = this.getAccountByName(accountName)
      account.followTokenById(tokenId)
      const followingTokens = await account.getFollowingPrivacyToken()
      return { status: MSG.SUCCESS, data: followingTokens }
    } catch (error) {
      return { status: MSG.ERROR, message: 'Can not follow token' }
    }
  }

  async unfollowTokenById(accountName, tokenId) {
    const account = this.masterAccount.getAccountByName(accountName)
    account.unfollowTokenById(tokenId)
    const followingTokens = await account.getFollowingPrivacyToken()
    return followingTokens
  }

  async getFollowingPrivacyToken(accountName, tokenId) {
    const account = this.masterAccount.getAccountByName(accountName)
    const token = await account.getFollowingPrivacyToken(tokenId)
    return token
  }

  async getFollowingPrivacyTokens(accountName) {
    const account = this.getAccountByName(accountName)
    const followingTokens = await account.getFollowingPrivacyToken()
    return followingTokens
  }

  async getTotalBalanceCoin(accountName) {
    try {
      const account = this.getAccountByName(accountName)
      const balance = await account.nativeToken.getTotalBalance()
      return { status: MSG.SUCCESS, data: balance }
    } catch (error) {
      return {
        status: MSG.ERROR,
        message: 'Native token - Can not get total balance',
      }
    }
  }

  async getAvaialbleBalanceCoin(accountName) {
    try {
      const account = this.getAccountByName(accountName)
      const balance = await account.nativeToken.getAvaiableBalance()
      return { status: MSG.SUCCESS, data: balance }
    } catch (error) {
      return {
        status: MSG.ERROR,
        message: 'Native token - Can not get available balance',
      }
    }
  }

  async transferCoin(accountName, data) {
    try {
      const account = this.getAccountByName(accountName)
      const { paymentAddressStr, amount, message, fee } = data
      const history = await account.nativeToken.transfer(
        [
          {
            paymentAddressStr,
            amount,
            message,
          },
        ],
        fee,
      )
      return { status: MSG.SUCCESS, data: history }
    } catch (error) {
      return {
        status: MSG.ERROR,
        message: 'Native token transfer failed.',
      }
    }
  }

  async getTxHistoriesCoin(accountName) {
    try {
      const account = this.getAccountByName(accountName)
      const histories = await account.nativeToken.getTxHistories()
      return {
        status: MSG.SUCCESS,
        data: histories || [],
      }
    } catch (error) {
      return {
        status: MSG.ERROR,
        message: 'Native token - Can not get transaction history',
      }
    }
  }

  async getAllFollowingPrivacyTokens(accountName) {
    try {
      const account = this.getAccountByName(accountName)
      const tokens = await account.getFollowingPrivacyToken()
      return { status: MSG.SUCCESS, data: tokens }
    } catch (error) {
      return { status: MSG.ERROR, message: 'Can not get all following privacy tokens' }
    }
  }

  async getTotalBalanceToken(accountName, tokenId) {
    try {
      const account = this.getAccountByName(accountName)
      const token = await account.getFollowingPrivacyToken(tokenId)
      const balance = token && (await token.getTotalBalance())
      return { status: MSG.SUCCESS, data: balance }
    } catch (error) {
      return { status: MSG.ERROR, message: `Can not get total balance of the ${tokenId}` }
    }
  }

  async getAvaialbleBalanceToken(accountName, tokenId) {
    try {
      const account = this.getAccountByName(accountName)
      const token = await account.getFollowingPrivacyToken(tokenId)
      const balance = token && (await token.getAvaiableBalance())
      return { status: MSG.SUCCESS, data: balance }
    } catch (error) {
      return {
        status: MSG.ERROR,
        message: `Can not get available balance of the ${tokenId}`,
      }
    }
  }

  async hasExchangeRate(accountName, tokenId) {
    try {
      const account = this.getAccountByName(accountName)
      const token = await account.getFollowingPrivacyToken(tokenId)
      const isHasRate = await token.hasExchangeRate()
      return { status: MSG.SUCCESS, data: isHasRate }
    } catch (error) {
      return {
        status: MSG.ERROR,
        message: 'Can not check exchange rate',
      }
    }
  }

  async transferToken(accountName, tokenId, data) {
    try {
      const account = this.getAccountByName(accountName)
      const token = await account.getFollowingPrivacyToken(tokenId)

      const { paymentAddressStr, amount, message, fee, privacyFee } = data
      const history = await token.transfer(
        [
          {
            paymentAddressStr,
            amount,
            message,
          },
        ],
        fee,
        privacyFee,
      )
      return { status: MSG.SUCCESS, data: history }
    } catch (error) {
      return {
        status: MSG.ERROR,
        message: 'Privacy token transfer failed.',
      }
    }
  }

  async getTxHistoriesToken(accountName, tokenId) {
    try {
      const account = this.getAccountByName(accountName)
      const token = await account.getFollowingPrivacyToken(tokenId)
      const histories = await token.getTxHistories()
      return {
        status: MSG.SUCCESS,
        data: histories || [],
      }
    } catch (error) {
      return {
        status: MSG.ERROR,
        message: 'Privacy token - Can not get transaction history',
      }
    }
  }

  async getAllPrivacyTokenBalance(accountName) {
    try {
      // get list privacy token
      const privacyTokens = await this.getAllFollowingPrivacyTokens(accountName)
      const pTokenList = privacyTokens?.data
      // get balance for each privacy token
      const tasks = []
      for (let i = 0; i < pTokenList.length; i += 1) {
        const token = pTokenList[i]
        const tokenBalanceItemPromise = new Promise((resolve) => {
          token &&
            token.getTotalBalance().then((res) => {
              const totalBalance = res.toNumber() || 0
              resolve({
                tokenId: token?.tokenID,
                balance: totalBalance,
              })
            })
        })
        tasks.push(tokenBalanceItemPromise)
      }

      const allResult = await Promise.all(tasks)
      const hasBalanceResult = allResult && allResult.filter((r) => r && r.balance > 0)
      return {
        status: MSG.SUCCESS,
        data: hasBalanceResult || [],
      }
    } catch (e) {
      return {
        status: MSG.ERROR,
        message: e,
      }
    }
  }
}

export default MasterAccount
