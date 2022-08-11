import { TextChannel } from 'discord.js'
import { CONFIG } from './config.js'
import { getClient } from './controllers/discord.js'
import { runWebServer } from './controllers/web.js'
import { registerCommands } from './services/commands.js'
import { getGuilds, saveGuild } from './services/db.js'

const client = await getClient()
const existingGuilds = await getGuilds()

client.guilds.cache.forEach((guild) => {
  if (!existingGuilds.some((g) => g.id === guild.id)) {
    saveGuild(guild.id)
  }
  registerCommands(CONFIG.CLIENT_ID, guild.id)
  const channel = guild.channels.cache.find(
    (channel) => channel.name === 'bot'
  ) as TextChannel
  channel?.send('Test')
})

runWebServer()
