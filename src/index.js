// const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");
import './js/population-bubbles.js'
const sa2File = require('./shapes/sa2.geojson')

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

  map.on('load', () => {
    sa2Data.then((data) => {
      map.addSource('sa2', {
        type: 'geojson',
        data,
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
          'fill-color': 'rgba(0,0,0,0)',
        },
      })

      const getLocation = (name) => {
        let coords
        try {
          coords = data.features.find((i) => i.properties.name === name)
            .geometry.coordinates[0]
        } catch (err) {
          console.error('Could not find', name, err)
          return { lat: 0, lng: 0 }
        }

        // urgh hack
        if (coords.length === 1) {
          coords = coords[0]
        }
        return mapboxgl.LngLatBounds.convert(coords).getCenter()
      }

      const transformData = (data, baselat = 0, baselng = 0) =>
        JSON.stringify(
          Object.keys(data).map((i) => {
            const coords = getLocation(i)
            return {
              key: i,
              value: data[i],
              x: (coords.lng - baselng) * 400, // lng requires more scaling that lat
              y: (coords.lat - baselat) * -300, // make it positive so it works the same way
            }
          })
        )

      map.on('click', (e) => {
        // doesn't need to 5px around?
        const bbox = [
          [e.point.x - 5, e.point.y + 5],
          [e.point.x - 5, e.point.y + 5],
        ]

        const meshblock = map.queryRenderedFeatures(bbox, {
          layers: ['sa2-fill'],
        })[0]

        if (meshblock != null) {
          const regionName = meshblock.properties.name
          document.getElementById('location-header').innerText = regionName

          fetch(`/data/regions/${transformFilename(regionName)}.json`)
            .then((res) => res.json())
            .then((data) => {
              const arriveFrom = document.createElement('population-bubbles')
              const locationLatLng = getLocation(regionName)
              arriveFrom.setAttribute(
                'data',
                transformData(
                  data.workplace.arriveFrom,
                  locationLatLng.lat,
                  locationLatLng.lng
                )
              )
              document.getElementById('arrive-from').innerHTML = ''
              document.getElementById('arrive-from').appendChild(arriveFrom)

              const departTo = document.createElement('population-bubbles')
              departTo.setAttribute(
                'data',
                transformData(data.workplace.departTo)
              )
              document.getElementById('depart-to').innerHTML = ''
              document.getElementById('depart-to').appendChild(departTo)
            })

          window.jono = map
        }
      })
    })
  })
})
