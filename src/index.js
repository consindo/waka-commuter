import { getSource } from './sources.js'
import {
  getData,
  getLocation,
  transformData,
  transformModeData,
  transformFilename,
  chooseBestName,
  humanRegionName,
} from './data.js'
import { bindDetailsEvents } from './views/details-events.js'
import {
  setDetailsControls,
  setDetails,
  hideDetails,
} from './views/details-render.js'
import Dispatcher from './dispatcher.js'
import './components/map-tooltip.js'
import App from './App.svelte'

const source = getSource()
if (!source.isAllSegmentEnabled) {
  Dispatcher.dataSegment = source.segments[0]
}
const sa2Data = fetch(source.shapeFile).then((res) => res.json())
window.sa2Data = sa2Data

const app = new App({
  target: document.getElementById('svelte-app'),
  props: {
    flyTo: (e) => {
      const { lat, lng, zoom } = e.detail
      window.mapboxMap.flyTo({
        center: [lng, lat],
        zoom,
        essential: true,
      })
      document.getElementById('app').classList.add('map-view')
    },
  },
})

document.addEventListener('DOMContentLoaded', () => {
  setDetailsControls(source.detailsControls, source.detailsSecondaryControls)
  if (source.brandingClass !== '') {
    document.querySelector('.branding').classList.add(source.brandingClass)
  }

  bindDetailsEvents()

  sa2Data.then((data) => {
    const features = data.features

    Dispatcher.bind('clear-blocks', () => {
      hideDetails()
    })

    Dispatcher.bind('load-blocks', (regionName, direction, segment) => {
      document
        .querySelector('.population-link')
        .setAttribute(
          'href',
          `https://www.stats.govt.nz/tools/2018-census-place-summaries/${transformFilename(
            regionName[0]
          )}#population-and-dwellings`
        )

      getData(regionName).then((data) => {
        // depending on the toggle, filter out workspace or education data
        const dataSources = data
          .map((dataSource) => {
            // retuns the matching segment
            if (dataSource[segment] != null) {
              return [dataSource[segment]]
            } else if (segment === 'all') {
              return source.segments.map((key) => dataSource[key])
            } else {
              console.error('Could not find segment', segment)
            }
          })
          .flat()

        // relies on no colons being in the keyNames
        const sourceKeys = regionName
          .map((i) => {
            if (segment === 'all') {
              return source.segments.map((key) => [i, key].join(':'))
            } else {
              return [[i, segment].join(':')]
            }
          })
          .flat()

        const arriveData = transformData(features, dataSources, 'arriveFrom')
        const departData = transformData(features, dataSources, 'departTo')

        let arriveModeData = null
        let departureModeData = null
        if (source.isModeGraphsEnabled === true) {
          arriveModeData = transformModeData(
            dataSources,
            sourceKeys,
            'arrivalModes'
          )
          departureModeData = transformModeData(
            dataSources,
            sourceKeys,
            'departureModes'
          )
        }

        Dispatcher.trigger('update-blocks', {
          regionName,
          direction,
          segment,
          arriveData,
          departData,
          arriveModeData,
          departureModeData,
        })
      })
    })

    // details
    Dispatcher.bind(
      'update-blocks',
      ({
        regionName,
        arriveData,
        departData,
        arriveModeData,
        departureModeData,
        segment,
      }) => {
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

        // also consuming the tooltip data in the population bubbles
        const initialLocation = getLocation(features, regionName[0])
        setDetails(
          initialLocation,
          arriveData,
          departData,
          arriveModeData,
          departureModeData,
          tooltipJSON,
          segment
        )
      }
    )
  })
})
