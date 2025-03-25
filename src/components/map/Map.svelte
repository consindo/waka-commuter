<script>
  import { onMount } from 'svelte'
  import mapboxgl from 'mapbox-gl'

  import { getSource } from '../../sources.js'
  import SatelliteButton from './SatelliteButton.svelte'
  import Dispatcher from '../../dispatcher.js'

  import { drawMap } from './map-draw.js'
  import { bindMapEvents } from './map-events.js'

  import Legend from './Legend.svelte'
  import MapTooltip from './MapTooltip.svelte'

  const token = import.meta.env.VITE_MAPBOX_TOKEN
  const isMobile = document.documentElement.clientWidth <= 1020

  const { mapData, secondaryData, tertiaryData, dataset2, lat, lng, zoom } =
    $props()

  const source = getSource()

  let isLoaded = false
  let map = $state(null)

  let style = $state(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  )
  let mapLabels = $state(source.mapAreaLabelsToggleValue)
  const setMapLabels = (value) => {
    if (map && value !== mapLabels) {
      mapLabels = value
      map.setLayoutProperty(
        'sa2-labels',
        'visibility',
        value ? 'visible' : 'none'
      )
    }
  }

  const styleChange = (newStyle) => {
    style = newStyle
    if (isLoaded) {
      isLoaded = false
      map.setStyle(styleUrls[style])
    }
  }
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (event) => {
      styleChange(event.matches ? 'dark' : 'light')
    })

  let tooltipProps = $state({
    isComparison: false,
    percentage: true,
    loading: false,
    position: [0, 0],
    data: {
      currentRegions: [],
      mode: [],
      arriveData: [],
      departData: [],
    },
  })
  const tooltipCallback = (props) => {
    tooltipProps = {
      ...tooltipProps,
      ...props,
      isComparison: Dispatcher.dataSegment.includes('comparison'),
    }
  }

  mapboxgl.accessToken = token

  $effect(() => {
    if (map) {
      map.flyTo({
        center: [lng, lat],
        zoom,
        essential: true,
      })
      // on mobile, hides menu
      document.getElementById('app').classList.add('map-view')
    }
  })

  const styleUrls = {
    light: 'mapbox://styles/mapbox/light-v11?optimize=true',
    dark: 'mapbox://styles/mapbox/dark-v11?optimize=true',
    satellite: 'mapbox://styles/mapbox/satellite-v9?optimize=true',
  }

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

        if (source.dynamicShapeFiles) {
          source.dynamicShapeFiles.forEach((i) => (i.isLoaded = false))
        }
        let data = await Promise.all([mapData, secondaryData, tertiaryData])
        drawMap(
          map,
          data,
          source.isMapAreaLabelsEnabled,
          mapLabels,
          style !== 'light'
        )

        // handles dynamic loading when the style changes
        map.setZoom(map.getZoom() + 0.001)

        if (Dispatcher.currentRegion.length > 0) {
          Dispatcher.setRegions(Dispatcher.currentRegion)
        }
      }
      map.on('styledata', styleDataCallback)
      styleDataCallback()
      bindMapEvents(
        map,
        Promise.all([mapData, secondaryData, tertiaryData]),
        dataset2,
        tooltipCallback
      )
    })
  })

  $effect(() => {
    document.body.className = style !== 'light' ? 'dark' : 'light'
  })
</script>

<div id="map" class:expanded={source.brandingClass === 'ason'}>
  <div id="map-content"></div>
  <Legend />
  <SatelliteButton {style} {styleChange} {mapLabels} {setMapLabels} />
  <MapTooltip {...tooltipProps} />
</div>

<style>
  #map {
    flex: 1;
    position: relative;
  }

  #map-content {
    width: 100%;
    height: 100%;
  }

  @media (max-width: 800px) {
    #map {
      height: calc(100% - 103px);
    }
    #map.expanded {
      height: calc(100% - 128px);
    }
  }
</style>
