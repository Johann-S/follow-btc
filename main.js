const { blue, green, red, bold } = require('chalk')
const { prompt } = require('inquirer')

const { providerList, getDataProvider } = require('./providers/index')

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

let interval = 1
let chosenPair = pairs['BTC/€']
let symbol = symbolPair['btceur']
let lastTrigger
let lastPrice
let getData

const triggerData = async () => {
  const last = await getData(chosenPair)

  lastTrigger = new Date()
  displayBtcPrice(last)
}

const updateTitle = title => {
  if (process.platform === 'win32') {
		process.title = title;
	} else {
		process.stdout.write(`\x1b]2;${title}\x1b\x5c`);
	}
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

  updateTitle(`Follow BTC evolution... Current price: ${newLastPrice}${symbol}`)
  lastPrice = newLastPrice
}

const main = async () => {
  updateTitle('Follow BTC evolution...')
  console.log('Follow BTC evolution... \n')

  const { providerName } = await prompt([{
    type: 'list',
    name: 'providerName',
    message: `Provider?`,
    choices: providerList,
    default: 0
  }])

  getData = getDataProvider(providerName)

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
