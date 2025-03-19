import polylabel from 'polylabel'
import Dispatcher from '../../dispatcher.js'
import { getSource } from '../../sources.js'

const source = getSource()

const datasets = {}

export const bindMapEvents = (map, dataset1, dataset2, tooltipCallback) => {
  datasets.dataset1 = dataset1
  datasets.dataset2 = dataset2

  bindMapboxEvents(map, tooltipCallback)
  bindDispatcherEvents(map, tooltipCallback)
}

const bindMapboxEvents = (map, tooltipCallback) => {
  let activeBlock = null
  let activeDznBlock = null
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
      tooltipCallback({
        id: meshblock.id,
        friendlyName: meshblock.properties.friendlyName,
        showOnly:
          Dispatcher.dataSegment.startsWith('2021-dzn') ||
          Dispatcher.dataSegment.startsWith('2016-dzn')
            ? Dispatcher.dataDirection
            : null,
        populationCount: meshblock.properties.populationCount,
        opacity: 1,
      })
    }
    const { pageX, pageY } = e.originalEvent
    tooltipCallback({
      position: [pageX, pageY],
    })
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

      if (
        Dispatcher.dataDirection === 'arrivals' &&
        (Dispatcher.dataSegment.startsWith('2021-dzn') ||
          Dispatcher.dataSegment.startsWith('2016-dzn'))
      )
        return
      tooltipCallback({
        id: meshblock.id,
        friendlyName: meshblock.properties.friendlyName,
        showOnly: Dispatcher.dataDirection,
        populationCount: meshblock.properties.populationCount,
        opacity: 1,
      })
    }

    const { pageX, pageY } = e.originalEvent
    tooltipCallback({
      position: [pageX, pageY],
    })
  })

  map.on('drag', (e) => {
    const { pageX, pageY } = e.originalEvent
    tooltipCallback({
      position: [pageX, pageY],
    })
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
    tooltipCallback({ opacity: 0 })
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
    tooltipCallback({ opacity: 0 })
  })

  map.on('click', 'sa2-fill', (e) => {
    // ason specific, we use the other event otherwise
    if (source.brandingClass === 'ason') {
      if (
        Dispatcher.dataDirection === 'arrivals' &&
        (Dispatcher.dataSegment.startsWith('2021-dzn') ||
          Dispatcher.dataSegment.startsWith('2016-dzn'))
      )
        return
    }

    const meshblock = e.features[0]
    if (meshblock != null) {
      tooltipCallback({ loading: true })
      if (
        e.originalEvent.ctrlKey ||
        e.originalEvent.metaKey ||
        Dispatcher.currentRegion.includes(meshblock.id)
      ) {
        Dispatcher.addRegion(meshblock.id)
      } else {
        Dispatcher.setRegions([meshblock.id])
      }
    }
  })

  map.on('click', 'dzn-fill', (e) => {
    // ason specific, we use the other event otherwise
    if (source.brandingClass === 'ason') {
      if (
        Dispatcher.dataDirection !== 'arrivals' ||
        (!Dispatcher.dataSegment.startsWith('2021-dzn') &&
          !Dispatcher.dataSegment.startsWith('2016-dzn'))
      )
        return
    }

    const meshblock = e.features[0]
    if (meshblock != null) {
      tooltipCallback({ loading: true })
      if (
        e.originalEvent.ctrlKey ||
        e.originalEvent.metaKey ||
        Dispatcher.currentRegion.includes(meshblock.id)
      ) {
        Dispatcher.addRegion(meshblock.id)
      } else {
        Dispatcher.setRegions([meshblock.id])
      }
    }
  })

  if (source.dynamicShapeFiles || source.dynamicSecondaryShapeFiles) {
    const dynamicFilter = (file, zoom, center, mapSource, datasetName) =>
      file
        .filter((shape) => shape.isLoaded !== true)
        .forEach((shape) => {
          if (
            zoom > shape.zoom &&
            center.lng > shape.bbox[0][0] &&
            center.lng < shape.bbox[1][0] &&
            center.lat > shape.bbox[0][1] &&
            center.lat < shape.bbox[1][1]
          ) {
            shape.isLoaded = true
            loadDynamic(shape.url, mapSource, datasetName)
          }
        })
    map.on('zoom', () => {
      const zoom = map.getZoom()
      const center = map.getCenter()
      dynamicFilter(source.dynamicShapeFiles, zoom, center, 'sa2', 'dataset1')
      if (source.dynamicSecondaryShapeFiles) {
        dynamicFilter(
          source.dynamicSecondaryShapeFiles,
          zoom,
          center,
          'dzn',
          'dataset1'
        )
      }
      if (source.dataset2DynamicShapeFiles) {
        dynamicFilter(
          source.dataset2DynamicShapeFiles,
          zoom,
          center,
          'sa2',
          'dataset2'
        )
      }
      if (source.dataset2DynamicSecondaryShapeFiles) {
        dynamicFilter(
          source.dataset2DynamicSecondaryShapeFiles,
          zoom,
          center,
          'dzn',
          'dataset2'
        )
      }
    })
  }

  const loadDynamic = async (url, mapSource, datasetName) => {
    const res = await fetch(url)
    const newData = await res.json()
    const stateLookup = newData.features.reduce((acc, cur) => {
      acc[cur.properties.name] = cur
      return acc
    }, {})
    const dataset = await datasets[datasetName]
    let currentData
    if (mapSource === 'sa2') {
      currentData = dataset[0]
    } else if (mapSource === 'dzn') {
      currentData = dataset[1]
    }
    const augmentedData = {
      type: 'FeatureCollection',
      features: currentData.features.map((i) => {
        const enhancedData = stateLookup[i.properties.name]
        if (enhancedData) {
          return enhancedData
        }
        return i
      }),
    }
    if (
      ((datasetName === 'dataset1' &&
        !Dispatcher.dataSegment.startsWith('2016-sa2')) ||
        (datasetName === 'dataset2' &&
          Dispatcher.dataSegment.startsWith('2016-sa2'))) &&
      !Dispatcher.dataSegment.startsWith('2021-tz') &&
      !Dispatcher.dataSegment.startsWith('2016-tz')
    ) {
      map.getSource(mapSource).setData(augmentedData)
    }
    if (mapSource === 'sa2') {
      datasets[datasetName] = Promise.all([
        Promise.resolve(augmentedData),
        dataset[1],
        dataset[2],
      ])
    } else if (mapSource === 'dzn') {
      datasets[datasetName] = Promise.all([
        dataset[0],
        Promise.resolve(augmentedData),
        dataset[2],
      ])
    }
    console.info('dynamically loaded', url)
  }
}

