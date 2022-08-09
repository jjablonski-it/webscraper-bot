import { REST, Routes, SlashCommandBuilder } from 'discord.js'
import { CONFIG } from './config'

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
        .setRequired(false)
    )
    .toJSON(),
]

export const registerCommands = async (clientId: string, guildId: string) => {
  const rest = new REST({ version: '10' }).setToken(CONFIG.CLIENT_TOKEN)
  try {
    console.log('Started refreshing application (/) commands.')

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    })

    console.log('Successfully reloaded application (/) commands.')
  } catch (error) {
    console.error(error)
  }
}
