import { Job } from '@prisma/client'
import {
  REST,
  Routes,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from 'discord.js'
import { CONFIG } from '../config.js'
import { getJobs } from './db.js'

// type CommandName =
//   | 'ping'
//   | 'create-job'
//   | 'delete-job'
//   | 'disable-job'
//   | 'enable-job'
//   | 'run-job'
//   | 'list-jobs'

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
    .addStringOption((option) =>
      option.setName('name').setDescription('Name of the job').setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('url')
        .setDescription('The URL to scrape')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('selector')
        .setDescription('The query selector to a link')
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName('interval')
        .setDescription('The interval to scrape in minutes')
        .setMinValue(0)
        .setMaxValue(1_440)
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('The channel to send the links to')
    ),
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
  new SlashCommandBuilder()
    .setName('list-jobs')
    .setDescription('Lists all scraper jobs'),
]

export const registerCommands = async (clientId: string, guildId: string) => {
  // TODO add parameters per guild
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
