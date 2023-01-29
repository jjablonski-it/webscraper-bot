import puppeteer from 'puppeteer'

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})

export const scrapeLinks = async (url: string, selector: string): Promise<Array<string>> => {
  const page = await browser.newPage()
  await page.setCacheEnabled(false)
  await page.goto(url)
  await page.waitForSelector(selector, { timeout: 5000 })
  const links = await page.$$(selector)
  const hrefs = (
    await Promise.allSettled(
      links.map(async (link) => {
        const href = await link.getProperty('href')
        return href.jsonValue()
      })
    )
  )
    .filter((result): result is PromiseFulfilledResult<unknown> => result.status === 'fulfilled')
    .map(({ value }) => value as string)
  await page.close()
  return hrefs
}
