import polylabel from 'polylabel'
import Dispatcher from '../../dispatcher.js'
import { getSource } from '../../sources.js'

const source = getSource()

export const bindMapEvents = (map) => {
  bindMapboxEvents(map)
  bindDispatcherEvents(map)
}

const bindMapboxEvents = (map) => {
  const mapTooltip = document.querySelector('#map map-tooltip')
  let activeBlock = null
  let activeDznBlock = null
  let needFrame = true
  let isTouch = false
  map.on('touchstart', 'sa2-fill', () => (isTouch = true))
  map.on('mousemove', 'sa2-fill', (e) => {
    if (isTouch) return
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

      mapTooltip.setAttribute('id', meshblock.id)
      mapTooltip.setAttribute('friendlyName', meshblock.properties.friendlyName)
      if (meshblock.properties.populationCount != null) {
        mapTooltip.setAttribute(
          'populationCount',
          meshblock.properties.populationCount
        )
      }
      mapTooltip.setAttribute('opacity', 1)
    }

    if (needFrame) {
      needFrame = false
      const { pageX, pageY } = e.originalEvent
      requestAnimationFrame(() => {
        needFrame = true
        mapTooltip.setAttribute('x', pageX)
        mapTooltip.setAttribute('y', pageY)
      })
    }
  })

  map.on('mousemove', 'dzn-fill', (e) => {
    if (isTouch) return
    const meshblock = e.features[0]
    if (meshblock != null && activeDznBlock !== meshblock.id) {
      map.setFeatureState(
        {
          source: 'dzn',
          id: activeDznBlock,
        },
        {
          hover: false,
        }
      )
      activeDznBlock = meshblock.id
      map.setFeatureState(
        {
          source: 'dzn',
          id: meshblock.id,
        },
        {
          hover: true,
        }
      )

      if (Dispatcher.dataDirection === 'arrivals' && Dispatcher.dataSegment === '2021-dzn') return

      mapTooltip.setAttribute('id', meshblock.id)
      mapTooltip.setAttribute('friendlyName', meshblock.properties.friendlyName)
      if (meshblock.properties.populationCount != null) {
        mapTooltip.setAttribute(
          'populationCount',
          meshblock.properties.populationCount
        )
      }
      mapTooltip.setAttribute('opacity', 1)
    }

    if (needFrame) {
      needFrame = false
      const { pageX, pageY } = e.originalEvent
      requestAnimationFrame(() => {
        needFrame = true
        mapTooltip.setAttribute('x', pageX)
        mapTooltip.setAttribute('y', pageY)
      })
    }
  })

  map.on('drag', (e) => {
    if (needFrame) {
      needFrame = false
      const { pageX, pageY } = e.originalEvent
      requestAnimationFrame(() => {
        needFrame = true
        mapTooltip.setAttribute('x', pageX)
        mapTooltip.setAttribute('y', pageY)
      })
    }
  })

  map.on('mouseleave', 'sa2-fill', (e) => {
    isTouch = false
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
    mapTooltip.setAttribute('opacity', 0)
  })

  map.on('mouseleave', 'dzn-fill', (e) => {
    isTouch = false
    map.setFeatureState(
      {
        source: 'dzn',
        id: activeDznBlock,
      },
      {
        hover: false,
      }
    )
    activeDznBlock = null
    mapTooltip.setAttribute('opacity', 0)
  })

  map.on('click', 'sa2-fill', (e) => {
    // ason specific, we use the other event otherwise
    if (Dispatcher.dataDirection === 'arrivals' && Dispatcher.dataSegment === '2021-dzn') return

    const meshblock = e.features[0]
    if (meshblock != null) {
      mapTooltip.setAttribute('loading', true)
      if (e.originalEvent.ctrlKey || e.originalEvent.metaKey || Dispatcher.currentRegion.includes(meshblock.id)) {
        Dispatcher.addRegion(meshblock.id)
      } else {
        Dispatcher.setRegions([meshblock.id])
      }
    }
  })

  map.on('click', 'dzn-fill', (e) => {
    // ason specific, we use the other event otherwise
    if (Dispatcher.dataDirection !== 'arrivals' || Dispatcher.dataSegment !== '2021-dzn') return

    const meshblock = e.features[0]
    if (meshblock != null) {
      mapTooltip.setAttribute('loading', true)
      if (e.originalEvent.ctrlKey || e.originalEvent.metaKey || Dispatcher.currentRegion.includes(meshblock.id)) {
        Dispatcher.addRegion(meshblock.id)
      } else {
        Dispatcher.setRegions([meshblock.id])
      }
    }
  })
}

