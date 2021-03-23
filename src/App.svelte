<script>
  import Branding from './components/branding/Branding.svelte'
  import Map from './components/map/Map.svelte'
  import Splash from './components/splash/Splash.svelte'
  import Details from './components/details/Details.svelte'

  export let flyTo
</script>

<Branding />
<div id="app" class="map-view">
  <Map />
  <section>
    <Splash on:locationChange={flyTo} />
    <Details />
  </section>
</div>

<style>
  #app {
    display: flex;
    height: 100vh;
    height: var(--real-height);
  }
  section {
    width: 900px;
    border-left: var(--border);
    overflow-y: auto;
    background: #111;
  }


@media (max-width: 1500px) {
  section {
    width: 600px;
  }
}

@media (max-width: 1020px) {
  #app {
    display: block;
  }
  #map {
    height: calc(100% - 110px);
  }
  section {
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-left: 0;
    transform: translate3d(0, 0, 0);
    transition: 300ms ease transform;
    z-index: 10;
    overflow-x: hidden;
  }
  .map-view section {
    overflow: hidden;
    transform: translate3d(0, calc(var(--real-height) - 110px), 0);
  }
}
</style>
