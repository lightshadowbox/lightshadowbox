import * as incognitoJs from 'incognito-js';

export class Wallet {
    async createWallet(password, walletName) {
        const walletMaster = new incognitoJs.WalletInstance();
        return walletMaster.init(password, walletName);
    }

    async backup(password, wallet) {
        return wallet.backup(password);
    }

    async restore(password, backupWalletString) {
        return incognitoJs.WalletInstance.restore(backupWalletString, password);
    }
}

export const walletInstance = new Wallet();
