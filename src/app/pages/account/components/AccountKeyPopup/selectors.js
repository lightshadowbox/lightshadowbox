import { makeSelectAccountSelected } from 'app/redux/incognito/selector'
import { useSelector } from 'react-redux'

export const useKeyListFromRedux = () => {
  const accountSelectedState = useSelector(makeSelectAccountSelected())
  if (!accountSelectedState) {
    return []
  }

  const data = [
    {
      title: 'Your Incognito Address',
      key: accountSelectedState.paymentAddressKeySerialized,
    },
    {
      title: 'Private Key',
      key: accountSelectedState.privateKeySerialized,
    },
    {
      title: 'Public Key',
      key: accountSelectedState.publicKeySerialized,
    },
    {
      title: 'Readonly Key',
      key: accountSelectedState.viewingKeySerialized,
    },
    {
      title: 'Validator Key',
      key: accountSelectedState.validatorKey,
    },
  ]
  return [accountSelectedState.name, data]
}
