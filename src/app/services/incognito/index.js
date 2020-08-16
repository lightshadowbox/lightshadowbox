import { LOCAL_STORAGE_KEY } from 'app/consts'
import LocalStorageServices from 'app/utils/localStorage'
import { Config } from 'configs'

import loadWASM from '../wasm'
import MasterAccount from './account'
import { walletInstance } from './wallet'

export const IncognitoInstance = {}
export let masterAccount = null
let semaphore = false
// const getInstance = async () => {
//     console.log(instance && !semaphore);

//     if (instance && !semaphore) {
//         semaphore = true; // mark awaited constructor
//         const walletBackup = LocalStorageServices.getItem(LOCAL_STORAGE_KEY.WALLET);
//         let wallet;
//         if (!walletBackup) {
//             wallet = await walletInstance.createWallet(Config.WALLET_PASS, 'ABC');
//         } else {
//             wallet = await walletInstance.restore(Config.WALLET_PASS, walletBackup);
//         }
//         instance.wallet = wallet;
//         instance.masterAccount = new MasterAccount(wallet);
//     }
//     console.log(instance);

//     return { ...instance };
// };

const loadIncognito = async (password) => {
  if (IncognitoInstance && !semaphore) {
    await loadWASM()
    semaphore = true // mark awaited constructor
    const walletBackup = LocalStorageServices.getItem(LOCAL_STORAGE_KEY.WALLET)
    const wallet = await walletInstance.restore(password, walletBackup)
    IncognitoInstance.wallet = wallet
    masterAccount = new MasterAccount(wallet)
    IncognitoInstance.masterAccount = masterAccount
  }
}

export const createIncognito = async (walletName) => {
  await loadWASM()
  semaphore = true // mark awaited constructor
  const wallet = await walletInstance.createWallet(Config.WALLET_PASS, walletName || Config.WALLET_NAME)
  const backupWalletString = wallet.backup(Config.WALLET_PASS)
  LocalStorageServices.setItem(LOCAL_STORAGE_KEY.WALLET, backupWalletString)
  IncognitoInstance.wallet = wallet
  masterAccount = new MasterAccount(wallet)
  IncognitoInstance.masterAccount = masterAccount
}

export default loadIncognito
