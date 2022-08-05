import { config } from 'dotenv'
import { REST, Routes, SlashCommandBuilder } from 'discord.js'

config()
const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  new SlashCommandBuilder()
    .setName('last')
    .setDescription("Shows the last x apartments' links")
    .addIntegerOption((option) =>
      option
        .setName('count')
        .setDescription('Number of apartments to show')
        .setMinValue(1)
        .setMaxValue(25)
        .setRequired(true)
    )
    .toJSON(),
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
