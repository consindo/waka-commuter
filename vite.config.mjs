import { svelte } from '@sveltejs/vite-plugin-svelte'

/** @type {import('vite').UserConfig} */
const config = {
  preview: {
    port: 8080,
  },
  plugins: [svelte({})],
}

export default config
