import { Discord } from './discord.js'
import { Scraper } from './scraper.js'
import { config } from 'dotenv'
import { addApartments, getExistingLinks } from './db.js'
import http from 'http'
config()

const PORT = process.env.PORT || 3000

// server create
const server = http.createServer((req, res) => {
  res.write('OK')
  res.end()
})

const scraper = new Scraper(process.env.SCRAPE_URL, process.env.SCRAPE_TROJMIASTO_URL)

const dcClient = new Discord({
  token: process.env.CLIENT_TOKEN,
  channelId: '1004810730761093152',
})
await dcClient.registerCommands()
await dcClient.login()

const main = async () => {
  try {
    const olxLinks = await scraper.getOlxLinks().catch(() => [])
    const trojmaistoLinks = await scraper.getTrojmiastoLinks().catch(() => [])
    const scrapedLinks = [...olxLinks, ...trojmaistoLinks]

    const currentLinks = await getExistingLinks()

    const newLinks = scrapedLinks.filter((link) => !currentLinks.includes(link))
    await addApartments(newLinks)

    const message = `${newLinks.length} new apartment${
      newLinks.length > 1 ? 's' : ''
    }: \n ${newLinks.join('\n')}`

    if (newLinks.length) {
      dcClient.sendMessage(message.substring(0, 2000))
      console.log(message)
    } else {
      console.log('No new apartments')
    }
  } catch (e) {
    console.error('Something went wrong:', e)
  }
}

main()
setInterval(main, process.env.SCRAPE_INTERVAL || 1000 * 60)
// dcClient.sendMessage('Bot started')

console.log(`Scraping every ${process.env.SCRAPE_INTERVAL / 1000} seconds`)
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
