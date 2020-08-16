import WALLET_DEV_CONFIG from './wallet.dev'
import WALLET_PROD_CONFIG from './wallet.prod'

const env = process.env.REACT_APP_ENV

export const envNameConfig = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  UAT: 'uat',
  PRODUCTION: 'production',
}

const listConfigs = {
  [envNameConfig.DEVELOPMENT]: {
    API_SERVER: 'https://api.dev',
    ...WALLET_DEV_CONFIG,
  },
  [envNameConfig.STAGING]: {
    API_SERVER: 'https://api.staging',
  },
  [envNameConfig.UAT]: {
    API_SERVER: 'https://api.uat',
  },
  [envNameConfig.PRODUCTION]: {
    API_SERVER: 'https://api.production',
    ...WALLET_PROD_CONFIG,
  },
}

export const Config = listConfigs[env]
export default env
