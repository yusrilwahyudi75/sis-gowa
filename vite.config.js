import { defineConfig } from 'vite'
import { resolve } from 'path'
import fs from 'fs'

// Helper to find all HTML files in root directory
function getHtmlEntries() {
  const entries = {}
  const files = fs.readdirSync(__dirname)
  files.forEach(file => {
    if (file.endsWith('.html')) {
      const name = file.replace('.html', '')
      entries[name] = resolve(__dirname, file)
    }
  })
  return entries
}

export default defineConfig({
  build: {
    rollupOptions: {
      input: getHtmlEntries()
    }
  }
})
