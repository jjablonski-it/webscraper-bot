import { ChannelType, Client, GatewayIntentBits, TextChannel } from 'discord.js'
import { CONFIG } from '../config.js'
import { getJob, getJobs, saveGuild } from '../services/db.js'
import { createJob, runJob } from '../services/jobs.js'

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

      if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!')
      }

      if (interaction.commandName === 'create-job') {
        const name = interaction.options.getString('name')
        const url = interaction.options.getString('url')
        const selector = interaction.options.getString('selector')
        const interval = interaction.options.getInteger('interval')
        const channel =
          interaction.options.getChannel('channel') || interaction.channel

        if (!name || !url || !selector || !interval) {
          await interaction.reply('Missing required options')
          return
        }
        if (channel?.type !== ChannelType.GuildText) {
          await interaction.reply('Channel must be a text channel')
          return
        }

        await createJob({
          name,
          url,
          selector,
          interval,
          channelId: channel.id,
          active: true,
          Guild: {
            connect: {
              id: interaction.guild?.id,
            },
          },
        })
        await interaction.reply(`Job ${name} created in ${channel?.toString()}`)
      }

      if (interaction.commandName === 'list-jobs') {
        if (!guildId) {
          await interaction.reply('Guild not found')
          return
        }
        const jobs = await getJobs()
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
          await interaction.reply('Missing required options')
          return
        }
        if (!guildId) {
          await interaction.reply('Guild not found')
          return
        }
        const job = await getJob(interaction.guild?.id!, name)
        await runJob(job)
      }
    } catch (e) {
      console.error('Error while handling interaction', interaction, e)
    }
  })
}

export const sendMessage = async (channelId: string, message: string) => {
  console.log(`Sending message to ${channelId}: ${message}`)
  const channel = client.channels.cache.get(channelId) as TextChannel
  if (!channel.isTextBased())
    throw new Error(`Channel ${channelId} is not a text channel`)
  return await channel?.send(message.substring(0, 2000))
}
