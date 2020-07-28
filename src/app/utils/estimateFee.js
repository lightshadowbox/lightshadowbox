// export async function getEstimateFeeForNativeToken(from, to, amount, accountWallet) {
//     console.log('Estimating fee ...');
//     let fee;
//     const isPrivacyForNativeToken = true;
//     const isPrivacyForPrivateToken = false;
//     try {
//         fee = await getEstimateFee(from, to, amount, accountWallet, isPrivacyForNativeToken, isPrivacyForPrivateToken, getRpcClient());
//     } catch (e) {
//         throw e;
//     }
//     return fee;
// }

// export async function getEstimateFeeForPToken(from, to, amount, tokenObject, account, isGetTokenFee = false) {
//     let fee;
//     const isPrivacyForNativeToken = false;
//     const isPrivacyForPrivateToken = true;
//     const feeToken = 0;
//     try {
//         fee = await getEstimateFeeForPTokenService(
//             from,
//             to,
//             amount,
//             tokenObject,
//             account,
//             getRpcClient(),
//             isPrivacyForNativeToken,
//             isPrivacyForPrivateToken,
//             feeToken,
//             isGetTokenFee,
//         );
//     } catch (e) {
//         throw e;
//     }
//     return fee;
// }
