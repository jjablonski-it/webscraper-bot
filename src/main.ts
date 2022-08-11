import { TextChannel } from 'discord.js'
import { CONFIG } from './config.js'
import { getClient } from './controllers/discord.js'
import { runWebServer } from './controllers/web.js'
import { registerCommands } from './services/commands.js'

const client = await getClient()
client.guilds.cache.forEach((guild) => {
  console.log(guild.name)
  registerCommands(CONFIG.CLIENT_ID, guild.id)
  guild.channels.cache.forEach((channel) => {
    console.log(' ' + channel.name)
  })
  // const channel = guild.channels.cache.find((channel) => channel.type === ChannelType.GuildText)
  const channel = guild.channels.cache.find(
    (channel) => channel.name === 'bot'
  ) as TextChannel
  channel?.send('Test')
})

runWebServer()
