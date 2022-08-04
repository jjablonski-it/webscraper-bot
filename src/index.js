import { Discord } from './discord.js'
import { Scraper } from './scraper.js'

import { config } from 'dotenv'
config()

const SCRAPE_URL = ''
const GENERAL_CHANELL = '1004810730761093152'

const dc = new Discord(process.env.CLIENT_TOKEN)
