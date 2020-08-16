import LocalStorageServices from 'app/utils/localStorage'
import * as incognitoJs from 'incognito-js'

let isWASMRunned = false

function loadWASM() {
  return new Promise(async (resolve) => {
    if (isWASMRunned) {
      console.info('WASM was loaded')
      return resolve()
    }

    // eslint-disable-next-line no-undef
    // const go = new Go();
    // let inst;
    // WebAssembly.instantiateStreaming(fetch('wasm/privacy.wasm'), go.importObject).then((result) => {
    //     inst = result.instance;
    //     go.run(inst);
    //     isWASMRunned = true;
    //     resolve();
    // });
    incognitoJs.setConfig({
      mainnet: true,
      // chainURL: 'http://34.70.205.102:9354',
      wasmPath: 'wasm/privacy.wasm',
    })
    incognitoJs.storageService.implement({
      setMethod: (key, data) => {
        return LocalStorageServices.setItem(key, data)
      },
      getMethod: (key) => {
        return LocalStorageServices.getItem(key)
      },
      removeMethod: (key) => LocalStorageServices.removeItem(key),
      namespace: 'WALLET',
    })
    await incognitoJs.goServices.implementGoMethodUseWasm()
    isWASMRunned = true
    return resolve()
  })
}

export default loadWASM
