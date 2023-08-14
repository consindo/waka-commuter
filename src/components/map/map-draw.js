import { areaFill, lineFill, pointsFill } from './map-styles.js'

export const drawMap = (map, datasets, areaLabels) => {
  const data = datasets[0]

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
