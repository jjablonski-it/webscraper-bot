import { Client, GatewayIntentBits } from 'discord.js'

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

  async sendMessage(message) {
    const channel = this.client.channels.cache.get(this.channelId)
    // console.log('channel:', channel)
    await channel?.send(message)
  }
}
