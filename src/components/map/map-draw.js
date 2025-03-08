import { getAreaFill, getLineFill, pointsFill } from './map-styles.js'

export const drawMap = (map, datasets, areaLabels) => {
  const data = datasets[0]
  const secondaryData = datasets[1]

  // todo: pass this in from state
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const lineFill = getLineFill(isDark)
  const areaFill = getAreaFill(isDark)

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

  if (secondaryData) {
    map.addSource('dzn', {
      type: 'geojson',
      data: secondaryData,
      promoteId: 'name',
    })
  }

  map.addLayer({
    id: 'sa2-fill',
    type: 'fill',
    source: 'sa2',
    paint: areaFill,
  })

  if (secondaryData) {
    map.addLayer({
      id: 'dzn-fill',
      type: 'fill',
      source: 'dzn',
      layout: {
        visibility: 'none',
      },
      paint: areaFill,
    })

    map.addLayer({
      id: 'dzn-lines',
      type: 'line',
      source: 'dzn',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
        visibility: 'none',
      },
      paint: lineFill,
    })
  }

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
