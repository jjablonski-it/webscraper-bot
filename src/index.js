import { Discord } from './discord.js'
import { Scraper } from './scraper.js'

import { config } from 'dotenv'
config()

const URL =
  'https://www.olx.pl/d/nieruchomosci/mieszkania/wynajem/gdansk/q-mieszkanie/?search%5Bfilter_float_price%3Afrom%5D=1000&search%5Bfilter_float_price%3Ato%5D=3300&search%5Bfilter_enum_furniture%5D%5B0%5D=yes&search%5Bfilter_float_m%3Afrom%5D=25&search%5Bfilter_enum_rooms%5D%5B0%5D=two&reason=observed_search'
const scraper = new Scraper(URL)
const dom = await scraper.getDom()
const x = dom.window.document.querySelectorAll('[data-cy=l-card]')
console.log(x)
// const dcClient = new Discord({
//   token: process.env.CLIENT_TOKEN,
//   channelId: '1004810730761093152',
// })
// await dcClient.login()

const cards = await scraper.getCards()
const json = JSON.stringify(cards)

console.log(json);

// console.log(JSON.stringify(cards[0].asElement()))
