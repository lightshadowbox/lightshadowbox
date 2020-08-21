import LocalStorageServices from 'app/utils/localStorage'
import * as incognitoJs from 'incognito-js'

let isWASMRunned = false

function loadWASM() {
  return new Promise(async (resolve) => {
    if (isWASMRunned) {
      console.info('WASM was loaded')
      return resolve()
    }

    console.log('loading chain package...')
    incognitoJs.setConfig({
      chainURL: 'https://fullnode.incognito.best',
      apiURL: 'https://api.incognito.org',
      mainnet: true,
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
