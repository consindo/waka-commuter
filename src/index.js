// const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");
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

document.addEventListener('DOMContentLoaded', () => {
  mapboxgl.accessToken = token
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [175, -37],
    zoom: 5,
  })

  map.on('load', () => {
    map.addSource('sa2', {
      type: 'geojson',
      data: sa2File,
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
        const regionName = meshblock.properties.SA22018__1
        document.getElementById('label').innerText = regionName

        fetch(`/data/regions/${transformFilename(regionName)}.json`)
          .then((res) => res.json())
          .then((data) => {
            document.getElementById('data').innerText = JSON.stringify(
              data,
              '',
              2
            )
          })
      }
    })
  })
})
