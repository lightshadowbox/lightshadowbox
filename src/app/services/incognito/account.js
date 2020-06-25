export class MasterAccount {
    masterAccount;

    constructor(wallet) {
        this.masterAccount = wallet.masterAccount;
    }

    getAccounts() {
        return this.masterAccount.getAccounts();
    }

    async createAccount(accountName, shardId = null) {
        try {
            return await this.masterAccount.addAccount(accountName, shardId);
        } catch (error) {
            console.debug('CREATE ACCOUNT ERROR', error);
            return null;
        }
    }

    async importAccount(accountName, privateKey) {
        try {
            await this.masterAccount.importAccount(accountName, privateKey);
            return true;
        } catch (error) {
            console.debug('IMPORT ERROR', error);
            return false;
        }
    }

    async followTokenById(accountName, tokenId) {
        const account = this.masterAccount.getAccountByName(accountName);
        account.followTokenById(tokenId);
        const followingTokens = await account.getFollowingPrivacyToken();
        return followingTokens;
    }

    async unfollowTokenById(accountName, tokenId) {
        const account = this.masterAccount.getAccountByName(accountName);
        account.unfollowTokenById(tokenId);
        const followingTokens = await account.getFollowingPrivacyToken();
        return followingTokens;
    }

    async getTotalBalanceCoin(accountName) {
        const account = this.masterAccount.getAccountByName(accountName);
        return account.nativeToken.getTotalBalance();
    }

    async getAvaialbleBalanceCoin(accountName) {
        const account = this.masterAccount.getAccountByName(accountName);
        return account.nativeToken.getAvaiableBalance();
    }

    async getTxHistoriesCoin(accountName) {
        const account = this.masterAccount.getAccountByName(accountName);
        return account.nativeToken.getTxHistories();
    }

    async getTotalBalanceToken(accountName, tokenId) {
        const account = this.masterAccount.getAccountByName(accountName);
        const token = await account.getFollowingPrivacyToken(tokenId);
        return token.getTotalBalance();
    }

    async getAvaialbleBalanceToken(accountName, tokenId) {
        const account = this.masterAccount.getAccountByName(accountName);
        const token = await account.getFollowingPrivacyToken(tokenId);
        return token.getAvaiableBalance();
    }

    async getTxHistoriesToken(accountName, tokenId) {
        const account = this.masterAccount.getAccountByName(accountName);
        const token = await account.getFollowingPrivacyToken(tokenId);
        return token.getTxHistories();
    }
}