const bindDispatcherEvents = (map, tooltipCallback) => {
  let selectedAreas = []

  const setMap = async (arriveData, departData, regionName, animate) => {
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
        const options = { center: polylabel(feature.geometry.coordinates) }
        // will zoom the user in a bit if they are too far out
        if (map.getZoom() < 10) {
          options.zoom = 10
        }
        map.flyTo(options)
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

        combinedObject[i.key].population += Math.abs(i.value) * sign
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
    tooltipCallback({
      loading: false,
      data: {
        currentRegions: [],
        mode: [],
        arriveData: [],
        departData: [],
      },
    })
  })

  // map
  Dispatcher.bind(
    'update-blocks',
    async ({
      regionName,
      direction,
      arriveData,
      departData,
      segment,
      animate,
    }) => {
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
      tooltipCallback({
        loading: false,
        data: tooltipData,
      })

      // ASON SPECIFIC CODE
      if (segment.startsWith('2021-dzn') || segment.startsWith('2016-dzn')) {
        map.setLayoutProperty('dzn-lines', 'visibility', 'visible')
        map.setLayoutProperty('dzn-fill', 'visibility', 'visible')
        if (direction === 'departures') {
          map.moveLayer('dzn-fill', 'sa2-fill')
        } else if (direction === 'arrivals') {
          map.moveLayer('sa2-fill', 'dzn-fill')
        }
      } else if (
        segment.startsWith('2021-sa2') ||
        segment.startsWith('2016-sa2') ||
        segment.startsWith('2021-tz') ||
        segment.startsWith('2016-tz')
      ) {
        map.setLayoutProperty('dzn-lines', 'visibility', 'none')
        map.setLayoutProperty('dzn-fill', 'visibility', 'none')
      }

      // todo: could probably optimize this a little by only calling it if there is a change
      if (segment.startsWith('2016-tz') || segment.startsWith('2021-tz')) {
        const data = await datasets.dataset1
        map.getSource('sa2').setData(data[2])
      } else if (segment.startsWith('2016')) {
        const data = await datasets.dataset2
        map.getSource('sa2').setData(data[0])
        map.getSource('dzn').setData(data[1])
      } else if (segment.startsWith('2021')) {
        const data = await datasets.dataset1
        map.getSource('sa2').setData(data[0])
        map.getSource('dzn').setData(data[1])
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
