import { LOCAL_STORAGE_KEY } from 'app/consts'
import LocalStorageServices from 'app/utils/localStorage'
import { WalletInstance } from 'incognito-js'

export class Wallet {
  constructor() {
    this.walletMaster = new WalletInstance()
  }

  async createWallet(password, walletName) {
    return this.walletMaster.init(password, walletName)
  }

  async backup(password, wallet) {
    this.backupWalletString = wallet.backup(password)
    return this.backupWalletString
  }

  async restore(password, backupWalletString) {
    this.wallet = await WalletInstance.restore(backupWalletString, password)
    return this.wallet
  }

  async restoreWallet(password) {
    const backupString = LocalStorageServices.getItem(LOCAL_STORAGE_KEY.WALLET)
    return this.restore(password, backupString)
  }
}

export const walletInstance = new Wallet()

window.W = walletInstance
