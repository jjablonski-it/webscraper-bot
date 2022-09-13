import { ChannelType, Client, GatewayIntentBits, TextChannel } from 'discord.js'
import { CONFIG } from '../config.js'
import { registerCommands } from '../utils/commands.js'
import {
  deleteJob,
  getJob,
  getJobs,
  saveGuild,
  updateJob,
} from '../services/db.js'
import { createJob, runJob } from '../services/jobs.js'
import { errorMessage, jobActionMessage } from '../services/message.js'

let client: Client<boolean>

export const getClient = async () => {
  if (client) return client

  client = new Client({ intents: GatewayIntentBits.Guilds })
  handleEvents(client)
  handleCommands(client)
  await client.login(CONFIG.CLIENT_TOKEN)
  return client
}

function handleEvents(client: Client<boolean>) {
  client.once('ready', (a) => {
    console.log(`Logged in as ${a.user?.tag}!`)
  })
  client.on('guildCreate', async (guild) => {
    console.log(`Joined guild ${guild.name}`)
    await saveGuild(guild.id)
  })
}

function handleCommands(client: Client<boolean>) {
  client.on('interactionCreate', async (interaction) => {
    try {
      if (!interaction.isChatInputCommand()) return
      const guildId = interaction.guild?.id
      if (!guildId) {
        await interaction.reply(errorMessage('Guild not found'))
        return
      }

      if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!')
      }

      if (interaction.commandName === 'create-job') {
        const name = interaction.options.getString('name')
        const url = interaction.options.getString('url')
        const selector = interaction.options.getString('selector')
        const interval = interaction.options.getInteger('interval')
        const active = interaction.options.getBoolean('active') ?? true
        const clean = interaction.options.getBoolean('clean') ?? true
        const channel =
          interaction.options.getChannel('channel') || interaction.channel

        if (!name || !url || !selector || (!interval && interval !== 0)) {
          await interaction.reply(errorMessage('Missing required options'))
          return
        }
        if (channel?.type !== ChannelType.GuildText) {
          await interaction.reply(
            errorMessage('Channel must be a text channel')
          )
          return
        }
        const nameExists = await getJob(guildId, name)
        if (nameExists) {
          await interaction.reply(
            errorMessage('Job with that name already exists')
          )
        }

        await createJob({
          name,
          url,
          selector,
          interval,
          active,
          clean,
          channelId: channel.id,
          Guild: {
            connect: {
              id: interaction.guild?.id,
            },
          },
        })

        await interaction.reply(
          jobActionMessage({
            jobName: name,
            action: 'created in ',
            postfix: channel?.toString(),
          })
        )
        registerCommands(CONFIG.CLIENT_ID, guildId)
      }

      if (interaction.commandName === 'update-job') {
        const name = interaction.options.getString('name')
        const url = interaction.options.getString('url')
        const selector = interaction.options.getString('selector')
        const interval = interaction.options.getInteger('interval')
        const active = interaction.options.getBoolean('active')
        const channel =
          interaction.options.getChannel('channel') || interaction.channel

        if (!name) {
          await interaction.reply(errorMessage('Missing required options'))
          return
        }
        if (channel?.type !== ChannelType.GuildText) {
          await interaction.reply(
            errorMessage('Channel must be a text channel')
          )
          return
        }
        const nameExists = await getJob(guildId, name)
        if (!nameExists) {
          await interaction.reply(
            errorMessage('Job with that name does not exists')
          )
        }

        await updateJob(guildId, name, {
          ...(name && { name }),
          ...(url && { url }),
          ...(selector && { selector }),
          ...(interval && { interval }),
          ...(active && { active }),
          ...(channel && { channelId: channel.id }),
        })

        await interaction.reply(
          jobActionMessage({
            jobName: name,
            action: 'updated',
          })
        )
        registerCommands(CONFIG.CLIENT_ID, guildId)
      }

      if (interaction.commandName === 'delete-job') {
        const name = interaction.options.getString('name')
        if (!name) {
          await interaction.reply(errorMessage('Missing required options'))
          return
        }
        await deleteJob(guildId, name)
        await interaction.reply(
          jobActionMessage({ jobName: name, action: 'deleted' })
        )
        registerCommands(CONFIG.CLIENT_ID, guildId)
      }

      if (interaction.commandName === 'disable-job') {
        const name = interaction.options.getString('name')
        if (!name) {
          await interaction.reply(errorMessage('Missing required options'))
          return
        }
        await updateJob(guildId, name, { active: false })
        await interaction.reply(
          jobActionMessage({ jobName: name, action: 'disabled' })
        )
        registerCommands(CONFIG.CLIENT_ID, guildId)
      }

      if (interaction.commandName === 'enable-job') {
        const name = interaction.options.getString('name')
        if (!name) {
          await interaction.reply(errorMessage('Missing required options'))
          return
        }
        await updateJob(guildId, name, { active: true })
        await interaction.reply(
          jobActionMessage({ jobName: name, action: 'enabled' })
        )
        registerCommands(CONFIG.CLIENT_ID, guildId)
      }

      if (interaction.commandName === 'list-jobs') {
        const jobs = await getJobs(guildId)
        await interaction.reply(
          `${jobs.length} job${jobs.length > 1 ? 's' : ''} found: \n${jobs
            .map(
              ({ name, url, selector, interval, active }) =>
                `**${name}** \n url: ${url} \n selector: \`${selector}\` \n interval: \`${interval}\` \n active: \`${active}\``
            )
            .join('\n\n')}`
        )
      }

      if (interaction.commandName === 'run-job') {
        const name = interaction.options.getString('name')
        if (!name) {
          await interaction.reply(errorMessage('Missing required options'))
          return
        }
        const job = await getJob(guildId, name)
        if (!job) {
          await interaction.reply(errorMessage('Job not found'))
          return
        }
        await interaction.reply(
          jobActionMessage({ jobName: name, action: 'running' })
        )
        runJob(job)
      }

      if (interaction.commandName === 'stats') {
        const jobs = await getJobs(guildId, true)
        const data = jobs.map(({ name, links }) => ({
          name,
          links: links.length,
        }))
        await interaction.reply(
          data.map(({ name, links }) => `**${name}**: ${links}`).join('\n')
        )
      }
    } catch (e) {
      console.error(
        `Error while handling interaction ${
          interaction.isChatInputCommand()
            ? interaction.commandName
            : interaction
        }`,
        e
      )
      if (interaction.isChatInputCommand())
        await interaction.reply(
          errorMessage('Error while handling interaction')
        )
    }
  })
}

export const sendMessage = async (channelId: string, message: string) => {
  console.log(`Sending message to ${channelId}`)
  const channel = client.channels.cache.get(channelId) as TextChannel
  if (!channel.isTextBased())
    throw new Error(`Channel ${channelId} is not a text channel`)
  return await channel?.send(message.substring(0, 2000))
}
