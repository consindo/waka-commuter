import { mount } from 'svelte'
import App from './App.svelte'
import 'mapbox-gl/dist/mapbox-gl.css'

const app = mount(App, {
  target: document.getElementById('svelte-app'),
})

export default app
