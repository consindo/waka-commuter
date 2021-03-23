<script>
  import { onMount } from 'svelte'

  import Dispatcher from '../../dispatcher.js'
  import { getSource } from '../../sources.js'
  import { chooseBestName, humanRegionName } from '../../data.js'

  import { areaFill, lineFill, pointsFill } from './map-styles.js'

  import Legend from './Legend.svelte'

  const token = process.env.MAPBOX_TOKEN
  const isMobile = document.documentElement.clientWidth <= 1020

  const source = getSource()
  const sa2Data = window.sa2Data

  mapboxgl.accessToken = token

  onMount(async () => {
    const map = new mapboxgl.Map({
      container: 'map-content',
      style: 'mapbox://styles/mapbox/dark-v10?optimize=true',
      center: source.initialPosition,
      zoom: isMobile
        ? source.initialPosition[2] - 1.5
        : source.initialPosition[2],
      logoPosition: isMobile ? 'bottom-left' : 'bottom-right',
      attributionControl: !isMobile,
    })
    window.mapboxMap = map
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

    const mapTooltip = document.querySelector('#map map-tooltip')

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

      const friendlyNames = {}
      sa2Data.then((data) => {
        const features = data.features

        // easy reference to the freindly names
        features.forEach((feature) => {
          const { name, friendlyName } = feature.properties
          friendlyNames[name] = friendlyName
        })

        map.addSource('sa2', {
          type: 'geojson',
          data,
          promoteId: 'name',
        })

        map.addLayer({
          id: 'sa2-fill',
          type: 'fill',
          source: 'sa2',
          paint: areaFill,
        })

        map.addLayer({
          id: 'sa2-lines',
          type: 'line',
          source: 'sa2',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: lineFill,
        })

        if (source.isMapAreaLabelsEnabled) {
          map.addLayer({
            id: 'sa2-labels',
            type: 'symbol',
            source: 'sa2',
            layout: {
              'text-field': `{${source.isMapAreaLabelsEnabled}}`,
              'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
              'text-size': 11,
            },
            paint: {
              // 'text-color': 'rgba(255,255,255,0.7)',
              'text-color': [
                'case',
                ['==', ['feature-state', 'magnitude'], null],
                'rgba(255,255,255,0.3)',
                [
                  'case',
                  ['<', ['feature-state', 'magnitude'], 1],
                  'rgba(255,255,255,0.3)',
                  '#fff',
                ],
              ],
            },
          })
        }

        let activeBlock = null
        let needFrame = true
        let isTouch = false
        map.on('touchstart', 'sa2-fill', () => (isTouch = true))
        map.on('mousemove', 'sa2-fill', (e) => {
          if (isTouch) return
          const meshblock = e.features[0]
          if (meshblock != null && activeBlock !== meshblock.id) {
            map.setFeatureState(
              {
                source: 'sa2',
                id: activeBlock,
              },
              {
                hover: false,
              }
            )
            activeBlock = meshblock.id
            map.setFeatureState(
              {
                source: 'sa2',
                id: meshblock.id,
              },
              {
                hover: true,
              }
            )

            mapTooltip.setAttribute('id', meshblock.id)
            mapTooltip.setAttribute(
              'friendlyName',
              meshblock.properties.friendlyName
            )
            mapTooltip.setAttribute('opacity', 1)
          }

          if (needFrame) {
            needFrame = false
            const { pageX, pageY } = e.originalEvent
            requestAnimationFrame(() => {
              needFrame = true
              mapTooltip.setAttribute('x', pageX)
              mapTooltip.setAttribute('y', pageY)
            })
          }
        })

        map.on('drag', (e) => {
          if (needFrame) {
            needFrame = false
            const { pageX, pageY } = e.originalEvent
            requestAnimationFrame(() => {
              needFrame = true
              mapTooltip.setAttribute('x', pageX)
              mapTooltip.setAttribute('y', pageY)
            })
          }
        })

        map.on('mouseleave', 'sa2-fill', (e) => {
          isTouch = false
          map.setFeatureState(
            {
              source: 'sa2',
              id: activeBlock,
            },
            {
              hover: false,
            }
          )
          activeBlock = null
          mapTooltip.setAttribute('opacity', 0)
        })

        map.addSource('points', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        })
        map.addLayer({
          id: 'points',
          type: 'circle',
          source: 'points',
          paint: pointsFill,
        })

        let selectedAreas = []
        const setMap = (arriveData, departData, regionName) => {
          // turns off all the old areas
          selectedAreas.forEach((i) => {
            map.setFeatureState(
              {
                source: 'sa2',
                id: i,
              },
              {
                selected: null,
                population: null,
                magnitude: null,
              }
            )
          })
          selectedAreas = []

          // combine arrive and depart data
          const combinedObject = {}

          // add the selected regions just in case they're undefined
          regionName.forEach((name) => {
            combinedObject[name] = {
              x: 0,
              y: 0,
              population: 0,
              magnitude: 0,
            }
          })
          ;[arriveData, departData].forEach((dataset, idx) => {
            let sign = 1
            if (dataset === arriveData) {
              // arriveFrom is negative
              sign = -1
            }
            dataset.forEach((i) => {
              if (combinedObject[i.key] === undefined) {
                combinedObject[i.key] = {
                  x: i.x,
                  y: i.y,
                  population: 0,
                  magnitude: 0,
                }
              }

              combinedObject[i.key].population += i.value * sign
              combinedObject[i.key].magnitude += i.value
            })
          })

          Object.keys(combinedObject).forEach((i) => {
            selectedAreas.push(i)
            // should probably always stand out if it's the selected area...
            const isSelected = regionName.includes(i)
            map.setFeatureState(
              {
                source: 'sa2',
                id: i,
              },
              {
                selected: isSelected ? 1 : null,
                population: combinedObject[i].population,
                magnitude: combinedObject[i].magnitude,
              }
            )
          })

          map.getSource('points').setData({
            type: 'FeatureCollection',
            features: Object.keys(combinedObject).map((i) => ({
              type: 'Feature',
              properties: {
                title: i,
                population: combinedObject[i].population,
                magnitude: combinedObject[i].magnitude,
              },
              geometry: {
                type: 'Point',
                coordinates: [combinedObject[i].x, combinedObject[i].y],
              },
            })),
          })
        }

        map.on('click', 'sa2-fill', (e) => {
          const meshblock = e.features[0]
          if (meshblock != null) {
            mapTooltip.setAttribute('loading', true)
            if (e.originalEvent.ctrlKey || e.originalEvent.metaKey) {
              Dispatcher.addRegion(meshblock.id)
            } else {
              Dispatcher.setRegions([meshblock.id])
            }
          }
        })

        Dispatcher.bind('load-blocks', (regionName, direction, segment) => {
          const modifiedRegionNames = regionName.map((name) =>
            chooseBestName(
              humanRegionName([name || ''], 'condensed'),
              friendlyNames[name]
            )
          )
          document.getElementById(
            'location-header'
          ).innerText = humanRegionName(modifiedRegionNames, 'full')
          let titleString = `${humanRegionName(
            modifiedRegionNames,
            'title'
          )} - Commuter - Waka`
          titleString =
            titleString.charAt(0).toUpperCase() + titleString.slice(1)
          document.title = titleString
        })

        Dispatcher.bind('clear-blocks', () => {
          document.querySelector('.map-legend').classList.add('hidden')
          setMap([], [], [])
          mapTooltip.removeAttribute('loading')
          mapTooltip.setAttribute(
            'data',
            JSON.stringify({
              currentRegions: [],
              mode: [],
              arriveData: [],
              departData: [],
            })
          )
        })

        // map
        Dispatcher.bind(
          'update-blocks',
          ({ regionName, direction, arriveData, departData, segment }) => {
            document.querySelector('.map-legend').classList.remove('hidden')

            const tooltipData = {
              currentRegions: regionName,
              arriveData,
              departData,
              mode: ['work', 'study'],
            }
            if (segment === 'workplace') {
              tooltipData.mode = ['work']
            } else if (segment === 'education') {
              tooltipData.mode = ['study']
            }
            const tooltipJSON = JSON.stringify(tooltipData)
            mapTooltip.setAttribute('data', tooltipJSON)
            mapTooltip.removeAttribute('loading')

            // only really want to toggle the map data for direction
            if (direction === 'all') {
              setMap(arriveData, departData, regionName)
            } else if (direction === 'arrivals') {
              setMap(arriveData, [], regionName)
            } else if (direction === 'departures') {
              setMap([], departData, regionName)
            }
          }
        )
      })
    })
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
