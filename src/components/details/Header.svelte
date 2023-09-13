<script>
  import expand from '/static/expand.svg'
  import ason from '/static/css/ason.png'
  import { transformFilename } from '../../data.js'
  import Dispatcher from '../../dispatcher.js'
  import { getSource } from '../../sources.js'
  import ModeToggle from './ModeToggle.svelte'

  export let title, firstRegion, populationLabel, populationLink

  const source = getSource()

  $: path = transformFilename(firstRegion)

  const triggerClose = () => {
    Dispatcher.setRegions([])
  }
  const triggerSegment = (segment) => () => {
    const newSegment = segment.toLowerCase()
    if (source.detailsSecondaryControls != null) {
      const secondary = Dispatcher.dataSegment.split('-')[0]
      setSegmentWithMode([secondary, newSegment].join('-'), selection)
    } else {
      setSegmentWithMode(newSegment, selection)
    }
  }
  const triggerSecondarySegment = (segment) => () => {
    const newSegment = segment.toLowerCase()
    const primary = Dispatcher.dataSegment.split('-')[1]
    setSegmentWithMode([newSegment, primary].join('-'), selection)
  }
  let currentSegment = source.segments[0]
  const loadBlocks = () => {
    currentSegment = Dispatcher.dataSegment
  }
  Dispatcher.bind('load-blocks', loadBlocks)

  let selection = []
  $: setSegmentWithMode(Dispatcher.dataSegment, selection)
  const setSegmentWithMode = (segment, selectedModes) => {
    let finalSegment = segment.split('-').slice(0, 2).join('-')
    if (selectedModes.length > 0) {
      finalSegment = selectedModes.map((i) => `${finalSegment}-${i}`).join('|')
    }
    Dispatcher.setSegment(finalSegment)
  }
</script>

<div class="nav-header" class:ason={source.brandingClass === 'ason'}>
  {#if source.brandingClass === 'ason'}
    <img src={ason} alt="Ason Logo" />
  {/if}
  <div class="nav-header-flex">
    <div class="title">
      <h2>{(title || '').trim()}</h2>
    </div>
    <nav class="controls">
      <button
        title="Learn More"
        class="btn-expand"
        on:click={() =>
          document.getElementById('app').classList.toggle('map-view')}
      >
        <img alt="Toggle Details" src={expand} />
      </button>
      <button title="Close Location" class="btn-close" on:click={triggerClose}>
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
        {#if populationLink}
          <a
            class="population-link"
            href="https://www.stats.govt.nz/tools/2018-census-place-summaries/{path}#population-and-dwellings`"
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong class="population-label">{populationLabel}</strong>
            <span class="population-count" />
          </a>
        {:else}
          <strong class="population-label">{populationLabel}</strong>
          <span class="population-count" />
        {/if}
      </p>
      <nav class="secondary-controls">
        <ul>
          {#each source.detailsSecondaryControls || [] as control}
            <li>
              <a
                href="#"
                class="btn-segment"
                on:click={triggerSecondarySegment(control)}
                class:selected={currentSegment.split('-')[0] ===
                  control.toLowerCase()}>{control}</a
              >
            </li>
          {/each}
        </ul>
      </nav>
    </div>
    <nav class="controls primary-controls">
      <ul>
        {#each source.detailsControls as control}
          <li>
            <a
              href="#"
              class="btn-segment"
              on:click={triggerSegment(control)}
              class:selected={(source.detailsSecondaryControls != null
                ? currentSegment.split('-')[1]
                : currentSegment
              ).startsWith(control.toLowerCase())}>{control}</a
            >
          </li>
        {/each}
      </ul>
    </nav>
    <ModeToggle bind:selection />
  </div>
</div>

<style>
  nav ul {
    display: inline-block;
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  nav li {
    display: inline-block;
  }
  .primary-controls li:not(:last-child)::after,
  .secondary-controls li:not(:last-child)::after {
    content: '·';
    margin-right: 3px;
  }
  .ason {
    height: calc(110px + 24px);
  }
  .ason img {
    height: 13px;
  }
</style>
