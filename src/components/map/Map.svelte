<script>
  import { onMount, afterUpdate } from 'svelte'

  import { getSource } from '../../sources.js'
  import SatelliteButton from './SatelliteButton.svelte'
  import Dispatcher from '../../dispatcher.js'

  import { drawMap } from './map-draw.js'
  import { bindMapEvents } from './map-events.js'

  import Legend from './Legend.svelte'

  const token = import.meta.env.VITE_MAPBOX_TOKEN
  const isMobile = document.documentElement.clientWidth <= 1020

  const source = getSource()

  mapboxgl.accessToken = token

  export let mapData, secondaryData, lat, lng, zoom, style
  let mapDataCopy = mapData

  // gross hack
  let oldLat = lat
  let oldLng = lng

  const styleUrls = {
    map: 'mapbox://styles/mapbox/dark-v11?optimize=true',
    satellite: 'mapbox://styles/mapbox/satellite-v9?optimize=true',
  }

  let isLoaded = false
  let map = null

  onMount(async () => {
    map = new mapboxgl.Map({
      container: 'map-content',
      projection: 'globe',
      style: styleUrls[style],
      center: [lng, lat],
      zoom: isMobile ? zoom - 1.5 : zoom,
      logoPosition: 'bottom-right',
      attributionControl: !isMobile,
    })
    map.getCanvas().style.cursor = 'default'

    // TODO:
    // this gets all messed up because no resize event
    // but most people don't resize their browser (citation needed)
    // it works good enough on 1440p / 2
    if (isMobile) {
      map.addControl(new mapboxgl.AttributionControl(), 'top-right')
    }
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-left')

    // ios hack
    const resize = () => {
      document.body.style.setProperty(
        '--real-height',
        `${document.documentElement.clientHeight}px`
      )
      map.resize()
    }
    resize()
    window.onresize = () => {
      requestAnimationFrame(resize)
    }

    map.on('load', async () => {
      // resize hacks for edge / chrome
      map.resize()

      const styleDataCallback = async () => {
        if (isLoaded) return
        isLoaded = true

        const data = await Promise.all([mapDataCopy, secondaryData])
        drawMap(map, data, source.isMapAreaLabelsEnabled)

        if (Dispatcher.currentRegion.length > 0) {
          Dispatcher.setRegions(Dispatcher.currentRegion)
        }
      }
      map.on('styledata', styleDataCallback)
      styleDataCallback()
      bindMapEvents(map)
    })
    if (source.dynamicShapeFiles) {
      map.on('zoom', () => {
        const zoom = map.getZoom()
        const center = map.getCenter()
        source.dynamicShapeFiles
          .filter((shape) => shape.isLoaded !== true)
          .forEach((shape) => {
            if (
              zoom > shape.zoom &&
              center.lng > shape.bbox[0][0] &&
              center.lng < shape.bbox[1][0] &&
              center.lat > shape.bbox[0][1] &&
              center.lat < shape.bbox[1][1]
            ) {
              shape.isLoaded = true
              loadDynamic(shape.url)
            }
          })
      })
    }
  })

  const loadDynamic = async (url) => {
    const res = await fetch(url)
    const newData = await res.json()
    const stateLookup = newData.features.reduce((acc, cur) => {
      acc[cur.properties.name] = cur
      return acc
    }, {})
    const currentData = await mapDataCopy
    const augmentedData = {
      type: 'FeatureCollection',
      features: currentData.features.map((i) => {
        const enhancedData = stateLookup[i.properties.name]
        if (enhancedData) {
          return enhancedData
        }
        return i
      }),
    }
    map.getSource('sa2').setData(augmentedData)
    mapDataCopy = Promise.resolve(augmentedData)
    console.info('dynamically loaded', url)
  }

  afterUpdate(() => {
    if (oldLat !== lat || oldLng !== lng) {
      map.flyTo({
        center: [lng, lat],
        zoom,
        essential: true,
      })
      oldLat = lat
      oldLng = lng
      return
    }

    if (isLoaded) {
      isLoaded = false
      map.setStyle(styleUrls[style])
    }
    document.getElementById('app').classList.add('map-view')
  })
</script>

<div id="map">
  <div id="map-content" />
  <Legend />
  <SatelliteButton on:styleChange />
  <map-tooltip />
</div>

<style>
  #map {
    flex: 1;
  }

  #map-content {
    width: 100%;
    height: 100%;
  }

  @media (max-width: 1020px) {
    #map {
      height: calc(100% - 110px);
    }
  }
</style>
