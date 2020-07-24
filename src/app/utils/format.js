// import BigNumber from 'bignumber.js';

// const balance = (amount, decimals, maxDigits) => {
//     try {
//         const fmt = {
//             decimalSeparator: getDecimalSeparator(),
//             groupSeparator: getGroupSeparator(),
//             groupSize: 3,
//         };
//         const _amount = convertUtil.toHumanAmount(amount, decimals);
//         if (!Number.isFinite(_amount)) throw new Error('Can not format invalid amount');
//         return _amount ? new BigNumber(_amount).toFormat(maxDigits, BigNumber.ROUND_DOWN, fmt) : 0;
//     } catch {
//         return amount;
//     }
// };
