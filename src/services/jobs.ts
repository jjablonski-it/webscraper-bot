import { Job, Prisma } from '@prisma/client'
import { ProtocolError, PuppeteerErrors } from 'puppeteer'
import { sendMessage } from '../controllers/discord'
import { getExistingLinks, getJobs, saveJob, saveLinks } from './db'
import { scrapeLinks } from './scraper'

const jobs: Job[] = await getJobs()

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

    let message: string
    if (newLinks.length) {
      await saveLinks(guildId, name, newLinks)
      message = `Found ${newLinks.length} new links:\n${newLinks.join('\n')}`
    } else {
      message = 'No new links found'
    }

    message = `Job **${name}**:\n${message}`
    console.log(message)
    await sendMessage(channelId, message)
  } catch (e) {
    console.error(`Error running job ${name} from ${guildId}`, e)
    if (e instanceof ProtocolError) {
      await sendMessage(
        channelId,
        `Job **${name}** failed:\n${e.originalMessage}`
      )
    }
  }
}

export const runJobs = async () => {
  for (const job of jobs) {
    console.log(`Running job ${job.name} from ${job.guildId}`)
    if (!job.active) continue
    await runJob(job)
  }
}

export const runIntervalJobs = async () => {
  let i = 0
  const run = async () => {
    const jobsToRun = jobs.filter(({ interval }) => i % interval === 0)
    console.log(`${i}: Running ${jobsToRun.length} jobs`)
    for (const job of jobsToRun) {
      if (!job.active) continue
      await runJob(job)
    }
    i++
  }
  run()
  const intervalId = setInterval(run, 1000 * 60)
  return intervalId
}
