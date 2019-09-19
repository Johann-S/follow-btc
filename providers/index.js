const { getData: getDataBitstamp } = require('./bitstamp')
const { getData: getDataCoinbase } = require('./coinbase')

const providerList = [
  'Bitstamp',
  'Coinbase'
]

const getDataProvider = provider => {
  switch(provider) {
    case 'Bitstamp':
      return getDataBitstamp
    case 'Coinbase':
      return getDataCoinbase
    default:
      return null
  }
}

module.exports = {
  providerList,
  getDataProvider
}
