// const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");
import './js/population-bubbles.js'
const sa2File = require('./shapes/sa2.geojson')
import { getData, getLocation, transformData } from './js/data.js'
import { areaFill, lineFill, pointsFill } from './js/map-styles.js'
import { bindDetailsEvents } from './js/details-events.js'
import Dispatcher from './js/dispatcher.js'


const sa2Data = fetch(sa2File).then((res) => res.json())
document.addEventListener('DOMContentLoaded', () => {
  bindDetailsEvents()

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
        } else if (regions === id) {
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

          Dispatcher.setTooltipId(meshblock.id)
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
        paint: pointsFill,
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
          Dispatcher.setTooltipId(meshblock.id, true)
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

          if (segment === 'all') {
            setTooltipData(regionName, arriveData, departData, [
              'work',
              'study',
            ])
          } else if (segment === 'workplace') {
            setTooltipData(regionName, arriveData, departData, ['work'])
          } else if (segment === 'education') {
            setTooltipData(regionName, arriveData, departData, ['study'])
          }
          Dispatcher.setTooltipId(Dispatcher.getTooltipId())
        })
      })

      Dispatcher.bind('update-tooltip-id', (id, loading) => {
        updateTooltip(id, loading)
      })
    })
  })
})
