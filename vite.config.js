import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import url from 'url'

function mockApiPlugin() {
  return {
    name: 'mock-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const parsedUrl = url.parse(req.url, true)
        const pathname = parsedUrl.pathname

        if (pathname.startsWith('/api/')) {
          res.setHeader('Content-Type', 'application/json')
          
          try {
            // POST /api/coaching
            if (pathname === '/api/coaching' && req.method === 'POST') {
              let body = ''
              req.on('data', chunk => {
                body += chunk.toString()
              })
              req.on('end', () => {
                try {
                  const data = JSON.parse(body)
                  console.log('Received coaching request:', data)
                  res.end(JSON.stringify({ ok: true, message: 'Request submitted successfully!' }))
                } catch (e) {
                  res.statusCode = 400
                  res.end(JSON.stringify({ ok: false, message: 'Invalid JSON request payload' }))
                }
              })
              return
            }

            // Unknown api
            res.statusCode = 404
            res.end(JSON.stringify({ ok: false, message: 'API route not found' }))
          } catch (err) {
            console.error('API Error:', err)
            res.statusCode = 500
            res.end(JSON.stringify({ ok: false, message: 'Internal Server Error', error: err.message }))
          }
        } else {
          next()
        }
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mockApiPlugin()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react-vendor',
              test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/,
              priority: 30,
            },
            {
              name: 'motion-vendor',
              test: /node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/,
              priority: 25,
            },
            {
              name: 'icons-vendor',
              test: /node_modules[\\/]@phosphor-icons[\\/]/,
              priority: 20,
            },
          ],
        },
      },
    },
  },
  server: {
    watch: {
      usePolling: true,
      interval: 100,
    }
  }
})
