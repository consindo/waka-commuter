import {
  getData,
  getLocation,
  transformData,
  transformModeData,
  transformFilename,
} from './data.js'
import { areaFill, lineFill, pointsFill } from './views/map-styles.js'
import { bindDetailsEvents } from './views/details-events.js'
import { setDetails } from './views/details-render.js'
import Dispatcher from './dispatcher.js'
import './components/map-tooltip.js'

const sa2File = require('../shapes/sa2-optimized.geojson')
const token = process.env.MAPBOX_TOKEN

const sa2Data = fetch(sa2File).then((res) => res.json())
document.addEventListener('DOMContentLoaded', () => {
  bindDetailsEvents()
  const mapTooltip = document.createElement('map-tooltip')
  document.getElementById('map').appendChild(mapTooltip)

  mapboxgl.accessToken = token
  const map = new mapboxgl.Map({
    container: 'map-content',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [173, -40],
    zoom: 5.5,
  })
  map.getCanvas().style.cursor = 'default'
  map.addControl(new mapboxgl.NavigationControl(), 'bottom-left')
  map.addControl(new mapboxgl.GeolocateControl(), 'bottom-left')

  map.on('load', () => {
    sa2Data.then((data) => {
      const features = data.features
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

      let activeBlock = null
      let needFrame = true
      map.on('mousemove', 'sa2-fill', (e) => {
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
          const isSelected = regionName.includes(i) ? regionName.length : null
          map.setFeatureState(
            {
              source: 'sa2',
              id: i,
            },
            {
              selected: isSelected ? regionName.length : null,
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
          Dispatcher.setRegions([meshblock.id])
        }
      })

      const handleRegion = (e) => {
        const lat = e.currentTarget.dataset.lat
        const lng = e.currentTarget.dataset.lng
        const zoom = e.currentTarget.dataset.zoom
        map.flyTo({
          center: [lng, lat],
          zoom: zoom,
          essential: true,
        })
      }
      // also probably shouldn't be in here
      const regionOptions = document.querySelectorAll('.region-option')
      for (const option of regionOptions) {
        option.addEventListener('click', handleRegion)
      }

      Dispatcher.bind('clear-blocks', () => {
        setMap([], [], [])
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

      Dispatcher.bind('load-blocks', (regionName, direction, segment) => {
        const finalName = regionName.join(' & ')
        document.getElementById('location-header').innerText = finalName
        document.title = `${finalName} - Commuter - Waka`
        document
          .querySelector('.population-link')
          .setAttribute(
            'href',
            `https://www.stats.govt.nz/tools/2018-census-place-summaries/${transformFilename(
              regionName[0]
            )}#population-and-dwellings`
          )

        getData(regionName).then((data) => {
          // depending on the toggle, filter out workspace or education data
          const sources = data
            .map((source) => {
              if (segment === 'all') {
                return [source.workplace, source.education]
              } else if (segment === 'workplace') {
                return [source.workplace]
              } else if (segment === 'education') {
                return [source.education]
              }
            })
            .flat()

          const sourceKeys = regionName
            .map((i) => {
              if (segment === 'all') {
                return [[i, 'workplace'].join(':'), [i, 'education'].join(':')]
              } else if (segment === 'workplace') {
                return [[i, 'workplace'].join(':')]
              } else if (segment === 'education') {
                return [i, 'education'].join(':')
              }
            })
            .flat()

          const arriveData = transformData(features, sources, 'arriveFrom')
          const departData = transformData(features, sources, 'departTo')
          const arriveModeData = transformModeData(
            sources,
            sourceKeys,
            'arrivalModes'
          )
          const departureModeData = transformModeData(
            sources,
            sourceKeys,
            'departureModes'
          )

          Dispatcher.trigger('update-blocks', {
            regionName,
            direction,
            segment,
            arriveData,
            departData,
            arriveModeData,
            departureModeData,
          })
        })
      })

      // map
      Dispatcher.bind(
        'update-blocks',
        ({ regionName, direction, arriveData, departData }) => {
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

      // details
      Dispatcher.bind(
        'update-blocks',
        ({
          regionName,
          arriveData,
          departData,
          arriveModeData,
          departureModeData,
          segment,
        }) => {
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

          // also consuming the tooltip data in the population bubbles
          const initialLocation = getLocation(features, regionName[0])
          setDetails(
            initialLocation,
            arriveData,
            departData,
            arriveModeData,
            departureModeData,
            tooltipJSON,
            segment
          )
        }
      )
    })
  })
})
