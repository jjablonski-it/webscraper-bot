import { Job } from '@prisma/client'
import { REST, Routes, SlashCommandBuilder, SlashCommandStringOption } from 'discord.js'
import { CONFIG } from '../config.js'
import { getJobs } from '../services/db.js'

// type CommandName =
//   | 'ping'
//   | 'create-job'
//   | 'delete-job'
//   | 'disable-job'
//   | 'enable-job'
//   | 'run-job'
//   | 'list-jobs'

const intervalOptions = [
  { name: '5 minutes', value: 5 },
  { name: '10 minutes', value: 10 },
  { name: '15 minutes', value: 15 },
  { name: '30 minutes', value: 30 },
  { name: '1 hour', value: 60 },
  { name: '2 hours', value: 120 },
  { name: '6 hours', value: 360 },
  { name: '12 hours', value: 720 },
  { name: '1 day', value: 1_440 },
]

const existingJobOption = (jobs: Job[]) => (option: SlashCommandStringOption) =>
  option
    .setName('name')
    .setDescription('Name of the job')
    .setRequired(true)
    .addChoices(...jobs.map((job) => ({ name: job.name, value: job.name })))

const getCommands = (jobs: Job[]) => [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  new SlashCommandBuilder()
    .setName('create-job')
    .setDescription('Creates a new scraper job')
    .addStringOption((option) => option.setName('name').setDescription('Name of the job').setRequired(true))
    .addStringOption((option) => option.setName('url').setDescription('The URL to scrape').setRequired(true))
    .addStringOption((option) =>
      option.setName('selector').setDescription('The query selector to a link').setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName('interval')
        .setDescription('The interval to scrape in minutes')
        .setMinValue(0)
        .setMaxValue(1_440)
        .addChoices(...intervalOptions)
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option.setName('active').setDescription('Whether the job is active').setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName('clean')
        .setDescription('Whether the query params should be removed from the url')
        .setRequired(false)
    )
    .addChannelOption((option) => option.setName('channel').setDescription('The channel to send the links to')),
  new SlashCommandBuilder()
    .setName('delete-job')
    .setDescription('Deletes a scraper job')
    .addStringOption(existingJobOption(jobs)),
  new SlashCommandBuilder()
    .setName('disable-job')
    .setDescription('Disables a scraper job')
    .addStringOption(existingJobOption(jobs.filter((job) => job.active))),
  new SlashCommandBuilder()
    .setName('enable-job')
    .setDescription('Enables a scraper job')
    .addStringOption(existingJobOption(jobs.filter((job) => !job.active))),
  new SlashCommandBuilder()
    .setName('run-job')
    .setDescription('Runs a scraper job')
    .addStringOption(existingJobOption(jobs)),
  new SlashCommandBuilder().setName('list-jobs').setDescription('Lists all scraper jobs'),
  new SlashCommandBuilder()
    .setName('update-job')
    .setDescription('Edits a scraper job')
    .addStringOption(existingJobOption(jobs))
    .addStringOption((option) => option.setName('url').setDescription('The URL to scrape').setRequired(false))
    .addStringOption((option) =>
      option.setName('selector').setDescription('The query selector to a link').setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName('interval')
        .setDescription('The interval to scrape in minutes. 0 for manual')
        .setMinValue(0)
        .setMaxValue(1_440)
        .addChoices(...intervalOptions)
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName('clean')
        .setDescription('Whether the query params should be removed from the url')
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option.setName('active').setDescription('Whether the job is active').setRequired(false)
    )
    .addChannelOption((option) => option.setName('channel').setDescription('The channel to send the links to')),
  new SlashCommandBuilder().setName('stats').setDescription('Shows some stats about the bot'),
]

export const registerCommands = async (clientId: string, guildId: string) => {
  const rest = new REST({ version: '10' }).setToken(CONFIG.CLIENT_TOKEN)
  try {
    console.log(`Registering commands for ${guildId}`)
    const jobs = await getJobs(guildId)
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: getCommands(jobs),
    })
  } catch (error) {
    console.error(error)
  }
}
