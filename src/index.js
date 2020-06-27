// const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");
import './js/population-bubbles.js'
const sa2File = require('./shapes/sa2.geojson')
import { getLocation, transformData } from './js/data.js'

console.log(sa2File)

const transformFilename = (name) => {
  return name
    .trim()
    .toLowerCase()
    .split(' ')
    .join('-')
    .replace(/[()\/]/g, '')
}

const sa2Data = fetch(sa2File).then((res) => res.json())
document.addEventListener('DOMContentLoaded', () => {
  mapboxgl.accessToken = token
  const map = new mapboxgl.Map({
    container: 'map',
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
        id: 'sa2-lines',
        type: 'line',
        source: 'sa2',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#888',
          'line-width': 1,
        },
      })

      map.addLayer({
        id: 'sa2-fill',
        type: 'fill',
        source: 'sa2',
        paint: {
          'fill-outline-color': 'rgba(0,0,0,0)',
          'fill-color': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            'rgba(255,255,255,0.25)',
            'rgba(0,0,0,0)',
          ],
        },
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
      })

      const setDetails = (data) => {
        const arriveFrom = document.createElement('population-bubbles')
        const locationLatLng = getLocation(features, data.id)
        arriveFrom.setAttribute(
          'data',
          transformData(
            features,
            [data.workplace, data.education],
            'arriveFrom',
            locationLatLng.lat,
            locationLatLng.lng
          )
        )
        document.getElementById('arrive-from').innerHTML = ''
        document.getElementById('arrive-from').appendChild(arriveFrom)

        const departTo = document.createElement('population-bubbles')
        departTo.setAttribute(
          'data',
          transformData(
            features,
            [data.workplace, data.education],
            'departTo',
            locationLatLng.lat,
            locationLatLng.lng
          )
        )
        document.getElementById('depart-to').innerHTML = ''
        document.getElementById('depart-to').appendChild(departTo)
      }

      const setMap = (data) => {
        console.log(data)
      }

      map.on('click', 'sa2-fill', (e) => {
        const meshblock = e.features[0]
        if (meshblock != null) {
          const regionName = meshblock.properties.name
          document.getElementById('location-header').innerText = regionName

          fetch(`/data/regions/${transformFilename(regionName)}.json`)
            .then((res) => res.json())
            .then((data) => {
              setDetails(data)
              setMap(data)
            })

          window.jono = map
        }
      })
    })
  })
})