const bindDispatcherEvents = (map) => {
  const mapTooltip = document.querySelector('#map map-tooltip')
  let selectedAreas = []

  const setMap = (arriveData, departData, regionName, animate) => {
    // turns off all the old areas
    selectedAreas.forEach((i) => {
      map.setFeatureState(
        {
          source: 'sa2',
          id: i,
        },
        {
          selected: null,
          population: null,
          magnitude: null,
        }
      )
      if (source.secondaryShapeFile) {
        map.setFeatureState(
          {
            source: 'dzn',
            id: i,
          },
          {
            selected: null,
            population: null,
            magnitude: null,
          }
        )
      }
    })
    selectedAreas = []

    // combine arrive and depart data
    const combinedObject = {}

    // add the selected regions just in case they're undefined
    regionName.forEach((name) => {
      combinedObject[name] = {
        x: 0,
        y: 0,
        population: 0,
        magnitude: 0,
      }
    })

    if (animate) {
      // hate this
      const sa2Data = window.sa2Data
      sa2Data.then((data) => {
        const feature = data.features.find(
          (i) => i.properties.name === regionName[0]
        )
        map.flyTo({ center: polylabel(feature.geometry.coordinates) })
      })
    }

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
      // should probably always stand out if it's the selected area...
      const isSelected = regionName.includes(i)
      map.setFeatureState(
        {
          source: 'sa2',
          id: i,
        },
        {
          selected: isSelected ? 1 : null,
          population: combinedObject[i].population,
          magnitude: combinedObject[i].magnitude,
        }
      )
      if (source.secondaryShapeFile) {
        map.setFeatureState(
          {
            source: 'dzn',
            id: i,
          },
          {
            selected: isSelected ? 1 : null,
            population: combinedObject[i].population,
            magnitude: combinedObject[i].magnitude,
          }
        )
      }
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

  Dispatcher.bind('clear-blocks', () => {
    document.querySelector('.map-legend').classList.add('hidden')

    setMap([], [], [])
    mapTooltip.removeAttribute('loading')
    mapTooltip.setAttribute(
      'data',
      JSON.stringify({
        currentRegions: [],
        mode: [],
        arriveData: [],
        departData: [],
      })
    )
  })

  // map
  Dispatcher.bind(
    'update-blocks',
    ({ regionName, direction, arriveData, departData, segment, animate }) => {
      document.querySelector('.map-legend').classList.remove('hidden')

      const tooltipData = {
        currentRegions: regionName,
        arriveData,
        departData,
        mode: ['work', 'study'],
      }
      if (segment === 'workplace') {
        tooltipData.mode = ['work']
      } else if (segment === 'education') {
        tooltipData.mode = ['study']
      }
      const tooltipJSON = JSON.stringify(tooltipData)
      mapTooltip.setAttribute('data', tooltipJSON)
      mapTooltip.removeAttribute('loading')

      // ASON SPECIFIC CODE
      if (segment === '2021-dzn') {
        map.setLayoutProperty('dzn-lines', 'visibility', 'visible')
        map.setLayoutProperty('dzn-fill', 'visibility', 'visible')
      } else if (segment === '2021-sa2') {
        map.setLayoutProperty('dzn-lines', 'visibility', 'none')
        map.setLayoutProperty('dzn-fill', 'visibility', 'none')
      }

      // only really want to toggle the map data for direction
      if (direction === 'all') {
        setMap(arriveData, departData, regionName, animate)
      } else if (direction === 'arrivals') {
        setMap(arriveData, [], regionName, animate)
      } else if (direction === 'departures') {
        setMap([], departData, regionName, animate)
      }
    }
  )
}
