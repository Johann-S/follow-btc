const rp = require('request-promise')
const { blue, green, red, bold } = require('chalk')
const { prompt } = require('inquirer')

const hundredPercent = 100
const minuteMs = 60000
const pairs = {
  'BTC/€': 'btceur',
  'BTC/$': 'btcusd'
}
const symbolPair = {
  'btceur': '€',
  'btcusd': '$'
}
const bitStampUrl = {
  hour(pair) {
    return `https://www.bitstamp.net/api/v2/ticker_hour/${pair}/`
  }
}

let interval = 1
let chosenPair = pairs['BTC/€']
let symbol = symbolPair['btceur']
let lastTrigger
let lastPrice

const triggerData = async () => {
  const result = await rp(bitStampUrl.hour(chosenPair))
  const data = JSON.parse(result)

  lastTrigger = new Date()
  displayBtcPrice(parseFloat(data.last))
}

const displayBtcPrice = newLastPrice => {
  if (lastPrice) {
    const newPercent = (newLastPrice * 100) / lastPrice

    if (newPercent > hundredPercent) {
      const threshold = newPercent - hundredPercent
      const thresholdString = threshold.toFixed(4)

      console.log(`${blue(`[BTC/${symbol}]`)} Increase of ${green(`${thresholdString}%`)} - New price: ${bold(`${newLastPrice}${symbol}`)}`)
    } else if (hundredPercent > newPercent) {
      const threshold = hundredPercent - newPercent
      const thresholdString = threshold.toFixed(4)

      console.log(`${blue(`[BTC/${symbol}]`)} Decreased of ${red(`-${thresholdString}%`)} - New price: ${bold(`${newLastPrice}${symbol}`)}`)
    } else {
      console.log(`${blue(`[BTC/${symbol}]`)} No changes... Current price: ${bold(`${lastPrice}${symbol}`)}`)
    }
  }

  lastPrice = newLastPrice
}

const main = async () => {
  console.log('Follow BTC evolution on Bitstamp... \n')

  const { pair } = await prompt([{
    type: 'list',
    name: 'pair',
    message: `Pair?`,
    choices: Object.keys(pairs),
    default: 0
  }])

  chosenPair = pairs[pair]
  symbol = symbolPair[chosenPair]

  const { chosenInterval } = await prompt([{
    type: 'input',
    name: 'chosenInterval',
    message: `Refresh interval (minutes):`,
    default: `${interval}min`,
    validate(input) {
      return isNaN(input) ?
        'Please enter a valid number' :
        true
    }
  }])

  interval = chosenInterval * minuteMs
  console.log('\n')

  if (!lastTrigger) {
    triggerData()
  }

  setInterval(() => triggerData(), interval)
}

main()
