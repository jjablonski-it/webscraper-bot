import { config } from 'dotenv'
import { Client, GatewayIntentBits } from 'discord.js'

config()
const client = new Client({ intents: GatewayIntentBits.Guilds })

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
  console.log(
    client.channels.cache.at('1004810730761093152')?.send('Hello World!')
  )
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!')
  }
})

// client.login('token');
//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN) //login bot using token
