import { CONFIG } from './config.js'
import { client } from './controllers/discord.js'
import { runWebServer } from './controllers/web.js'
import { registerCommands } from './services/commands.js'

client.guilds.cache.forEach((guild) => {
  console.log(guild.name)
  registerCommands(CONFIG.CLIENT_ID, guild.id)
  guild.channels.cache.forEach((channel) => {
    console.log(' ' + channel.name)
  })
})

runWebServer()
