import { Config } from 'configs';
import LocalStorageServices from 'app/utils/localStorage';
import { LOCAL_STORAGE_KEY, MSG } from 'app/consts';
import RouterApp from 'app/routes/consts';
import history from 'app/routes/history';
import { walletInstance } from './wallet';
import MasterAccount from './account';

const loadWallet = async () => {
    try {
        const walletBackup = LocalStorageServices.getItem(LOCAL_STORAGE_KEY.WALLET);
        if (!walletBackup) {
            history.push(RouterApp.rOnboarding);
            return null;
        }
        const wallet = await walletInstance.restore(Config.WALLET_PASS, walletBackup);
        return { wallet, masterAccount: new MasterAccount(wallet) };
    } catch (err) {
        return { error: MSG.RESTORED_WALLET_FAILED };
    }
};

const createWallet = async (encryptedWallet, password = Config.WALLET_PASS) => {
    try {
        const wallet = await walletInstance.createWallet(encryptedWallet, password);
        if (!wallet) {
            return null;
        }
        const strWallet = await walletInstance.backup(password, wallet);
        LocalStorageServices.setItem(LOCAL_STORAGE_KEY.WALLET, strWallet);
        return { wallet, masterAccount: new MasterAccount(wallet) };
    } catch (err) {
        return { error: MSG.CREATED_WALLET_FAILED };
    }
};

export { loadWallet, createWallet };
