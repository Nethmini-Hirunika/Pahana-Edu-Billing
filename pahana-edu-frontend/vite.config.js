 import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Pahana-Edu-Billing/', // EXACT case of your repo name
})
