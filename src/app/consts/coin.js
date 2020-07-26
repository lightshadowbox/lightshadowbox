const POPULAR_COIN = {
    BTC: 'b832e5d3b1f01a4f0623f7fe91d6673461e1f5d37d91fe78c5c2e6183ff39696',
    ETH: 'ffd8d42dc40a8d166ea4848baf8b5f6e912ad79875f4373070b59392b1756c8f',
    USDT: '716fd1009e2a1669caacc36891e707bfdf02590f96ebd897548e8963c95ebac0',
    BNB: 'b2655152784e8639fa19521a7035f331eea1f1e911b2f3200a507ebb4554387b',
    XMR: 'c01e7dc1d1aba995c19b257412340b057f8ad1482ccb6a9bb0adce61afbf05d4',
};

const POPULAR_COIN_IDS = [POPULAR_COIN.XMR, POPULAR_COIN.BNB, POPULAR_COIN.USDT, POPULAR_COIN.ETH, POPULAR_COIN.BTC];

const PRV = {
    tokenId: '0000000000000000000000000000000000000000000000000000000000000004',
    name: 'Privacy',
    symbol: 'PRV',
    image: '',
    pDecimals: 9,
    isVerified: true,
    totalBalance: null,
    availableBalance: null,
};

const HISTORY = {
    TYPE: {
        DEPOSIT: 1, // same with PRIVATE_TOKEN_HISTORY_ADDRESS_TYPE.DEPOSIT
        WITHDRAW: 2, // same with PRIVATE_TOKEN_HISTORY_ADDRESS_TYPE.WITHDRAW
        SEND: 3, // custom
        RECEIVE: 4, // custom
    },
    STATUS_TEXT: {
        SUCCESS: 'SUCCESS',
        FAILED: 'FAILED',
        PENDING: 'PENDING',
        EXPIRED: 'EXPIRED',
    },
};

export const DEFAULT_FEE_PER_KB_HUMAN_AMOUNT = 0.000000001; // in nano
export const DEFAULT_FEE_PER_KB = DEFAULT_FEE_PER_KB_HUMAN_AMOUNT * 1e9; // in nano
export const MAX_TX_SIZE = 100;
export const MAX_FEE_PER_TX = DEFAULT_FEE_PER_KB * MAX_TX_SIZE;

export default {
    POPULAR_COIN,
    POPULAR_COIN_IDS,
    PRV,
    PRV_ID: PRV.tokenId,
    HISTORY,
};
