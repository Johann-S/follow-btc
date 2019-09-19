const rp = require('request-promise')

const coinbaseUrl = fiat => `https://api.coinbase.com/v2/prices/BTC-${fiat}/buy`
const getData = async (chosenPair) => {
  const fiat = chosenPair.split('btc').pop().toUpperCase()
  const result = await rp(coinbaseUrl(fiat))
  const { data: { amount } } = JSON.parse(result)

  return parseFloat(amount)
}

module.exports = { getData }
