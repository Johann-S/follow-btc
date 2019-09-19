const rp = require('request-promise')

const bitstampUrl = pair => `https://www.bitstamp.net/api/v2/ticker_hour/${pair}/`
const getData = async (chosenPair) => {
  const result = await rp(bitstampUrl(chosenPair))
  const { last } = JSON.parse(result)

  return parseFloat(last)
}

module.exports = { getData }
