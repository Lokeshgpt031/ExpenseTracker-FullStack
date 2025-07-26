import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import PrimeUI from "tailwindcss-primeui"
export default defineConfig({
    plugins: [
        tailwindcss()
    ],
})