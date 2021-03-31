<script>
  import { onMount } from 'svelte'

  import { getSource } from '../../sources.js'
  import Dispatcher from '../../dispatcher.js'
  import {
    getData,
    getLocation,
    transformData,
    transformModeData,
    chooseBestName,
    humanRegionName,
  } from '../../data.js'

  import { bindDetailsEvents } from '../../views/details-events.js'
  import {
    setDetailsControls,
    setDetails,
    hideDetails,
  } from '../../views/details-render.js'

  import Header from './Header.svelte'
  import Footer from './Footer.svelte'

  let detailsTitle = null
  let documentTitle = null
  let firstRegion = ''

  $: document.title = `${
    documentTitle ? `${documentTitle} - ` : ''
  }Commuter - Waka`

  const sa2Data = window.sa2Data
  const source = getSource()

  if (!source.isAllSegmentEnabled) {
    Dispatcher.dataSegment = source.segments[0]
  }

  onMount(() => {
    setDetailsControls(source.detailsControls, source.detailsSecondaryControls)
    bindDetailsEvents()

    const friendlyNames = {}
    sa2Data.then((data) => {
      const features = data.features

      // easy reference to the freindly names
      features.forEach((feature) => {
        const { name, friendlyName } = feature.properties
        friendlyNames[name] = friendlyName
      })

      const regionNameMapper = (name) =>
        chooseBestName(
          humanRegionName([name || ''], 'condensed'),
          friendlyNames[name]
        )

      Dispatcher.bind('clear-blocks', () => {
        hideDetails()
        documentTitle = null
      })

      Dispatcher.bind('load-blocks', (regionName, direction, segment, animate) => {
        const modifiedRegionNames = regionName.map(regionNameMapper)
        detailsTitle = humanRegionName(modifiedRegionNames, 'full')
        documentTitle = humanRegionName(modifiedRegionNames, 'title')

        firstRegion = regionName[0]

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
            animate,
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
          // map to friendly names
          const friendlyMapper = (i) => ({
            ...i,
            key: regionNameMapper(i.key),
            originalKey: i.key,
          })
          const arriveDataFriendly = arriveData.map(friendlyMapper)
          const departDataFriendly = departData.map(friendlyMapper)

          const tooltipData = {
            currentRegions: regionName.map(regionNameMapper),
            arriveData: arriveDataFriendly,
            departData: departDataFriendly,
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
            arriveDataFriendly,
            departDataFriendly,
            arriveModeData,
            departureModeData,
            tooltipJSON,
            segment
          )
        }
      )
    })
  })
</script>

<div class="details-location hidden">
  <Header title={detailsTitle} {firstRegion} />
  <h3>Arrivals</h3>
  <div class="arrive-from blurb-container" />
  <div class="arrive-from graph-container">
    <div class="location-container">
      <div class="location-inner">
        <div class="location" />
      </div>
    </div>
    <div class="mode-container">
      <div class="mode-inner">
        <h4>
          Arrival Modes
          <small
            ><a
              href="http://nzdotstat.stats.govt.nz/WBOS/Index.aspx?DataSetCode=TABLECODE8296"
              >(NZ.Stat)</a
            ></small
          >
        </h4>
        <div class="mode" />
      </div>
    </div>
  </div>
  <h3>Departures</h3>
  <div class="depart-to blurb-container" />
  <div class="depart-to graph-container">
    <div class="location-container">
      <div class="location-inner">
        <div class="location" />
      </div>
    </div>
    <div class="mode-container">
      <div class="mode-inner">
        <h4>
          Departure Modes
          <small
            ><a
              href="http://nzdotstat.stats.govt.nz/WBOS/Index.aspx?DataSetCode=TABLECODE8296"
              >(NZ.Stat)</a
            ></small
          >
        </h4>
        <div class="mode" />
      </div>
    </div>
  </div>
  <Footer />
</div>
