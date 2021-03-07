<script>
  import Splash from './components/splash/Splash.svelte'

  export let flyTo
</script>

<Splash on:locationChange={flyTo} />
