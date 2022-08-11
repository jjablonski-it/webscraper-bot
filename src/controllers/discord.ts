import { ChannelType, Client, GatewayIntentBits, TextChannel } from 'discord.js'
import { CONFIG } from '../config.js'
import { createJob } from '../services/jobs.js'

let client: Client<boolean>

export const getClient = async () => {
  if (client) return client

  client = new Client({ intents: GatewayIntentBits.Guilds })
  client.once('ready', (a) => {
    console.log(`Logged in as ${a.user?.tag}!`)
  })
  handleCommands()
  await client.login(CONFIG.CLIENT_TOKEN)
  return client
}

function handleCommands() {
  client.on('interactionCreate', async (interaction) => {
    try {
      if (!interaction.isChatInputCommand()) return

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
  return await channel?.send(message)
}
