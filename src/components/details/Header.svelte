<script>
  import expand from '/static/expand.svg'
  import { transformFilename } from '../../data.js'

  export let title, firstRegion

  $: path = transformFilename(firstRegion)
</script>

<div class="nav-header">
  <div class="nav-header-flex">
    <div class="title">
      <h2>{(title || '').trim()}</h2>
    </div>
    <nav class="controls">
      <button title="Learn More" class="btn-expand">
        <img alt="Toggle Details" src={expand} />
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
          href="https://www.stats.govt.nz/tools/2018-census-place-summaries/{path}#population-and-dwellings`"
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
