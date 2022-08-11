import { REST, Routes, SlashCommandBuilder } from 'discord.js'
import { CONFIG } from '../config'

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  new SlashCommandBuilder()
    .setName('last')
    .setDescription("Shows the last x apartments' links")
    .addIntegerOption((option) =>
      option
        .setName('count')
        .setDescription('Number of apartments to show')
        .setMinValue(1)
        .setMaxValue(25)
        .setRequired(false)
    )
    .toJSON(),
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
        .setDescription('The link CSS selector to use')
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName('interval')
        .setDescription('The interval to scrape in minutes')
        .setMinValue(1)
        .setMaxValue(1_440)
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('The channel to send the links to')
    ),
  new SlashCommandBuilder()
    .setName('run-job')
    .setDescription('Runs a scraper job')
    .addStringOption((option) =>
      option.setName('name').setDescription('Name of the job').setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('list-jobs')
    .setDescription('Lists all scraper jobs'),
  // new SlashCommandBuilder()
  // .setName('stop-job')
  // .setDescription('Stops a scraper job')
  // .addStringOption((option) =>
  //   option.setName('name').setDescription('Name of the job').setRequired(true)
  // )
  // .addChannelOption((option) =>
  //   option
  //     .setName('channel')
  //     .setDescription('The channel to send the links to')
  // ),
  // new SlashCommandBuilder()
  // .setName('delete-job')
  // .setDescription('Deletes a scraper job')
]

export const registerCommands = async (clientId: string, guildId: string) => {
  // TODO add parameters per guild
  const rest = new REST({ version: '10' }).setToken(CONFIG.CLIENT_TOKEN)
  try {
    console.log(`Registering commands for ${guildId}`)
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    })
  } catch (error) {
    console.error(error)
  }
}
