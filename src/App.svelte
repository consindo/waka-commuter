<script>
  import { getSource } from './sources.js'

  import Branding from './components/branding/Branding.svelte'
  import Map from './components/map/Map.svelte'
  import Splash from './components/splash/Splash.svelte'
  import Details from './components/details/Details.svelte'

  const source = getSource()
  const sa2Data = fetch(source.shapeFile).then((res) => res.json())
  window.sa2Data = sa2Data

  let [lng, lat, zoom] = [...source.initialPosition]

  const flyTo = (e) => {
    lat = e.detail.lat
    lng = e.detail.lng
    zoom = e.detail.zoom
  }
</script>

<Branding />
<div id="app" class="map-view">
  <Map {lat} {lng} {zoom} />
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
