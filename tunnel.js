import { spawn } from 'child_process'

export function tunnelPlugin() {
  let tunnelUrl = ''
  return {
    name: 'tunnel',
    configureServer(server) {
      server.httpServer?.once('listening', () => {
        const port = server.config.server.port || 5173
        console.log('\n  Starting Cloudflare Tunnel...\n')

        const child = spawn('cloudflared', ['tunnel', '--url', `http://localhost:${port}`], {
          stdio: ['ignore', 'pipe', 'pipe'],
        })

        child.stdout.on('data', (data) => {
          const str = data.toString()
          const match = str.match(/https:\/\/[a-z0-9\-]+\.trycloudflare\.com/)
          if (match && match[0] !== tunnelUrl) {
            tunnelUrl = match[0]
            console.log(`  🌍  Tunnel ready: ${tunnelUrl}\n`)
          }
        })

        child.stderr.on('data', (data) => {
          const str = data.toString()
          const match = str.match(/https:\/\/[a-z0-9\-]+\.trycloudflare\.com/)
          if (match && match[0] !== tunnelUrl) {
            tunnelUrl = match[0]
            console.log(`  🌍  Tunnel ready: ${tunnelUrl}\n`)
          }
        })

        child.on('error', (err) => {
          console.log('  ⚠️  Tunnel failed to start:', err.message)
          console.log('     Run: brew install cloudflared')
        })
      })
    },
  }
}
