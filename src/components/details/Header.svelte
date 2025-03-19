<script>
  import { run } from 'svelte/legacy'

  import expand from '/static/expand.svg'
  import ason from '/static/css/ason.avif?url'
  import { transformFilename } from '../../data.js'
  import Dispatcher from '../../dispatcher.js'
  import { getSource } from '../../sources.js'
  import ModeToggle from './ModeToggle.svelte'

  let { title, firstRegion, populationLabel, populationLink, populationCount } =
    $props()

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
    if (Object.keys(Dispatcher.concordance).length > 0) {
      // more ason specific stuff
      if (source.brandingClass === 'ason') {
        Dispatcher.currentRegion = Array.from(
          new Set(
            Dispatcher.currentRegion
              .map(
                (i) =>
                  Dispatcher.concordance[i][`${segment}-sa2`] ||
                  Dispatcher.concordance[i][`${segment}-dzn`]
              )
              .flat()
          )
        )
      } else {
        Dispatcher.currentRegion = Array.from(
          new Set(
            Dispatcher.currentRegion
              .map((i) => Dispatcher.concordance[i][`${segment}-sa2`])
              .flat()
          )
        )
      }
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
  // removes the macrons for the stats nz link
  const path = $derived(
    transformFilename(firstRegion)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
  )
  $effect(() => {
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
  <div class="nav-header-grid">
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
    </nav>
    <p class="population-wrapper" class:hidden={isControlsHidden}>
      {#if populationLink}
        <a
          class="population-link"
          href="https://tools.summaries.stats.govt.nz/places/SA2/{path}"
          target="_blank"
          rel="noopener noreferrer"
        >
          <strong class="population-label">{populationLabel}</strong>
          <span class="population-count"
            >{currentSegment.includes('comparison') &&
            parseInt(populationCount) >= 0
              ? '+'
              : undefined}{populationCount}</span
          >
        </a>
      {:else}
        <strong class="population-label">{populationLabel}</strong>
        <span class="population-count"
          >{currentSegment.includes('comparison') &&
          parseInt(populationCount) >= 0
            ? '+'
            : undefined}{populationCount}</span
        >
      {/if}
    </p>
    {#if source.brandingClass === 'ason' || source.brandingClass === 'statsnz'}
      <div class="mode-wrapper" class:hidden={isControlsHidden}>
        <ModeToggle bind:selection />
      </div>
    {/if}
  </div>
</div>

<style>
  .nav-header {
    padding: var(--sidebar-padding) var(--sidebar-padding)
      var(--sidebar-padding);
    background: var(--surface-bg-subtle);
    border-bottom: var(--border);
    position: sticky;
    top: 0;
    margin-bottom: 2rem;
    box-sizing: border-box;
    z-index: 2;
  }

  .nav-header-flex {
    display: flex;
    gap: 0.5rem;
  }

  .nav-header-grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 0.375rem;
    align-items: center;

    @media (max-width: 1020px) {
      grid-template-columns: 1fr;
    }
  }

  .nav-header .title {
    flex: 1;
    overflow: hidden;
  }

  .nav-header h2 {
    margin: 0.15rem 0 0.25rem;
    font-size: 2rem;
    line-height: 2.4rem;
    white-space: pre;
    overflow: hidden;
    text-overflow: ellipsis;
    text-transform: capitalize;

    @media (max-width: 1020px) {
      font-size: 1.5rem;
      line-height: 2rem;
      margin: 0 0 0.25rem;
    }
  }

  .nav-header a {
    color: var(--surface-text);
    text-decoration: none;
  }
  .nav-header a:hover {
    color: var(--surface-text-subtle);
    text-decoration: underline;
  }

  .nav-header p {
    font-size: 0.95rem;
    margin: 0;
  }

  .nav-header .controls,
  .mode-wrapper {
    text-align: right;
    @media (max-width: 1020px) {
      text-align: left;
    }
  }

  .nav-header button {
    border: 0;
    background: transparent;
    color: #ddd;
    font-family: inherit;
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
  }

  .nav-header button {
    text-align: center;
    padding: 0.25rem;
    background: #111;
    border-radius: 50%;
    transition: 100ms ease all;
  }

  .nav-header button:hover {
    background: #444;
  }

  .nav-header button:active {
    background: #333;
  }

  .nav-header button svg,
  .nav-header button img {
    vertical-align: top;
    width: 24px;
    height: 24px;
  }

  .nav-header .controls a {
    display: inline-block;
    font-size: 0.95rem;
  }

  .nav-header a.selected {
    color: var(--surface-text);
    font-weight: bold;
  }

  .nav-header button.btn-expand {
    display: none;
  }

  :global(.map-view) .btn-expand {
    transform: rotate(-180deg);
  }

  @media (max-width: 800px) {
    .nav-header button.btn-expand {
      /*      transform: translate(36px, 0);*/
      display: inline-block;
    }
    /*.nav-header button.btn-close {
      display: none;
      opacity: 0;
      pointer-events: none;
    }*/
  }

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
    margin: 0 3px;
  }
  .ason img.logo {
    display: none;
  }
  p.population-wrapper {
    line-height: 26px;
    font-size: 0.9rem;

    @media (max-width: 1020px) {
      border-top: var(--border);
      margin-top: 0.375rem;
      padding-top: 0.375rem;
    }
  }
  .hidden {
    display: none;
  }
  @media (min-width: 800px) {
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
  }
</style>
