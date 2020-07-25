import BigNumber from 'bignumber.js';
import moment from 'moment';
import floor from 'lodash/floor';

const AMOUNT_MAX_DIGITS = 4;

const pDecimalBalance = (amount, pDecimals) => {
    try {
        const pAmount = BigNumber(amount).dividedBy(BigNumber(10).pow(pDecimals)).toNumber();
        return pAmount;
    } catch {
        return amount;
    }
};

const formatAmount = (_amount) => {
    let maxDigits = AMOUNT_MAX_DIGITS;
    if (_amount > 0 && _amount < 1) {
        maxDigits = 5;
    }
    if (_amount > 1) {
        maxDigits = 4;
    }
    if (_amount > 1e3) {
        maxDigits = 2;
    }
    if (_amount > 1e5) {
        maxDigits = 0;
    }
    try {
        return floor(_amount, maxDigits);
    } catch (error) {
        return _amount;
    }
};

const nanoBalance = (pAmount, pDecimals) => {
    try {
        // const amount = BigNumber(pAmount).multipliedBy(pDecimals).toNumber();
        // return amount;
        const decisionRate = Number(pDecimals) ? 10 ** Number(pDecimals) : 1;
        return BigNumber(pAmount).multipliedBy(BigNumber(decisionRate)).toNumber();
    } catch {
        return pAmount;
    }
};

const formatDateTime = (dateTime, formatPattern) => moment(dateTime).format(formatPattern || 'DD MMM hh:mm A');

export { pDecimalBalance, formatAmount, nanoBalance, formatDateTime };
