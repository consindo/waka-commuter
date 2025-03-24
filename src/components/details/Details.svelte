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

  import Header from './Header.svelte'
  import Footer from './Footer.svelte'
  import DetailsBlurb from './DetailsBlurb.svelte'
  import PopulationGraph from '../PopulationGraph.svelte'
  import PopulationPredictions from './PopulationPredictions.svelte'
  import TravelMode from './TravelMode.svelte'
  import PopulationBubbles from './PopulationBubbles.svelte'
  import DetailsDeltaBlurb from './DetailsDeltaBlurb.svelte'

  let { mapData } = $props()

  let detailsTitle = $state(null)
  let documentTitle = $state(null)
  let firstRegion = $state('')
  let populationLabel = $state('')
  let populationCount = $state('')

  let hideArrivals = $state(false)
  let hideDepartures = $state(false)
  let invalidArrival = $state(false)
  let invalidDeparture = $state(false)

  let tooltip = $state(null)
  let arrivals = $state(null)
  let departures = $state(null)
  let hiddenArrivals = $state([])
  let hiddenDepartures = $state([])

  let populationPredictions = $state({})

  let currentRegions = $state(null)
  let dataSegment = $state(null)
  let arriveMode = $state(null)
  let departureMode = $state(null)

  let initialLocation = $state(null)

  const source = getSource()

  Dispatcher.dataSegment = source.segments[0]

  // todo: this needs to be removed from onmount
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
        // todo: make this more svelte
        document.querySelector('.details-splash').classList.remove('hidden')
        document.querySelector('.details-location').classList.add('hidden')

        documentTitle = null
      })

      Dispatcher.bind(
        'load-blocks',
        (regionName, direction, segment, animate) => {
          const modifiedRegionNames = regionName.map(regionNameMapper)
          detailsTitle = humanRegionName(modifiedRegionNames, 'full')
          documentTitle = humanRegionName(modifiedRegionNames, 'title')

          firstRegion = regionName[0]

          const objectDelta = (target, object1, object2) => {
            new Set([...Object.keys(object1), ...Object.keys(object2)]).forEach(
              (i) => {
                target[i] = (object1[i] || 0) - (object2[i] || 0)
              }
            )
            return target
          }
          const objectBaseline = (target, object1, object2) => {
            new Set([...Object.keys(object1), ...Object.keys(object2)]).forEach(
              (i) => {
                target[i] = object2[i] || 0
              }
            )
            return target
          }

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
                    const data = structuredClone(defaultSource)

                    let departureModes = null
                    let arrivalModes = null
                    let departureModesBaseline = null
                    let arrivalModesBaseline = null

                    const rootPortion = segment.split('-').slice(0, 2).join('-')
                    if (rootPortion.includes('comparison')) {
                      const rootSegment1 =
                        dataSource[rootPortion.replace('comparison', '2023')] ||
                        defaultSource
                      const rootSegment2 =
                        dataSource[rootPortion.replace('comparison', '2018')] ||
                        defaultSource
                      const specificSegment1 =
                        dataSource[key.replace('comparison', '2023')] ||
                        defaultSource
                      const specificSegment2 =
                        dataSource[key.replace('comparison', '2018')] ||
                        defaultSource

                      departureModes = objectDelta(
                        {},
                        rootSegment1?.departureModes || {},
                        rootSegment2?.departureModes || {}
                      )
                      departureModesBaseline = objectBaseline(
                        {},
                        rootSegment1?.departureModes || {},
                        rootSegment2?.departureModes || {}
                      )
                      arrivalModes = objectDelta(
                        {},
                        rootSegment1?.arrivalModes || {},
                        rootSegment2?.arrivalModes || {}
                      )
                      arrivalModesBaseline = objectBaseline(
                        {},
                        rootSegment1?.arrivalModes || {},
                        rootSegment2?.arrivalModes || {}
                      )
                      data.arriveFrom = objectDelta(
                        {},
                        specificSegment1.arriveFrom,
                        specificSegment2.arriveFrom
                      )
                      data['arriveFrom-baseline'] = objectBaseline(
                        {},
                        specificSegment1.arriveFrom,
                        specificSegment2.arriveFrom
                      )
                      data.departTo = objectDelta(
                        {},
                        specificSegment1.departTo,
                        specificSegment2.departTo
                      )
                      data['departTo-baseline'] = objectBaseline(
                        {},
                        specificSegment1.departTo,
                        specificSegment2.departTo
                      )
                    } else {
                      if (dataSource[key]) {
                        data.departTo = dataSource[key]?.departTo
                        data.arriveFrom = dataSource[key]?.arriveFrom
                      }
                      departureModes = dataSource[rootPortion]?.departureModes
                      arrivalModes = dataSource[rootPortion]?.arrivalModes
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
                    if (departureModesBaseline) {
                      data['departureModes-baseline'] = {
                        [name]: departureModesBaseline[name],
                        Total: departureModesBaseline[name],
                      }
                    }
                    if (arrivalModes) {
                      data.arrivalModes = {
                        [name]: arrivalModes[name],
                        Total: arrivalModes[name],
                      }
                    }
                    if (arrivalModesBaseline) {
                      data['arrivalModes-baseline'] = {
                        [name]: arrivalModesBaseline[name],
                        Total: arrivalModesBaseline[name],
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
                          acc[key][valueKey] += cur[key][valueKey] || 0
                        })
                      })
                      return acc
                    }, {}),
                  ]
                } else if (segment.includes('comparison')) {
                  const segment1 =
                    dataSource[segment.replace('comparison', '2023')]
                  const segment2 =
                    dataSource[segment.replace('comparison', '2018')]

                  const delta = {}
                  Object.keys(segment1).forEach((i) => {
                    delta[i] = delta[i] || {}
                    delta[`${i}-baseline`] = delta[`${i}-baseline`] || {}
                    objectDelta(delta[i], segment1[i], segment2[i])
                    objectBaseline(
                      delta[`${i}-baseline`],
                      segment1[i],
                      segment2[i]
                    )
                  })
                  return delta
                } else if (dataSource[segment] != null) {
                  return [dataSource[segment]]
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
                return [[i, segment].join(':')]
              })
              .flat()

            const arriveData = transformData(
              features,
              dataSources,
              'arriveFrom'
            )
            const departData = transformData(features, dataSources, 'departTo')

            let arriveModeData = null
            let arriveModeBaseline = null
            let departureModeData = null
            let departureModeBaseline = null
            if (source.isModeGraphsEnabled === true) {
              if (
                (segment.startsWith('2021-dzn') ||
                  segment.startsWith('2016-dzn')) &&
                direction === 'departures'
              ) {
                arriveModeData = null
              } else {
                ;[arriveModeData, arriveModeBaseline] = transformModeData(
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
                ;[departureModeData, departureModeBaseline] = transformModeData(
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
              arriveModeBaseline,
              departureModeBaseline,
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
          arriveModeBaseline,
          departureModeBaseline,
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

          currentRegions = regionName.map(regionNameMapper)

          const tooltipData = {
            currentRegions,
            arriveData: arriveDataFriendly,
            departData: departDataFriendly,
            mode: ['work', 'study'],
          }
          if (segment === 'workplace') {
            tooltipData.mode = ['work']
          } else if (segment === 'education') {
            tooltipData.mode = ['study']
          }

          if (segment.includes('-education-mode-')) {
            populationLabel = 'Filtered Students:'
          } else if (segment.includes('-workplace-mode-')) {
            populationLabel = 'Filtered Workers:'
          } else if (segment.includes('-all-mode-')) {
            populationLabel = 'Filtered Population:'
          } else if (segment.endsWith('-all')) {
            populationLabel = 'Resident Workers & Students:'
          } else if (segment.endsWith('-workplace')) {
            populationLabel = 'Resident Workers:'
          } else if (segment.endsWith('-education')) {
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
          if (segment.includes('comparison')) {
            populationLabel = 'Change in ' + populationLabel
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
            hideDepartures =
              (regionName[0] || '').startsWith('TZ') ||
              Dispatcher.dataDirection === 'arrivals'
            hideArrivals =
              (regionName[0] || '').startsWith('TZ') ||
              Dispatcher.dataDirection === 'departures'
            invalidDeparture = false
            invalidArrival = false
          }

          arrivals = arriveDataFriendly
          departures = departDataFriendly

          arriveMode = [arriveModeData, arriveModeBaseline]
          departureMode = [departureModeData, departureModeBaseline]

          tooltip = tooltipData

          // also consuming the tooltip data in the population bubbles
          initialLocation = getLocation(features, regionName[0])

          // todo: make this more svelte
          document.querySelector('.details-splash').classList.add('hidden')
          document.querySelector('.details-location').classList.remove('hidden')

          let pop = 'Unknown'
          if (
            departureModeData != null &&
            departureModeData.Total.Total !== undefined
          ) {
            pop = departureModeData.Total.Total.toLocaleString()
          } else if (
            arriveModeData != null &&
            arriveModeData.Total.Total !== undefined
          ) {
            pop = arriveModeData.Total.Total.toLocaleString()
          }
          if (source.isModeGraphsEnabled) {
            populationCount = pop
          }

          dataSegment = segment
        }
      )
    })
  })

  const isComparison = $derived((dataSegment || '').includes('comparison'))
