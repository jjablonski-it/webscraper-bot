import { Job, Prisma } from '@prisma/client'
import { sendMessage } from '../controllers/discord'
import { getExistingLinks, saveJob, saveLinks } from './db'
import { scrapeLinks } from './scraper'

const jobs: Job[] = []

export const createJob = async (jobInput: Prisma.JobCreateInput) => {
  const createdJob = await saveJob(jobInput)
  jobs.push(createdJob)
}

export const runJob = async (job: Job) => {
  const { name, guildId, url, selector, channelId } = job
  try {
    const links = await scrapeLinks(url, selector)
    const existingLinks = await getExistingLinks(guildId, name)
    const newLinks = links.filter((link) => !existingLinks.includes(link))
    if (newLinks.length) {
      await saveLinks(guildId, name, newLinks)
      console.log(`Found ${newLinks.length} new links`)
      console.log(newLinks)
      await sendMessage(channelId, newLinks.join('\n'))
    }
  } catch (e) {
    console.error(`Error running job ${name} from ${guildId}`, e)
  }
}

export const runJobs = async () => {
  for (const job of jobs) {
    console.log(`Running job ${job.name} from ${job.guildId}`)
    if (!job.active) continue
    await runJob(job)
  }
}
