import { sendMessage } from '../controllers/discord'
import { getExistingLinks, saveJob, saveLinks } from './db'
import { scrapeLinks } from './scraper'

export type Job = {
  name: string
  url: string
  selector: string
  interval: number
  channel: string
  active: boolean
  guild: string
}

const jobs: Job[] = []

export const createJob = async (job: Job) => {
  await saveJob(job)
  jobs.push(job)
}

export const runJobs = async () => {
  for (const { name, guild, active, url, selector } of jobs) {
    try {
      console.log(`Running job ${name} from ${guild}`)
      if (!active) continue
      const links = await scrapeLinks(url, selector)
      const existingLinks = await getExistingLinks(guild, name)
      const newLinks = links.filter((link) => !existingLinks.includes(link))
      if (newLinks.length) {
        await saveLinks(guild, name, newLinks)
        console.log(`Found ${newLinks.length} new links`)
        console.log(newLinks)
        await sendMessage(name, newLinks.join('\n'))
      }
    } catch (e) {
      console.error(`Error running job ${name} from ${guild}`, e)
    }
  }
}