</script>

<svelte:head>
  <title
    >{documentTitle ? `${documentTitle} - ` : ''}{source.title ||
      'Commuter - Waka'}</title
  >
</svelte:head>

<div class="details-location hidden">
  <Header
    title={detailsTitle}
    {firstRegion}
    {populationLabel}
    populationLink={source.brandingClass === 'statsnz'}
    {populationCount}
  />
  <div class="arrive-from warning" class:hidden={!invalidArrival}>
    <p>
      A SA2 is selected. Select individual DZNs or switch to SA2 mode to see
      arrivals.
    </p>
  </div>
  {#if isComparison}
    <h3>Comparison</h3>
    <DetailsDeltaBlurb
      {currentRegions}
      segment={dataSegment}
      {arrivals}
      {departures}
      arrivalModeData={arriveMode}
      departureModeData={departureMode}
    />
  {/if}
  <div class:hidden={hideArrivals || invalidArrival}>
    <h3>Arrivals</h3>
    {#if currentRegions && !isComparison}
      <DetailsBlurb
        mode="arrivals"
        {currentRegions}
        segment={dataSegment}
        destinationData={arrivals}
        modeData={arriveMode[0]}
      />
    {/if}
    <div class="arrive-from graph-container">
      <div class="location-container">
        {#if initialLocation && !isComparison}
          <div class="location-inner">
            <PopulationBubbles
              scale={initialLocation}
              data={arrivals}
              tooltipData={tooltip}
              showOnly="arrivals"
              attribution={source.brandingClass === 'statsnz'}
              width="580"
              height="400"
            />
          </div>
        {/if}
        <div class="location-graph">
          {#key arrivals}
            {#if arrivals !== null && arrivals.length > 0}
              <PopulationGraph
                data={arrivals}
                mode="arrivals"
                tooltipData={tooltip}
                isComparison={dataSegment.includes('comparison')}
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
            {dataSegment && dataSegment.includes('comparison')
              ? 'Change in '
              : ''}Arrival Modes
            {#if source.brandingClass === 'statsnz'}
              <small
                ><a
                  href="https://explore.data.stats.govt.nz/vis?pg=0&snb=9&df%5Bds%5D=ds-nsiws-disseminate&df%5Bid%5D=CEN23_TBT_008&df%5Bag%5D=STATSNZ&df%5Bvs%5D=1.0&dq=twu001%2Btwu003%2Btwu004%2Btwu005%2Btwu006%2Btwu007%2Btwu009%2Btwu010%2Btwu012%2Btwu016%2BtwuTS%2Btwu999%2Btww001%2Btww003%2Btww004%2Btww005%2Btww006%2Btww007%2Btww009%2Btww010%2Btww012%2Btww016%2BtwwTS%2Btww999%2Btee001%2Btee002%2Btee003%2Btee004%2Btee005%2Btee006%2Btee007%2Btee008%2Btee009%2Btee010%2BteeTS%2Btee999%2Bteu001%2Bteu002%2Bteu003%2Bteu004%2Bteu005%2Bteu006%2Bteu007%2Bteu008%2Bteu009%2Bteu010%2BteuTS%2Bteu999%2BteuTotal%2BteeTotal%2BtwuTotal%2BtwwTotal.SA2Total.2018%2B2023&ly%5Brw%5D=CEN23_TBT_IND_003&ly%5Bcl%5D=CEN23_YEAR_001&to%5BTIME%5D=false&fs%5B0%5D=2023%20Census%2C0%7CTransport%23CAT_TRANSPORT%23&fc=2023%20Census&bp=true"
                  >(Aotearoa Data Explorer)</a
                ></small
              >
            {/if}
          </h4>
          {#if arriveMode}
            <TravelMode
              data={arriveMode[0].Total}
              baseline={arriveMode[1].Total}
              isComparison={dataSegment.includes('comparison')}
            />
          {/if}
          <div class="mode"></div>
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
    {#if currentRegions && !isComparison}
      <DetailsBlurb
        mode="departures"
        {currentRegions}
        segment={dataSegment}
        destinationData={departures}
        modeData={departureMode[0]}
      />
    {/if}
    <div class="depart-to graph-container">
      <div class="location-container">
        {#if initialLocation && !isComparison}
          <div class="location-inner">
            <PopulationBubbles
              scale={initialLocation}
              data={departures}
              tooltipData={tooltip}
              showOnly="departures"
              attribution={source.brandingClass === 'statsnz'}
              width="580"
              height="400"
            />
          </div>
        {/if}
        <div class="location-graph">
          {#key departures}
            {#if departures !== null && departures.length > 0}
              <PopulationGraph
                data={departures}
                mode="departures"
                isComparison={dataSegment.includes('comparison')}
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
            {dataSegment && dataSegment.includes('comparison')
              ? 'Change in '
              : ''}Departure Modes
            {#if source.brandingClass === 'statsnz'}
              <small
                ><a
                  href="https://explore.data.stats.govt.nz/vis?pg=0&snb=9&df%5Bds%5D=ds-nsiws-disseminate&df%5Bid%5D=CEN23_TBT_008&df%5Bag%5D=STATSNZ&df%5Bvs%5D=1.0&dq=twu001%2Btwu003%2Btwu004%2Btwu005%2Btwu006%2Btwu007%2Btwu009%2Btwu010%2Btwu012%2Btwu016%2BtwuTS%2Btwu999%2Btww001%2Btww003%2Btww004%2Btww005%2Btww006%2Btww007%2Btww009%2Btww010%2Btww012%2Btww016%2BtwwTS%2Btww999%2Btee001%2Btee002%2Btee003%2Btee004%2Btee005%2Btee006%2Btee007%2Btee008%2Btee009%2Btee010%2BteeTS%2Btee999%2Bteu001%2Bteu002%2Bteu003%2Bteu004%2Bteu005%2Bteu006%2Bteu007%2Bteu008%2Bteu009%2Bteu010%2BteuTS%2Bteu999%2BteuTotal%2BteeTotal%2BtwuTotal%2BtwwTotal.SA2Total.2018%2B2023&ly%5Brw%5D=CEN23_TBT_IND_003&ly%5Bcl%5D=CEN23_YEAR_001&to%5BTIME%5D=false&fs%5B0%5D=2023%20Census%2C0%7CTransport%23CAT_TRANSPORT%23&fc=2023%20Census&bp=true"
                  >(Aotearoa Data Explorer)</a
                ></small
              >
            {/if}
          </h4>
          {#if departureMode}
            <TravelMode
              data={departureMode[0].Total}
              baseline={departureMode[1].Total}
              isComparison={dataSegment.includes('comparison')}
            />
          {/if}
          <div class="mode"></div>
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

  .location-inner {
    background: var(--surface-bg-subtle);
    border-radius: 0 10px 10px 0;
    border: var(--border);
    border-left: 0;
    margin-bottom: 2rem;

    @media (max-width: 1650px) {
      border-radius: 0;
      border-right: 0;
      margin-bottom: 1rem;
    }
  }

  .mode-container {
    min-width: 300px;
    overflow-x: hidden;
  }

  .mode-inner {
    width: 300px;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 0.25rem 0 1rem;
    border-radius: 5px 0 0 5px;
    height: 100%;

    @media (max-width: 1650px) {
      margin-bottom: 1rem;
    }
  }

  .mode-container h4 {
    color: var(--surface-text);
    margin: 0 1.25rem 1.25rem;
    font-size: 1rem;
  }

  .mode-container h4 a {
    color: var(--surface-text-subtle);
    font-weight: normal;
    text-decoration: none;
  }
  .mode-container h4 a:hover {
    text-decoration: underline;
  }
</style>
