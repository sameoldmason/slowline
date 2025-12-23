import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createTestChatMiddleware } from './src/server/test-chat/index.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'test-chat-api',
      configureServer(server) {
        server.middlewares.use(createTestChatMiddleware())
      },
    },
  ],
})
