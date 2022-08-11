import { Client, GatewayIntentBits, TextChannel } from 'discord.js'
import { CONFIG } from '../config.js'
import { getExistingLinks } from '../services/db.js'

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
    if (!interaction.isChatInputCommand()) return

    if (interaction.commandName === 'ping') {
      const apartments = await getExistingLinks()
      await interaction.reply(
        `Pong! ${apartments.length} apartments found so far`
      )
    }

    if (interaction.commandName === 'last') {
      const count = interaction.options.getInteger('count') || 1
      const apartments = await getExistingLinks()
      await interaction.reply(apartments.slice(-count).join('\n').slice(-2000))
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

// export const sendMessageToMainChannel = async (message: string) => {
//   const channel = client.channels.cache.find(channel => channel.type)
