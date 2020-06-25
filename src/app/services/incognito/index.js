import LocalStorageServices from 'app/utils/localStorage';
import loadWASM from '../wasm';
import { MasterAccount } from './account';
import { walletInstance } from './wallet';

const init = async () => {
    try {
        console.log('loadWASM');
        await loadWASM();
        const walletBackup = LocalStorageServices.getItem('WALLET');
        let wallet = null;
        if (walletBackup) {
            wallet = await walletInstance.restore('1234', walletBackup);
        } else {
            wallet = await walletInstance.createWallet('WALLET_ABC', '1234');
            const strWallet = await walletInstance.backup('1234', wallet);
            LocalStorageServices.setItem('WALLET', strWallet);
        }
        return {
            wallet,
            masterAccount: new MasterAccount(wallet),
        };
    } catch (err) {
        console.debug(err);
        return { error: err };
    }
};
export default init;
