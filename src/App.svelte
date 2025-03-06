<script>
  import { getSource } from './sources.js'

  import Branding from './components/branding/Branding.svelte'
  import Map from './components/map/Map.svelte'
  import Splash from './components/splash/Splash.svelte'
  import Details from './components/details/Details.svelte'

  const source = getSource()
  let sa2Data = fetch(source.shapeFile).then((res) => res.json())
  window.sa2Data = sa2Data
  sa2Data.then((data) => {
    regionNames = getRegionNames(data)
  })

  let secondaryData = $state(),
    tertiaryData = $state()
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
        if (source.brandingClass === 'ason') {
          regionNames = getRegionNames(newData)
        } else {
          regionNames = getRegionNames(sa2)
        }

        if (source.tertiaryShapeFile) {
          tertiaryData = fetch(source.tertiaryShapeFile)
            .then((res) => res.json())
            .then(async (tertiary) => {
              const updatedSa2 = await window.sa2Data
              const newData = Promise.resolve({
                type: 'FeatureCollection',
                features: [...updatedSa2.features, ...tertiary.features],
              })
              window.sa2Data = newData
              regionNames = getRegionNames(window.sa2Data)
              return tertiary
            })
        }

        return secondary
      })
  }

  let dataset2 = $state()
  if (source.dataset2ShapeFile) {
    dataset2 = Promise.all([
      fetch(source.dataset2ShapeFile).then((res) => res.json()),
      source.dataset2SecondaryShapeFile
        ? fetch(source.dataset2SecondaryShapeFile).then((res) => res.json())
        : { features: [] },
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
    let usedNames = []
    const data = await sourceData
    return data.features
      .map((i) => {
        const { name, friendlyName } = i.properties
        return {
          id: name,
          name: friendlyName ? `${name} - ${friendlyName}` : name,
        }
      })
      .filter((i) => {
        const uniqueId = i.id + i.name
        if (usedNames.includes(uniqueId)) return false
        usedNames.push(uniqueId)
        return true
      })
      .sort((a, b) => a.name.localeCompare(b.name, undefined, {}))
  }

  let regionNames = $state({ features: [] })

  let [lng, lat, zoom] = $state([...source.initialPosition])

  const flyTo = (props) => {
    const rand = Math.random() * 0.00001
    lat = parseFloat(props.lat) + rand
    lng = parseFloat(props.lng) + rand
    zoom = parseFloat(props.zoom)
  }
</script>

<Branding {regionNames} />
<div id="app" class="map-view" class:expanded={source.brandingClass === 'ason'}>
  <Map
    mapData={sa2Data}
    {secondaryData}
    {tertiaryData}
    {dataset2}
    {lat}
    {lng}
    {zoom}
  />
  <section>
    <Splash setLocation={flyTo} />
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
