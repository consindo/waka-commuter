// const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");
import './js/population-bubbles.js'
const sa2File = require('./shapes/sa2.geojson')
import { getData, getLocation, transformData } from './js/data.js'


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
        paint: {
          // Size circle radius by earthquake magnitude and zoom level
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10,
            ['interpolate', ['linear'], ['get', 'population'], 1, 1, 6, 4],
            50,
            ['interpolate', ['linear'], ['get', 'population'], 1, 5, 6, 50],
          ],
          // Color circle by earthquake magnitude
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'population'],
            10,
            'rgba(33,102,172,0)',
            25,
            'rgb(103,169,207)',
            50,
            'rgb(209,229,240)',
            100,
            'rgb(253,219,199)',
            200,
            'rgb(239,138,98)',
            400,
            'rgb(178,24,43)',
          ],
          'circle-stroke-color': 'white',
          'circle-stroke-width': 1,
          // Transition from heatmap to circle layer by zoom level
          'circle-opacity': ['interpolate', ['linear'], ['zoom'], 7, 0, 8, 1],
        },
      })

      const setDetails = (initialLocation, arriveData, departData) => {
        const arriveFrom = document.createElement('population-bubbles')

        arriveFrom.setAttribute('scale', JSON.stringify(initialLocation))
        arriveFrom.setAttribute('data', JSON.stringify(arriveData))
        document.getElementById('arrive-from').innerHTML = ''
        document.getElementById('arrive-from').appendChild(arriveFrom)

        const departTo = document.createElement('population-bubbles')
        departTo.setAttribute('scale', JSON.stringify(initialLocation))
        departTo.setAttribute('data', JSON.stringify(departData))
        document.getElementById('depart-to').innerHTML = ''
        document.getElementById('depart-to').appendChild(departTo)
      }

      const setMap = (data) => {
        map.getSource('points').setData({
          type: 'FeatureCollection',
          features: data.map((i) => ({
            type: 'Feature',
            properties: {
              title: i.key,
              population: i.value,
            },
            geometry: {
              type: 'Point',
              coordinates: [i.x, i.y],
            },
          })),
        })
      }

      map.on('click', 'sa2-fill', (e) => {
        const meshblock = e.features[0]
        if (meshblock != null) {
          const regionName = meshblock.properties.name
          document.getElementById('location-header').innerText = regionName

          getData([regionName]).then((data) => {
            const sources = data
              .map((source) => [source.workplace, source.education])
              .flat()
            const initialLocation = getLocation(features, regionName)
            const arriveData = transformData(features, sources, 'arriveFrom')
            const departData = transformData(features, sources, 'departTo')

            setMap(arriveData, departData)
            setDetails(initialLocation, arriveData, departData)
          })

          window.jono = map
        }
      })
    })
  })
})
