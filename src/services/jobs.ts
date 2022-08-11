import { Job, Prisma } from '@prisma/client'
import { sendMessage } from '../controllers/discord'
import { getExistingLinks, saveJob, saveLinks } from './db'
import { scrapeLinks } from './scraper'

const jobs: Job[] = []

export const createJob = async (jobInput: Prisma.JobCreateInput) => {
  const createdJob = await saveJob(jobInput)
  jobs.push(createdJob)
}

export const runJobs = async () => {
  for (const { name, guildId, active, url, selector } of jobs) {
    try {
      console.log(`Running job ${name} from ${guildId}`)
      if (!active) continue
      const links = await scrapeLinks(url, selector)
      const existingLinks = await getExistingLinks(guildId, name)
      const newLinks = links.filter((link) => !existingLinks.includes(link))
      if (newLinks.length) {
        await saveLinks(guildId, name, newLinks)
        console.log(`Found ${newLinks.length} new links`)
        console.log(newLinks)
        await sendMessage(name, newLinks.join('\n'))
      }
    } catch (e) {
      console.error(`Error running job ${name} from ${guildId}`, e)
    }
  }
}
