<script>
  import { getSource } from '../../sources.js'
  const source = getSource()
</script>

{#if source.brandingClass === 'statsnz'}
  <div>
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
{:else if source.brandingClass === 'wsp'}
  <div>
    <p>
      This visulisation uses data from the Christchurch Transport Model Version
      18.
    </p>
  </div>
{/if}
<div class="desktop">
  <p>
    <strong>Tip:</strong> Hold down
    <strong
      >{#if navigator.platform === 'MacIntel'}⌘ Cmd{:else}Ctrl{/if}</strong
    > to select multiple areas.
  </p>
</div>
<div class="mobile">
  <p>
    <strong>Tip:</strong> Open this app on a PC to get more detailed insights, and
    to select multiple areas.
  </p>
</div>

<style>
  div {
    padding: 0 var(--sidebar-padding);
    color: #ccc;
  }
  p {
    margin: -0.5rem 0 2rem;
  }
  .mobile {
    display: none;
  }

  a {
    color: #90caf9;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  @media (max-width: 1020px) {
    .desktop {
      display: none;
    }
    .mobile {
      display: block;
    }
  }
</style>
