import { config } from 'dotenv'
import { REST, Routes } from 'discord.js'

config()
const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
]

console.log('CLIENT_TOKEN:', process.env.CLIENT_TOKEN)
const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN)

;(async () => {
  try {
    console.log('Started refreshing application (/) commands.')

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      {
        body: commands,
      }
    )

    console.log('Successfully reloaded application (/) commands.')
  } catch (error) {
    console.error(error)
  }
})()
