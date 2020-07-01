// const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");
import './js/population-bubbles.js'
const sa2File = require('./shapes/sa2.geojson')
import { getData, getLocation, transformData } from './js/data.js'


const sa2Data = fetch(sa2File).then((res) => res.json())
document.addEventListener('DOMContentLoaded', () => {
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

      const colors = [
        'interpolate-hcl',
        ['linear'],
        ['feature-state', 'population'],
        -250,
        '#0D47A1',
        -50,
        '#2196F3',
        -10,
        '#E3F2FD',
        0,
        '#fff',
        10,
        '#FFEBEE',
        50,
        '#F44336',
        250,
        '#B71C1C',
      ]

      map.addLayer({
        id: 'sa2-fill',
        type: 'fill',
        source: 'sa2',
        paint: {
          'fill-outline-color': 'rgba(0,0,0,0)',
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.75,
            [
              'interpolate',
              ['linear'],
              ['feature-state', 'magnitude'],
              0,
              0,
              25,
              0.8,
              100,
              0.9,
              200,
              0.95,
              500,
              1,
            ],
          ],
          'fill-color': [
            'case',
            ['!=', ['feature-state', 'population'], null],
            colors,
            [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              'rgba(255,255,255,0.45)',
              'rgba(0,0,0,0)',
            ],
          ],
        },
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
          'line-color': '#777',
          'line-width': 1,
        },
      })

      let activeBlock = null

      const tooltipElement = document.getElementById('map-tooltip')
      let tooltipData = {
        currentRegions: [],
      }
      const setTooltipData = (currentRegions, arriveData, departData, mode) => {
        tooltipData = {
          currentRegions,
          mode,
          arriveData: {},
          departData: {},
        }
        arriveData.forEach((r) => (tooltipData.arriveData[r.key] = r.value))
        departData.forEach((r) => (tooltipData.departData[r.key] = r.value))
      }
      const updateTooltip = (id, loading) => {
        let finalText = `<strong>${id}</strong>${
          loading ? '<br>Loading...' : ''
        }`
        if (tooltipData.currentRegions.length === 0 || loading) {
          tooltipElement.innerHTML = finalText
          return
        }

        const regions = tooltipData.currentRegions.join(' & ')
        const departCount = tooltipData.departData[id] || 0
        const arrivalCount = tooltipData.arriveData[id] || 0

        if (departCount === 0 && arrivalCount === 0) {
          finalText += `<br>No ${
            tooltipData.mode.length === 2 ? '' : tooltipData.mode[0]
          } travel to/from ${regions}`
        } else if (departCount === arrivalCount) {
          finalText += `<br>${departCount} live & ${tooltipData.mode.join(
            '/'
          )} in ${id}`
        } else {
          // this seems wrong... but it's right. it's just all very confusing
          const departText = `<span class="departures">${departCount} arrivals</span> &larr; from ${regions}`
          const arrivalsText = `<span class="arrivals">${arrivalCount} departures</span> &rarr; to ${regions}`
          finalText += `<br>${departText}<br>${arrivalsText}`
        }
        tooltipElement.innerHTML = finalText
      }

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

          updateTooltip(meshblock.id)
          tooltipElement.style.opacity = 1
        }
        const pos = `translate(${e.originalEvent.pageX + 20}px, ${
          e.originalEvent.pageY
        }px)`
        requestAnimationFrame(() => {
          tooltipElement.style.transform = pos
        })
      })

      map.on('drag', (e) => {
        const pos = `translate(${e.originalEvent.pageX + 20}px, ${
          e.originalEvent.pageY
        }px)`
        requestAnimationFrame(() => {
          tooltipElement.style.transform = pos
        })
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
        tooltipElement.style.opacity = 0
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
            ['get', 'magnitude'],
            1,
            1,
            1000,
            30,
          ],

          'circle-color': 'rgba(255,255,255,0.1)',
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
          const regionName = meshblock.properties.name
          document.getElementById('location-header').innerText = regionName

          // loading...
          updateTooltip(meshblock.id, true)
          getData([regionName]).then((data) => {
            const sources = data
              .map((source) => [source.workplace, source.education])
              .flat()
            const initialLocation = getLocation(features, regionName)
            const arriveData = transformData(features, sources, 'arriveFrom')
            const departData = transformData(features, sources, 'departTo')

            setMap(arriveData, departData)
            setDetails(initialLocation, arriveData, departData)
            setTooltipData([regionName], arriveData, departData, [
              'work',
              'study',
            ])
            updateTooltip(meshblock.id)
          })

          window.jono = map
        }
      })
    })
  })
})
