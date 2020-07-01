import { LOCAL_STORAGE_KEY } from 'app/consts';
import LocalStorageServices from 'app/utils/localStorage';
import { Config } from 'configs';
import MasterAccount from './account';
import { walletInstance } from './wallet';

// const loadWallet = async () => {
//     try {
//         const walletBackup = LocalStorageServices.getItem(LOCAL_STORAGE_KEY.WALLET);
//         if (!walletBackup) {
//             history.push(RouterApp.rOnboarding);
//             return null;
//         }
//         const wallet = await walletInstance.restore(Config.WALLET_PASS, walletBackup);
//         return { wallet, masterAccount: new MasterAccount(wallet) };
//     } catch (err) {
//         return { error: MSG.RESTORED_WALLET_FAILED };
//     }
// };

// const createWallet = async (encryptedWallet, password = Config.WALLET_PASS) => {
//     try {
//         const wallet = await walletInstance.createWallet(encryptedWallet, password);
//         if (!wallet) {
//             return null;
//         }
//         const strWallet = await walletInstance.backup(password, wallet);
//         LocalStorageServices.setItem(LOCAL_STORAGE_KEY.WALLET, strWallet);
//         return { wallet, masterAccount: new MasterAccount(wallet) };
//     } catch (err) {
//         return { error: MSG.CREATED_WALLET_FAILED };
//     }
// };

let instance = {};
let semaphore = false;
const getInstance = async () => {
    console.log(instance && !semaphore);

    if (instance && !semaphore) {
        semaphore = true; // mark awaited constructor
        const walletBackup = LocalStorageServices.getItem(LOCAL_STORAGE_KEY.WALLET);
        let wallet;
        if (!walletBackup) {
            wallet = await walletInstance.createWallet(Config.WALLET_PASS, 'ABC');
        } else {
            wallet = await walletInstance.restore(Config.WALLET_PASS, walletBackup);
        }
        instance.wallet = wallet;
        instance.masterAccount = new MasterAccount(wallet);
    }
    console.log(instance);

    return { ...instance };
};

export default getInstance;
