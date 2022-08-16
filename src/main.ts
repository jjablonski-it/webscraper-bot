import { CONFIG } from './config.js'
import { getClient } from './controllers/discord.js'
import { runWebServer } from './controllers/web.js'
import { registerCommands } from './utils/commands.js'
import { getGuilds, saveGuild } from './services/db.js'
import { runIntervalJobs } from './services/jobs.js'

const client = await getClient()
const existingGuilds = await getGuilds()

client.guilds.cache.forEach((guild) => {
  const guildExists = existingGuilds.some((g) => g.id === guild.id)
  if (!guildExists) {
    saveGuild(guild.id)
  }
  registerCommands(CONFIG.CLIENT_ID, guild.id)
})

runWebServer()
runIntervalJobs()
