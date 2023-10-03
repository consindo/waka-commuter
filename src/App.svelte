<script>
  import { getSource } from './sources.js'

  import Branding from './components/branding/Branding.svelte'
  import Map from './components/map/Map.svelte'
  import Splash from './components/splash/Splash.svelte'
  import Details from './components/details/Details.svelte'

  const source = getSource()
  let sa2Data = fetch(source.shapeFile).then((res) => res.json())
  window.sa2Data = sa2Data

  let secondaryData
  if (source.secondaryShapeFile) {
    secondaryData = fetch(source.secondaryShapeFile)
      .then((res) => res.json())
      .then(async (secondary) => {
        const sa2 = await sa2Data
        const newData = Promise.resolve({
          type: 'FeatureCollection',
          features: [...sa2.features, ...secondary.features],
        })
        window.sa2Data = newData
        regionNames = getRegionNames(window.sa2Data)
        return secondary
      })
  }

  let dataset2
  if (true) {
    dataset2 = Promise.all([
      fetch(source.dataset2ShapeFile).then((res) => res.json()),
      fetch(source.dataset2SecondaryShapeFile).then((res) => res.json()),
    ]).then(async (data) => {
      const sa2 = await window.sa2Data
      await secondaryData
      const newData = Promise.resolve({
        type: 'FeatureCollection',
        features: [...sa2.features, ...data[0].features, ...data[1].features],
      })
      window.sa2Data = newData
      regionNames = getRegionNames(newData)
      return data
    })
  }

  async function getRegionNames(sourceData) {
    const data = await sourceData
    return data.features
      .map((i) => {
        const { name, friendlyName } = i.properties
        return {
          id: name,
          name: friendlyName ? `${name} - ${friendlyName}` : name,
        }
      })
      .sort(
        (a, b) =>
          isFinite(a.name[0]) - isFinite(b.name[0]) ||
          a.name.localeCompare(b.name, undefined, {
            numeric: true,
            sensitivity: 'base',
          })
      )
  }

  let regionNames = getRegionNames(window.sa2Data)

  let style = 'map'
  let [lng, lat, zoom] = [...source.initialPosition]

  const flyTo = (e) => {
    const rand = Math.random() * 0.001
    lat = parseFloat(e.detail.lat) + rand
    lng = parseFloat(e.detail.lng) + rand
    zoom = parseFloat(e.detail.zoom)
  }

  const changeStyle = (e) => {
    style = e.detail.style
  }
</script>

<Branding {regionNames} />
<div id="app" class="map-view" class:expanded={source.brandingClass === 'ason'}>
  <Map
    mapData={sa2Data}
    {secondaryData}
    {dataset2}
    {lat}
    {lng}
    {zoom}
    {style}
    on:styleChange={changeStyle}
  />
  <section>
    <Splash on:locationChange={flyTo} />
    <Details mapData={sa2Data} />
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

  @media (max-width: 1650px) {
    section {
      width: 600px;
    }
  }

  @media (max-width: 1020px) {
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
      transform: translate3d(0, calc(var(--real-height) - 103px), 0);
    }
    .map-view.expanded section {
      transform: translate3d(0, calc(var(--real-height) - 128px), 0);
    }
  }
</style>
