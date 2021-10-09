import { areaFill, lineFill, pointsFill, heatmapPaint } from './map-styles.js'
import { getSource } from '../../sources.js'

const source = getSource()

export const drawMap = (map, datasets, areaLabels) => {
  const data = datasets[0]
  const vaccineData = datasets[1]

  if (vaccineData) {
    data.features.forEach((feature) => {
      const { name } = feature.properties
      Object.assign(feature.properties, vaccineData[name])
    })
  }

  map.addSource('sa2', {
    type: 'geojson',
    data,
    promoteId: 'name',
  })

  map.addSource('points', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [],
    },
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

  map.addLayer({
    id: 'points',
    type: 'circle',
    source: 'points',
    paint: pointsFill,
  })

  if (source.heatmapData != null) {
    map.addSource('heatmap', {
      type: 'geojson',
      data: source.heatmapData,
    })

    map.addLayer({
      id: 'heatmap',
      type: 'heatmap',
      source: 'heatmap',
      paint: heatmapPaint,
    })

    const inputs = Array.from(document.querySelectorAll('.loi-input'))
    inputs.forEach((el) =>
      el.addEventListener('click', (e) => {
        if (e.currentTarget.checked) {
          map.setLayoutProperty('heatmap', 'visibility', 'visible')
        } else {
          map.setLayoutProperty('heatmap', 'visibility', 'none')
        }
        inputs.forEach((el) => (el.checked = e.currentTarget.checked))
      })
    )
  }

  if (areaLabels) {
    map.addLayer({
      id: 'sa2-labels',
      type: 'symbol',
      source: 'sa2',
      layout: {
        'text-field': `{${areaLabels}}`,
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
}
