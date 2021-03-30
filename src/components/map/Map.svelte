<script>
  import { onMount, afterUpdate } from 'svelte'

  import { getSource } from '../../sources.js'
  import { chooseBestName, humanRegionName } from '../../data.js'

  import { drawMap } from './map-draw.js'
  import { bindMapEvents } from './map-events.js'

  import Legend from './Legend.svelte'

  const token = process.env.MAPBOX_TOKEN
  const isMobile = document.documentElement.clientWidth <= 1020

  const source = getSource()
  const sa2Data = window.sa2Data

  mapboxgl.accessToken = token

  export let lat, lng, zoom, style
  // gross hack
  let oldLat = lat
  let oldLng = lng

  const styleUrls = {
    map: 'mapbox://styles/mapbox/dark-v10?optimize=true',
    satellite: 'mapbox://styles/mapbox/satellite-v9?optimize=true',
  }

  let isLoaded = false
  let map = null

  onMount(async () => {
    map = new mapboxgl.Map({
      container: 'map-content',
      style: styleUrls[style],
      center: [lng, lat],
      zoom: isMobile ? zoom - 1.5 : zoom,
      logoPosition: isMobile ? 'bottom-left' : 'bottom-right',
      attributionControl: !isMobile,
    })
    map.getCanvas().style.cursor = 'default'

    // TODO:
    // this gets all messed up because no resize event
    // but most people don't resize their browser (citation needed)
    // it works good enough on 1440p / 2
    if (isMobile) {
      map.addControl(new mapboxgl.AttributionControl(), 'top-right')
    } else {
      map.addControl(new mapboxgl.NavigationControl(), 'bottom-left')
    }

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

    map.on('load', () => {
      // resize hacks for edge / chrome
      map.resize()

      sa2Data.then((data) => {
        const features = data.features

        const styleDataCallback = () => {
          if (isLoaded) return
          isLoaded = true

          drawMap(map, data, source.isMapAreaLabelsEnabled)
        }
        map.on('styledata', styleDataCallback)
        styleDataCallback()
        bindMapEvents(map)
      })
    })
  })

  afterUpdate(() => {
    if (oldLat !== lat || oldLng !== lng) {
      map.flyTo({
        center: [lng, lat],
        zoom,
        essential: true,
      })
      oldLat = lat
      oldLng = lng
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
</style>
