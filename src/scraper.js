import { JSDOM } from 'jsdom'
import axios from 'axios'
import puppeteer from 'puppeteer'

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})
const cardSlector = '[data-cy=l-card]'
export class Scraper {
  constructor(url) {
    this.url = url
  }

  async getDom(url) {
    const data = await axios.get(url || this.url).then((res) => res.data)
    const dom = new JSDOM(data)
    return dom
  }

  async getLinks(url) {
    const page = await browser.newPage()
    await page.goto(url || this.url)
    await page.waitForSelector(cardSlector)
    const links = await page.$$(`${cardSlector} > a`)
    const res = await Promise.all(
      links.map((handle) => handle.getProperty('href'))
    )
    const hrefs = await Promise.all(res.map((href) => href.jsonValue()))
    await page.close()
    return hrefs
  }
}
