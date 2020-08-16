import CryptoJS from 'crypto-js'
import isEmpty from 'lodash/isEmpty'

const toHue = (value) => {
  let hash = 0
  if (value.length === 0) return hash
  for (let i = 0; i < value.length; i += 1) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash)
    hash &= hash
  }
  return hash % 360
}

const getBackgroundColor = (str) => {
  const hex = CryptoJS.MD5(str)
  if (hex) {
    const prefix = Math.abs(toHue(hex.toString()))
    switch (true) {
      case prefix > 0 && prefix <= 45:
        return '#F29B4C'
      case prefix > 45 && prefix <= 95:
        return '#FFD661'
      case prefix > 95 && prefix <= 145:
        return '#2DB84C'
      case prefix > 145 && prefix <= 180:
        return '#21D6AA'
      case prefix > 180 && prefix <= 240:
        return '#22A1D3'
      case prefix > 240 && prefix <= 310:
        return '#AE56D8'
      case prefix > 310 && prefix <= 340:
        return '#EF549B'
      case prefix > 340 && prefix <= 360:
        return '#F25A5A'
      default:
        return '#F25A5A'
    }
  }
  return '#F25A5A'
}

const getName = (name) => {
  const arrChar = []
  if (!isEmpty(name)) {
    const arrName = name.split(' ')
    arrChar.push(arrName[0].charAt(0))
    if (arrName.length > 1) {
      arrChar.push(
        [...arrName]
          .filter((c) => c && c.length > 0)
          .pop()
          .charAt(0),
      )
    }
  }
  return arrChar ? arrChar.join('').toUpperCase() : 'P'
}

const getIconBySymbol = (symbol = '') =>
  `https://s3.amazonaws.com/incognito-org/wallet/cryptocurrency-icons/32@2x/color/${symbol.toLowerCase()}@2x.png`

export { getBackgroundColor, getIconBySymbol, getName }
