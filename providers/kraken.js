const rp = require('request-promise')

const krakenUrl = pair => `https://api.kraken.com/0/public/Ticker?pair=${pair}`
const krakenPairs = {
  btceur: 'XXBTZEUR',
  btcusd: 'XXBTZUSD'
}
const getData = async (chosenPair) => {
  const krakenPair = krakenPairs[chosenPair]
  const response = await rp(krakenUrl(krakenPair))

  // See: https://www.kraken.com/features/api#get-ticker-info
  const {
    result: {
      [krakenPair]: { c }
    }
  } = JSON.parse(response)

  return parseFloat(c[0])
}

module.exports = { getData }
