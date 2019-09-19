const { getData: getDataBitstamp } = require('./bitstamp')
const { getData: getDataCoinbase } = require('./coinbase')
const { getData: getDataKraken } = require('./kraken')

const providerList = [
  'Bitstamp',
  'Coinbase',
  'Kraken'
]

const getDataProvider = provider => {
  switch(provider) {
    case 'Bitstamp':
      return getDataBitstamp
    case 'Coinbase':
      return getDataCoinbase
    case 'Kraken':
        return getDataKraken
    default:
      return null
  }
}

module.exports = {
  providerList,
  getDataProvider
}
