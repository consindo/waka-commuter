// const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");
import { getData, getLocation, transformData } from './data.js'
import { areaFill, lineFill, pointsFill } from './views/map-styles.js'
import { bindDetailsEvents } from './views/details-events.js'
import { setDetails } from './views/details-render.js'
import Dispatcher from './dispatcher.js'
import './components/map-tooltip.js'

const sa2File = require('../shapes/sa4.geojson')
const token = ''

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
    zoom: 5,
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

        mapTooltip.setAttribute('x', e.originalEvent.pageX)
        mapTooltip.setAttribute('y', e.originalEvent.pageY)
      })

      map.on('drag', (e) => {
        mapTooltip.setAttribute('x', e.originalEvent.pageX)
        mapTooltip.setAttribute('y', e.originalEvent.pageY)
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
      const setMap = (arriveData, departData) => {
        // turns off all the old areas
        selectedAreas.forEach((i) => {
          map.setFeatureState(
            {
              source: 'sa2',
              id: i,
            },
            {
              population: null,
              magnitude: null,
            }
          )
        })
        selectedAreas = []

        // combine arrive and depart data
        const combinedObject = {}

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
          map.setFeatureState(
            {
              source: 'sa2',
              id: i,
            },
            {
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

      Dispatcher.bind('load-blocks', (regionName, direction, segment) => {
        document.getElementById('location-header').innerText = regionName.join(
          ' & '
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

          const initialLocation = getLocation(features, regionName[0])
          const arriveData = transformData(features, sources, 'arriveFrom')
          const departData = transformData(features, sources, 'departTo')

          // only really want to toggle the map data for direction
          if (direction === 'all') {
            setMap(arriveData, departData)
          } else if (direction === 'arrivals') {
            setMap(arriveData, [])
          } else if (direction === 'departures') {
            setMap([], departData)
          }

          setDetails(initialLocation, arriveData, departData)

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
          mapTooltip.setAttribute('data', JSON.stringify(tooltipData))
          mapTooltip.removeAttribute('loading')
        })
      })
    })
  })
})
