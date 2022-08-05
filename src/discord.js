import { Client, GatewayIntentBits } from 'discord.js'
import { getExistingLinks } from './db.js'

export class Discord {
  constructor({ token, channelId, onReady }) {
    this.client = new Client({ intents: GatewayIntentBits.Guilds })
    this.channelId = channelId
    this.token = token

    this.client.once('ready', () => {
      console.log(`Logged in as ${this.client.user.tag}!`)
      onReady?.(this)
    })
  }

  async login() {
    // console.log('Logging in with token:', this.token)
    await this.client.login(this.token)
  }

  async registerCommands() {
    this.client.on('interactionCreate', async (interaction) => {
      if (!interaction.isChatInputCommand()) return

      if (interaction.commandName === 'ping') {
        const apartments = await getExistingLinks()
        await interaction.reply(`Pong! ${apartments.length} apartments found so far`)
      }

      if (interaction.commandName === 'last') {
        const count = interaction.options.getInteger("count") || 10
        const apartments = await getExistingLinks()
        await interaction.reply(apartments.slice(-count).join('\n').slice(-2000))
      }
    })
  }

  async sendMessage(message) {
    const channel = this.client.channels.cache.get(this.channelId)
    // console.log('channel:', channel)
    await channel?.send(message)
  }
}
