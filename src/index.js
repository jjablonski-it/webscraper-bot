import { Discord } from './discord.js'
import { Scraper } from './scraper.js'

import { config } from 'dotenv'
config()

const SCRAPE_URL = ''
const scraper = new Scraper(SCRAPE_URL)

const dcClient = new Discord({
  token: process.env.CLIENT_TOKEN,
  channelId: '1004810730761093152',
})
await dcClient.login()
