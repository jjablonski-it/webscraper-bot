import {config} from 'dotenv'
config()

export const CONFIG = {
  CLIENT_ID: process.env.CLIENT_ID || '',
  CLIENT_TOKEN: process.env.CLIENT_TOKEN || '',
  DATABASE_URL: process.env.DATABASE_URL || '',
  PORT: +(process.env.PORT || 3000),
}
