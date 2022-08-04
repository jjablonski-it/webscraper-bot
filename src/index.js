import { config } from 'dotenv'
import { Client, GatewayIntentBits } from 'discord.js'
config()

const client = new Client({ intents: GatewayIntentBits.Guilds })

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)

  const channel = client.channels.cache.get('1004810730761093152')
  channel.send('Hello, world!')
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
