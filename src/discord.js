import { Client, GatewayIntentBits } from 'discord.js'

export class Discord {
  constructor(token, onReady) {
    this.client = new Client({ intents: GatewayIntentBits.Guilds })
    this.client.once('ready', () => {
      console.log(`Logged in as ${this.client.user.tag}!`)
      onReady?.(this)
    })
    console.log('CLIENT_TOKEN:', token)
    this.login(token)
  }

  async sendMessage(channelId, message) {
    const channel = this.client.channels.cache.get(channelId)
    await channel?.send(message)
  }

  async login(token) {
    await this.client.login(token)
  }
}