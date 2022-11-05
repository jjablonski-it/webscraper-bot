import { Job, Prisma } from '@prisma/client'
import { sendMessage } from '../controllers/discord.js'
import { cleanQueryParams } from '../utils/cleanQueryParams.js'
import { getJobs, getLinks, saveJob, saveLinks, updateJob } from './db.js'
import { jobOutputMessage } from './message.js'
import { scrapeLinks } from './scraper.js'

const isDev = process.env.NODE_ENV === 'development'

export const createJob = async (jobInput: Prisma.JobCreateInput) => {
  await saveJob(jobInput)
}

export const runJob = async (job: Job) => {
  const { name, guildId, url, selector, channelId } = job
  console.log(`Running job ${name} for guild ${guildId}`)

  try {
    const shouldClean = job.clean
    const linksRaw = await scrapeLinks(url, selector)
    const links = shouldClean ? linksRaw.map(cleanQueryParams) : linksRaw
    const existingLinks = await getLinks(guildId, channelId)
    const newLinks = [...new Set(links.filter((link) => !existingLinks.includes(link)))]
    if (newLinks.length) {
      await saveLinks(guildId, name, newLinks)
      const message = jobOutputMessage({
        jobName: name,
        message: `Found ${newLinks.length} new links\n${newLinks.join('\n')}`,
      })
      await sendMessage(channelId, message)
      await updateJob(guildId, name, { failuresInARow: 0 })
    }
  } catch (e) {
    console.error(`Error running job ${name} from ${guildId}`, e)
    const failuresInARow = job.failuresInARow + 1
    if (failuresInARow >= 3) {
      await updateJob(guildId, name, { active: false })
      await sendMessage(
        channelId,
        jobOutputMessage({ jobName: name, message: 'Job disabled due to too many failures in a row' })
      )
    }
    await updateJob(guildId, name, { failuresInARow })
  }
}

export const runJobs = async (jobs: Job[]) => {
  for (const job of jobs) {
    if (!job.active) continue
    await runJob(job)
  }
}

export const runIntervalJobs = async () => {
  let i = 0
  const run = async () => {
    const jobs: Job[] = await getJobs()
    const jobsToRun = jobs.filter(({ interval, active }) => i % interval === 0 && active)
    console.log(`${jobsToRun.length} jobs in queue`)
    await runJobs(jobsToRun)
    i++
  }
  run()
  const intervalId = setInterval(run, 1000 * (isDev ? 10 : 60))
  return intervalId
}
