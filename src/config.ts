import {config} from 'dotenv'
config()

export const CONFIG = {
  CLIENT_ID: process.env.CLIENT_ID || '',
  CLIENT_TOKEN: process.env.CLIENT_TOKEN || '',
  DATABASE_URL: process.env.DATABASE_URL || '',
  DEFAULT_SCRAPE_INTERVAL: +(process.env.DEFAULT_SCRAPE_INTERVAL || 1000 * 60 * 5),
}
