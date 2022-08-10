import puppeteer from 'puppeteer'

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})

export const scrapeLinks = async (url: string, selector: string): Promise<Array<string>> => {
  console.log('scraping links', url, selector)
  const page = await browser.newPage()
  await page.setCacheEnabled(false)
  await page.goto(url)
  await page.waitForSelector(selector)
  const links = await page.$$(selector)
  const res = await Promise.all(
    links.map((handle) => handle.getProperty('href'))
  )
  const hrefs = await Promise.all(res.map((href) => href.jsonValue())) as string[]
  await page.close()
  return hrefs
}
