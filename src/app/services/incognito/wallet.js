import { WalletInstance } from 'incognito-js';

export class Wallet {
    constructor() {
        this.walletMaster = new WalletInstance();
    }

    async createWallet(password, walletName) {
        return this.walletMaster.init(password, walletName);
    }

    async backup(password, wallet) {
        this.backupWalletString = wallet.backup(password);
        return this.backupWalletString;
    }

    async restore(password, backupWalletString) {
        this.wallet = await WalletInstance.restore(backupWalletString, password);
        return this.wallet;
    }
}

export const walletInstance = new Wallet();
