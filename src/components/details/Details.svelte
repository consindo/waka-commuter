<script>
  import { onMount } from 'svelte'

  import { getSource } from '../../sources.js'
  import Dispatcher from '../../dispatcher.js'
  import {
    getData,
    getLocation,
    transformData,
    transformModeData,
    transformFilename,
    chooseBestName,
    humanRegionName,
  } from '../../data.js'

  import { bindDetailsEvents } from '../../views/details-events.js'
  import {
    setDetailsControls,
    setDetails,
    hideDetails,
  } from '../../views/details-render.js'

  const sa2Data = window.sa2Data
  const source = getSource()

  if (!source.isAllSegmentEnabled) {
    Dispatcher.dataSegment = source.segments[0]
  }

  onMount(() => {
    setDetailsControls(source.detailsControls, source.detailsSecondaryControls)
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
</script>

<div class="details-location hidden">
  <div class="nav-header">
    <div class="nav-header-flex">
      <div class="title">
        <h2 id="location-header" />
      </div>
      <nav class="controls">
        <button title="Learn More" class="btn-expand">
          <img alt="Toggle Details" src="expand.svg" />
        </button>
        <button title="Close Location" class="btn-close">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            alt="Close Location"
            fill="#fff"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            />
          </svg>
        </button>
      </nav>
    </div>
    <div class="nav-header-flex">
      <div class="title">
        <p title="Resident Population">
          <a
            class="population-link"
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong class="population-label" />
            <span class="population-count" />
          </a>
        </p>
        <nav class="secondary-controls" />
      </div>
      <nav class="controls primary-controls" />
    </div>
  </div>
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
  <div class="tip-container">
    <p>
      The
      <a
        href="https://datafinder.stats.govt.nz/data/category/census/2018/commuter-view/"
        >Commuter View dataset</a
      >
      is used for the map & bubble visualisations, while the
      <a
        href="http://nzdotstat.stats.govt.nz/WBOS/Index.aspx?DataSetCode=TABLECODE8296"
        >NZ.Stat repository</a
      >
      is used for the modes of travel, and resident population.
    </p>
  </div>
  <div class="tip-container desktop">
    <p>
      <strong>Tip:</strong> Hold down
      <strong
        >{#if navigator.platform === 'MacIntel'}⌘ Cmd{:else}Ctrl{/if}</strong
      > to select multiple areas.
    </p>
  </div>
  <div class="tip-container mobile">
    <p>
      <strong>Tip:</strong> Open this app on a PC to get more detailed insights,
      and to select multiple areas.
    </p>
  </div>
</div>
