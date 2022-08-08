import puppeteer from 'puppeteer'

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})
const olxSelector = '[data-cy=l-card]'
const trojmiastoSelector = '.listItemFirstPhoto'
export class Scraper {
  constructor(url, trojmiastoUrl) {
    this.url = url
    this.trojmiastoUrl = trojmiastoUrl
  }

  async getOlxLinks(url) {
    const page = await browser.newPage()
    await page.goto(url || this.url)
    await page.waitForSelector(olxSelector)
    const links = await page.$$(`${olxSelector} > a`)
    const res = await Promise.all(
      links.map((handle) => handle.getProperty('href'))
    )
    const hrefs = await Promise.all(res.map((href) => href.jsonValue()))
    await page.close()
    return hrefs
  }

  async getTrojmiastoLinks(url) {
    const page = await browser.newPage()
    await page.goto(url || this.trojmiastoUrl)
    await page.waitForSelector(trojmiastoSelector)
    const links = await page.$$(trojmiastoSelector)
    const res = await Promise.all(
      links.map((handle) => handle.getProperty('href'))
    )
    const hrefs = await Promise.all(res.map((href) => href.jsonValue()))
    await page.close()
    return hrefs
  }

}
