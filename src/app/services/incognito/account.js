export class Account {
    async createAccount(wallet, accountName, shardId = null) {
        try {
            return await wallet.masterAccount.addAccount(accountName, shardId);
        } catch (error) {
            console.debug('CREATE ACCOUNT ERROR', error);
            return null;
        }
    }
    importAccount(wallet, privateKey, accountName) {
        try {
            const passPhrase = getPassphrase();
            wallet.importAccount(privateKey, accountName, passPhrase);
            return true;
        } catch (error) {
            console.debug('IMPORT ERROR', error);
            return false;
        }
    }

    removeAccount(wallet, privateKey, passPhrase) {
        return wallet.removeAccount(privateKey, passPhrase);
    }

    getAllAccounts(wallet) {
        return wallet.listAccount();
    }

    getBalance(wallet, name, tokenId) {
        const indexAccount = wallet.getAccountIndexByName(name);
        return wallet.MasterAccount.child[indexAccount].getBalance(tokenId);
    }
}
