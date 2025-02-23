import { mount } from 'svelte'
import './components/map-tooltip.js'
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('svelte-app'),
})

export default app
