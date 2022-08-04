import { Discord } from './discord.js'
import { Scraper } from './scraper.js'
import { config } from 'dotenv'
import { addApartments, getExistingLinks } from './db.js'
config()

const scraper = new Scraper(process.env.SCRAPE_URL)

const dcClient = new Discord({
  token: process.env.CLIENT_TOKEN,
  channelId: '1004810730761093152',
})
await dcClient.login()

const main = async () => {
  const scrapedLinks = await scraper.getLinks()
  const currentLinks = await getExistingLinks()

  const newLinks = scrapedLinks.filter((link) => !currentLinks.includes(link))
  await addApartments(newLinks)

  const message = `${newLinks.length} new apartment${
    newLinks.length > 1 ? 's' : ''
  }: \n ${newLinks.join(', ')}`

  if (newLinks.length) {
    dcClient.sendMessage(message.substring(0, 2000))
    console.log(message)
  } else {
    console.log('No new apartments')
  }
}

setInterval(main, process.env.SCRAPE_INTERVAL || 1000 * 60)
console.log(`Scraping every ${process.env.SCRAPE_INTERVAL / 1000} seconds`)
