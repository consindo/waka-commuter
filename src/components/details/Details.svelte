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

  import { modes } from './ModeMap.js'
  import { setDetails, hideDetails } from '../../views/details-render.js'

  import Header from './Header.svelte'
  import Footer from './Footer.svelte'
  import PopulationGraph from '../PopulationGraph.svelte'
  import PopulationPredictions from './PopulationPredictions.svelte'

  export let mapData

  let detailsTitle = null
  let documentTitle = null
  let firstRegion = ''
  let populationLabel = ''

  let hideArrivals = false
  let hideDepartures = false
  let invalidArrival = false
  let invalidDeparture = false

  let tooltip = null
  let arrivals = null
  let departures = null
  let hiddenArrivals = []
  let hiddenDepartures = []

  let populationPredictions = {}

  const source = getSource()

  $: document.title = `${documentTitle ? `${documentTitle} - ` : ''}${
    source.title || 'Commuter - Waka'
  }`

  if (!source.isAllSegmentEnabled) {
    Dispatcher.dataSegment = source.segments[0]
  }

  onMount(() => {
    const friendlyNames = {}
    mapData.then((data) => {
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

      Dispatcher.bind(
        'load-blocks',
        (regionName, direction, segment, animate) => {
          const modifiedRegionNames = regionName.map(regionNameMapper)
          detailsTitle = humanRegionName(modifiedRegionNames, 'full')
          documentTitle = humanRegionName(modifiedRegionNames, 'title')

          firstRegion = regionName[0]

          getData(regionName).then((data) => {
            // depending on the toggle, filter out workspace or education data
            const dataSources = data
              .map((dataSource) => {
                // retuns the matching segment
                const defaultSource = {
                  departTo: {},
                  arriveFrom: {},
                }

                // this is probably a better condition but doesn't capture the single mode
                // if (segment.split('|').length > 1) {
                if (segment.split('-mode-').length > 1) {
                  const combinedSegments = segment.split('|').map((key) => {
                    const data = dataSource[key] || defaultSource

                    let departureModes = null
                    let arrivalModes = null
                    if (segment.startsWith('2021-dzn')) {
                      departureModes = dataSource['2021-dzn']?.departureModes
                      arrivalModes = dataSource['2021-dzn']?.arrivalModes
                    } else if (segment.startsWith('2021-sa2')) {
                      departureModes = dataSource['2021-sa2']?.departureModes
                      arrivalModes = dataSource['2021-sa2']?.arrivalModes
                    } else if (segment.startsWith('2016-dzn')) {
                      departureModes = dataSource['2016-dzn']?.departureModes
                      arrivalModes = dataSource['2016-dzn']?.arrivalModes
                    } else if (segment.startsWith('2016-sa2')) {
                      departureModes = dataSource['2016-sa2']?.departureModes
                      arrivalModes = dataSource['2016-sa2']?.arrivalModes
                    }
                    const name = modes.find(
                      (i) => i.id === `mode-${key.split('mode-')[1]}`
                    ).name
                    if (departureModes) {
                      data.departureModes = {
                        [name]: departureModes[name],
                        Total: departureModes[name],
                      }
                    }
                    if (arrivalModes) {
                      data.arrivalModes = {
                        [name]: arrivalModes[name],
                        Total: arrivalModes[name],
                      }
                    }
                    return data
                  })
                  return [
                    combinedSegments.reduce((acc, cur) => {
                      Object.keys(cur).forEach((key) => {
                        acc[key] = acc[key] || {}
                        Object.keys(cur[key]).forEach((valueKey) => {
                          acc[key][valueKey] = acc[key][valueKey] || 0
                          acc[key][valueKey] += cur[key][valueKey]
                        })
                      })
                      return acc
                    }, {}),
                  ]
                } else if (dataSource[segment] != null) {
                  return [dataSource[segment]]
                } else if (segment === 'all') {
                  return source.segments.map((key) => dataSource[key])
                } else {
                  console.warn('Could not find segment', segment)
                  return defaultSource
                }
              })
              .flat()

            const concordance = data.reduce((acc, cur) => {
              if (cur.concordance) {
                acc[cur.id] = cur.concordance
              }
              return acc
            }, {})
            Dispatcher.concordance = concordance // this just gets used for later

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

            const arriveData = transformData(
              features,
              dataSources,
              'arriveFrom'
            )
            const departData = transformData(features, dataSources, 'departTo')

            let arriveModeData = null
            let departureModeData = null
            if (source.isModeGraphsEnabled === true) {
              if (
                (segment.startsWith('2021-dzn') ||
                  segment.startsWith('2016-dzn')) &&
                direction === 'departures'
              ) {
                arriveModeData = null
              } else {
                arriveModeData = transformModeData(
                  dataSources,
                  sourceKeys,
                  'arrivalModes'
                )
              }
              if (
                (segment.startsWith('2021-dzn') ||
                  segment.startsWith('2016-dzn')) &&
                direction === 'arrivals'
              ) {
                departureModeData = null
              } else {
                departureModeData = transformModeData(
                  dataSources,
                  sourceKeys,
                  'departureModes'
                )
              }
            }

            populationPredictions = data.reduce((acc, cur) => {
              if (cur.tzp22 == null) return acc
              Object.keys(cur.tzp22).forEach((i) => {
                acc[i] = acc[i] || 0
                acc[i] += cur.tzp22[i]
              })
              return acc
            }, {})

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
        }
      )

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
        }) => {
          // map to friendly names
          const friendlyMapper = (i) => ({
            ...i,
            key: regionNameMapper(i.key),
            originalKey: i.key,
          })
          let arriveDataFriendly = arriveData.map(friendlyMapper)
          let departDataFriendly = departData.map(friendlyMapper)
          hiddenArrivals = []
          hiddenDepartures = []
          if (source.brandingClass === 'ason') {
            arriveDataFriendly = arriveDataFriendly.filter((i) => {
              if (
                i.key.startsWith('POW') ||
                i.key.startsWith('No usual') ||
                i.key.startsWith('DZN POW') ||
                i.key.startsWith('DZN No usual')
              ) {
                hiddenArrivals.push(i)
                return false
              }
              return true
            })
            departDataFriendly = departDataFriendly.filter((i) => {
              if (
                i.key.startsWith('POW') ||
                i.key.startsWith('No usual') ||
                i.key.startsWith('DZN POW') ||
                i.key.startsWith('DZN No usual')
              ) {
                hiddenDepartures.push(i)
                return false
              }
              return true
            })
            hiddenArrivals.sort((a, b) => b.value - a.value)
            hiddenDepartures.sort((a, b) => b.value - a.value)
          }

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

          if (segment === 'all') {
            populationLabel = 'Resident Workers & Students:'
          } else if (segment === 'workplace') {
            populationLabel = 'Resident Workers:'
          } else if (segment === 'education') {
            populationLabel = 'Resident Students:'
          } else if (
            segment.startsWith('2021-sa2') ||
            segment.startsWith('2021-dzn') ||
            segment.startsWith('2016-sa2') ||
            segment.startsWith('2016-dzn')
          ) {
            if (segment.includes('-mode-')) {
              populationLabel = 'Filtered 15+ Population:'
            } else {
              populationLabel = 'Resident 15+ Population:'
            }
          }

          if (
            (segment.startsWith('2021-dzn') ||
              segment.startsWith('2016-dzn')) &&
            Dispatcher.dataDirection === 'arrivals'
          ) {
            hideDepartures = true
            hideArrivals = false
            invalidArrival = !(regionName[0] || '').startsWith('DZN')
          } else if (
            (segment.startsWith('2021-dzn') ||
              segment.startsWith('2016-dzn')) &&
            Dispatcher.dataDirection === 'departures'
          ) {
            hideDepartures = false
            hideArrivals = true
            invalidDeparture = (regionName[0] || '').startsWith('DZN')
          } else if (
            segment.startsWith('2021-tz') ||
            segment.startsWith('2016-tz')
          ) {
            hideDepartures = true
            hideArrivals = true
          } else {
            hideDepartures = false
            hideArrivals = false
            invalidDeparture = false
            invalidArrival = false
          }

          arrivals = arriveDataFriendly
          departures = departDataFriendly

          tooltip = tooltipJSON

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
  <Header
    title={detailsTitle}
    {firstRegion}
    {populationLabel}
    populationLink={source === 'statsnz'}
  />
  <div class="arrive-from warning" class:hidden={!invalidArrival}>
    <p>
      A SA2 is selected. Select individual DZNs or switch to SA2 mode to see
      arrivals.
    </p>
  </div>
  <div class:hidden={hideArrivals || invalidArrival}>
    <h3>Arrivals</h3>
    <div class="arrive-from blurb-container" />
    <div class="arrive-from graph-container">
      <div class="location-container">
        <div class="location-inner">
          <div class="location" />
        </div>
        <div class="location-graph">
          {#key arrivals}
            {#if arrivals !== null}
              <PopulationGraph
                data={arrivals}
                mode="arrivals"
                tooltipData={tooltip}
              />
            {/if}
          {/key}
        </div>
        <div class="hidden-trips">
          <ul>
            {#each hiddenArrivals as i}
              <li>
                <strong>{i.key}</strong>: {i.value} people ({(
                  i.percentage * 100
                ).toFixed(2)}%)
              </li>
            {/each}
          </ul>
        </div>
      </div>
      <div class="mode-container">
        <div class="mode-inner">
          <h4>
            Arrival Modes
            {#if source.brandingClass === 'statsnz'}
              <small
                ><a
                  href="http://nzdotstat.stats.govt.nz/WBOS/Index.aspx?DataSetCode=TABLECODE8296"
                  >(NZ.Stat)</a
                ></small
              >
            {/if}
          </h4>
          <div class="mode" />
        </div>
      </div>
    </div>
  </div>
  <div class="depart-to warning" class:hidden={!invalidDeparture}>
    <p>
      There is no departure data for individual DZNs. Select a SA2 or switch to
      arrivals to continue.
    </p>
  </div>
  <div class:hidden={hideDepartures || invalidDeparture}>
    <h3>Departures</h3>
    <div class="depart-to blurb-container" />
    <div class="depart-to graph-container">
      <div class="location-container">
        <div class="location-inner">
          <div class="location" />
        </div>
        <div class="location-graph">
          {#key departures}
            {#if departures !== null}
              <PopulationGraph
                data={departures}
                mode="departures"
                tooltipData={tooltip}
              />
            {/if}
          {/key}
        </div>
        <div class="hidden-trips">
          <ul>
            {#each hiddenDepartures as i}
              <li>
                <strong>{i.key}</strong>: {i.value} people ({(
                  i.percentage * 100
                ).toFixed(2)}%)
              </li>
            {/each}
          </ul>
        </div>
      </div>
      <div class="mode-container">
        <div class="mode-inner">
          <h4>
            Departure Modes
            {#if source.brandingClass === 'statsnz'}
              <small
                ><a
                  href="http://nzdotstat.stats.govt.nz/WBOS/Index.aspx?DataSetCode=TABLECODE8296"
                  >(NZ.Stat)</a
                ></small
              >
            {/if}
          </h4>
          <div class="mode" />
        </div>
      </div>
    </div>
  </div>
  {#if Object.keys(populationPredictions).length > 0 && !invalidDeparture && !invalidArrival}
    {#key populationPredictions}
      <div>
        <h3>NSW Population Projections</h3>
        <PopulationPredictions
          population={populationPredictions}
          rowFilter={['ERP_', 'POPD_', 'PNPD_', 'SPD_', 'OPD_']}
        />
      </div>
      <div>
        <h3>NSW Workforce & Employment Projections</h3>
        <PopulationPredictions
          population={populationPredictions}
          rowFilter={[
            'Emp_Wkf_POPD_15+yrs_',
            'Not_in_Wkf_POPD_15+yrs_',
            'UnEmp_Wkf_POPD_15+yrs_',
            'EMP_',
          ]}
        />
      </div>
    {/key}
  {/if}
  <Footer />
</div>

<style>
  .location-graph {
    text-align: center;
  }
  .hidden-trips ul {
    margin-top: -0.5em;
    margin-bottom: 2.5em;
    padding-left: 1.25em;
    list-style-type: none;
    font-size: 0.75rem;
    line-height: 1.35;
    text-indent: 180px;
    padding-left: 0;
  }
  .warning {
    padding: 0 1em;
    font-size: 1.125rem;
  }
</style>
