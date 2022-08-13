import { createServer } from 'http'
import { CONFIG } from '../config.js'

const server = createServer((_req, res) => {
  res.write('OK')
  res.end()
})

export const runWebServer = () => {
  const { PORT } = CONFIG
  server.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
}
