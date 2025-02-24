<script>
  import { run } from 'svelte/legacy'

  import expand from '/static/expand.svg'
  import ason from '/static/css/ason.png'
  import { transformFilename } from '../../data.js'
  import Dispatcher from '../../dispatcher.js'
  import { getSource } from '../../sources.js'
  import ModeToggle from './ModeToggle.svelte'

  let { title, firstRegion, populationLabel, populationLink } = $props()

  const source = getSource()

  let isControlsHidden = $state(false)

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
    // ason specific
    if (newSegment === 'tz') {
      isControlsHidden = true
    } else {
      isControlsHidden = false
    }
  }
  const triggerSecondarySegment = (segment) => () => {
    // more ason specific stuff
    if (Object.keys(Dispatcher.concordance).length > 0) {
      Dispatcher.currentRegion = Dispatcher.currentRegion
        .map(
          (i) =>
            Dispatcher.concordance[i][`${segment}-sa2`] ||
            Dispatcher.concordance[i][`${segment}-dzn`]
        )
        .flat()
    }
    const newSegment = segment.toLowerCase()
    const primary = Dispatcher.dataSegment.split('-')[1]
    setSegmentWithMode([newSegment, primary].join('-'), selection)
  }
  let currentSegment = $state(source.segments[0])
  const loadBlocks = () => {
    currentSegment = Dispatcher.dataSegment
  }
  Dispatcher.bind('load-blocks', loadBlocks)

  let selection = $state([])
  const setSegmentWithMode = (segment, selectedModes) => {
    let finalSegment = segment.split('-').slice(0, 2).join('-')
    if (selectedModes.length > 0) {
      finalSegment = selectedModes.map((i) => `${finalSegment}-${i}`).join('|')
    }
    Dispatcher.setSegment(finalSegment)
  }
  let path = $derived(transformFilename(firstRegion))
  run(() => {
    setSegmentWithMode(Dispatcher.dataSegment, selection)
  })
</script>

<div class="nav-header" class:ason={source.brandingClass === 'ason'}>
  {#if source.brandingClass === 'ason'}
    <img src={ason} alt="Ason Logo" class="logo" />
  {/if}
  <div class="nav-header-flex">
    <div class="title">
      <h2>{(title || '').trim()}</h2>
    </div>
    <nav class="controls">
      <button
        title="Learn More"
        class="btn-expand"
        onclick={() =>
          document.getElementById('app').classList.toggle('map-view')}
      >
        <img alt="Toggle Details" src={expand} />
      </button>
      <button title="Close Location" class="btn-close" onclick={triggerClose}>
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
      {#if source.detailsSecondaryControls}
        <nav class="secondary-controls" class:hidden={isControlsHidden}>
          <ul>
            {#each source.detailsSecondaryControls || [] as control}
              <li>
                <a
                  href="#"
                  class="btn-segment"
                  onclick={triggerSecondarySegment(control)}
                  class:selected={currentSegment.split('-')[0] ===
                    control.toLowerCase()}>{control}</a
                >
              </li>
            {/each}
          </ul>
        </nav>
      {/if}
      <p class="population-wrapper" class:hidden={isControlsHidden}>
        {#if populationLink}
          <a
            class="population-link"
            href="https://www.stats.govt.nz/tools/2018-census-place-summaries/{path}#population-and-dwellings`"
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong class="population-label">{populationLabel}</strong>
            <span class="population-count"></span>
          </a>
        {:else}
          <strong class="population-label">{populationLabel}</strong>
          <span class="population-count"></span>
        {/if}
      </p>
    </div>
    <nav class="controls primary-controls">
      <ul>
        {#each source.detailsControls as control}
          <li>
            <a
              href="#"
              class="btn-segment"
              onclick={triggerSegment(control)}
              class:selected={(source.detailsSecondaryControls != null
                ? currentSegment.split('-')[1]
                : currentSegment
              ).startsWith(control.toLowerCase())}>{control}</a
            >
          </li>
        {/each}
      </ul>
      {#if source.brandingClass === 'ason'}
        <div class="mode-wrapper" class:hidden={isControlsHidden}>
          <ModeToggle bind:selection />
        </div>
      {/if}
    </nav>
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
  .primary-controls ul,
  .secondary-controls ul {
    margin-bottom: 0.375rem;
  }
  .primary-controls li:not(:last-child)::after,
  .secondary-controls li:not(:last-child)::after {
    content: '·';
    margin-right: 3px;
  }
  .ason img.logo {
    display: none;
  }
  .mode-wrapper {
    text-align: right;
  }
  .population-wrapper {
    line-height: 26px;
  }
  .hidden {
    display: none;
  }
  @media (min-width: 1020px) {
    .ason {
      height: auto;
    }
    .ason img.logo {
      height: 20px;
      display: inline-block;
    }
  }
  @media (max-width: 599px) {
    h2 {
      font-size: 1.5rem;
    }
    .population-wrapper {
      display: none;
    }
  }
</style>
