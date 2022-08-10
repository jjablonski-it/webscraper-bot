import { Client, GatewayIntentBits, TextChannel } from 'discord.js'
import { CONFIG } from '../config.js'
import { getExistingLinks } from '../services/db.js'

export const client = new Client({ intents: GatewayIntentBits.Guilds })

client.once('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`)
})

await client.login(CONFIG.CLIENT_TOKEN)

const handleCommands = () => {
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

const sendMessage = async (channelId: string, message: string) => {
  const channel = client.channels.cache.get(channelId) as TextChannel
  // TODO check if TextChannel
  return await channel?.send(message)
}
