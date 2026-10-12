import { getSource } from '../../sources.js'
import {
  getAreaFill,
  getLineFill,
  pointsFill,
  getNetworkFill,
} from './map-styles.js'

const source = getSource()

export const drawMap = (
  map,
  datasets,
  areaLabels,
  areaLabelsVisibility,
  isDark
) => {
  const data = datasets[0]
  const secondaryData =
    datasets[1] && source.brandingClass === 'ason' ? datasets[1] : undefined
  const networkData =
    datasets[1] && source.brandingClass === 'aucklandcouncil'
      ? datasets[1]
      : undefined

  const lineFill = getLineFill(isDark)
  const areaFill = getAreaFill(isDark)
  const networkCarFill = getNetworkFill(isDark, 'volcar')
  const networkBikeFill = getNetworkFill(isDark, 'volbike')
  const networkPtFill = getNetworkFill(isDark, 'volpt')

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

  if (networkData) {
    map.addSource('network', {
      type: 'geojson',
      data: networkData,
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

  if (networkData) {
    const networkLayout = {
      'line-join': 'round',
      'line-cap': 'round',
    }
    map.addLayer({
      id: 'network-car-lines',
      type: 'line',
      source: 'network',
      layout: networkLayout,
      paint: networkCarFill,
    })
    map.addLayer({
      id: 'network-pt-lines',
      type: 'line',
      source: 'network',
      layout: networkLayout,
      paint: networkPtFill,
    })
    map.addLayer({
      id: 'network-bike-lines',
      type: 'line',
      source: 'network',
      layout: networkLayout,
      paint: networkBikeFill,
    })
  }

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
        visibility: areaLabelsVisibility ? 'visible' : 'none',
      },
      paint: {
        // 'text-color': 'rgba(255,255,255,0.7)',
        'text-color': [
          'case',
          ['==', ['feature-state', 'magnitude'], null],
          isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
          [
            'case',
            ['<', ['feature-state', 'magnitude'], 1],
            isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
            isDark ? '#fff' : '#444',
          ],
        ],
      },
    })
  }
}
