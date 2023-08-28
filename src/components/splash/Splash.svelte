<script>
  import { getSource } from '../../sources.js'

  import Banner from './Banner.svelte'
  import Regions from './Regions.svelte'
  import DataSources from './DataSources.svelte'
  import DataSourcesAu from './DataSourcesAu.svelte'

  const source = getSource()

  const getImageUrl = (name) =>
    new URL(`/static/css/${name}.jpg`, import.meta.url).href
</script>

<div class="details-splash">
  {#if source.brandingClass === 'wsp'}
    <Banner
      dataSource="Christchurch Transport Model Version 18"
      background="linear-gradient(
        120deg,
        rgba(10, 0, 20, 0.8) 50%,
        rgba(10, 0, 20, 0.4)
      ), url({getImageUrl('splash-2')})"
    />
    <Regions on:locationChange enabledRegions={['nz-chc']} />
  {:else if source.brandingClass === 'ason'}
    <Banner
      dataSource="2021 Census"
      background="linear-gradient(
        120deg,
        rgba(10, 0, 20, 0.75) 50%,
        rgba(10, 0, 20, 0.3)
      ), url({getImageUrl('splash-3')})"
    />
    <Regions
      on:locationChange
      enabledRegions={[
        'au-syd',
        'au-mel',
        'au-bne',
        'au-per',
        'au-ool',
        'au-adl',
        'au-can',
        'au-ntl',
        'au-hba',
      ]}
    />
    <DataSourcesAu />
  {:else}
    <Banner dataSource="2018 Census" />
    <Regions
      on:locationChange
      enabledRegions={[
        'nz-akl',
        'nz-chc',
        'nz-wlg',
        'nz-trg',
        'nz-hlz',
        'nz-dud',
      ]}
    />
    <DataSources />
  {/if}
</div>
