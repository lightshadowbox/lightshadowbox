import { get } from 'lodash';

class MasterAccount {
    masterAccount;

    constructor(wallet) {
        this.masterAccount = wallet.masterAccount;
    }

    getAccounts() {
        const accounts = this.masterAccount.getAccounts().map((data) => ({
            name: data.name,
            privacyTokenIds: data.privacyTokenIds,
            paymentAddressKeySerialized: get(data, 'nativeToken.accountKeySet.paymentAddressKeySerialized', ''),
            privateKeySerialized: get(data, 'nativeToken.accountKeySet.privateKeySerialized', ''),
            viewingKeySerialized: get(data, 'nativeToken.accountKeySet.viewingKeySerialized', ''),
            nativeToken: {
                name: get(data, 'nativeToken.name', ''),
                symbol: get(data, 'nativeToken.symbol', ''),
                tokenId: get(data, 'nativeToken.tokenId', ''),
            },
        }));
        return accounts;
    }

    getAccountByName(accountName) {
        return this.masterAccount.child.find((item) => item.name === accountName);
    }

    getAccountIndexByName(accountName) {
        return this.masterAccount.child.findIndex((item) => item.name === accountName);
    }

    async createAccount(accountName, shardId = null) {
        try {
            return await this.masterAccount.addAccount(accountName, shardId);
        } catch (error) {
            console.debug('CREATE ACCOUNT ERROR', error);
            return { status: 'ERROR', ...error };
        }
    }

    async importAccount(accountName, privateKey) {
        try {
            await this.masterAccount.importAccount(accountName, privateKey);
            return { status: 'SUCCESS' };
        } catch (error) {
            console.debug('IMPORT ERROR', error);
            return { status: 'ERROR', ...error };
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

    async getFollowingPrivacyToken(accountName, tokenId) {
        const account = this.masterAccount.getAccountByName(accountName);
        const token = await account.getFollowingPrivacyToken(tokenId);
        return token;
    }

    async getFollowingPrivacyTokens(accountName) {
        const account = this.masterAccount.getAccountByName(accountName);
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

export default MasterAccount;
