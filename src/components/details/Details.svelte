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

  import { 
    transformVaccine,
    transformEthnicity
  } from '../../covid.js'

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

  const sa2Data = window.sa2Data
  const source = getSource()

   $: document.title = `${
    documentTitle ? `${documentTitle} - ` : ''
  }${source.title || 'Commuter'} - Waka`

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

          // aggregate vaccine
          let vaccineData = null
          let ethnicityData = null
          if (source.isCovidBlurbEnabled === true) {
            vaccineData = transformVaccine(data)
            ethnicityData = transformEthnicity(data)  
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
            vaccineData,
            ethnicityData,
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
          animate,
          vaccineData,
          ethnicityData,
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
            segment,
            vaccineData,
            ethnicityData
          )
        }
      )
    })
  })
</script>

<div class="details-location hidden">
  <Header title={detailsTitle} {firstRegion} />
  {#if source.isCovidBlurbEnabled}
  <div class="covid-details">
    <h3>COVID-19</h3>
    <div class="covid-details-inner">
      <div class="dynamic-covid">
        <div class="total-container"></div>
        <div class="maori-container"></div>
        <div class="pacific-container"></div>
      </div>
      <div class="mode-container">
        <div class="mode-inner">
          <h4>
            Ethnicity
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
  </div>
  {/if}
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

<style>
  .covid-details-inner {
    display: flex;
    margin-bottom: 1.5rem;
    align-items: center;
  }
  .dynamic-covid {
    margin-top: 1rem;
    flex: 1;
    padding: 0 var(--sidebar-padding) 1rem;
  }
  @media (max-width: 1500px) {
    .covid-details-inner {
      display: block;
    }
  }
</style>
