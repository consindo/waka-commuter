<script>
  import { getSource } from '../../sources.js'

  import Banner from './Banner.svelte'
  import Regions from './Regions.svelte'
  import DataSources from './DataSources.svelte'
  import DataSourcesAu from './DataSourcesAu.svelte'

  const { setLocation } = $props()

  const source = getSource()

  const getImageUrl = (name) =>
    new URL(`/static/css/${name}.avif`, import.meta.url).href
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
    <Regions {setLocation} enabledRegions={['nz-chc']} />
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
      {setLocation}
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
  {:else if source.brandingClass === 'aucklandcouncil'}
    <Banner dataSource="2018 MATSim" />
    <p>This uses 2018 MATSim travel model, with <strong>trips unfiltered</strong>. This means each area captures trips made within the area, and return trips (i.e a person going to work and returning home later will be counted in the arrivals and the departures). While the visualisation is functional, it is confusing because of data being unfiltered!</p>
    <p>We can map trips to any geometries we want - this version of the app allows you to switch between SA2 & SA3. You can also use Ctrl+Click to select multiple areas.</p>
  {:else}
    <Banner dataSource="2023 & 2018 Census" />
    <Regions
      {setLocation}
      enabledRegions={[
        'nz-akl',
        'nz-chc',
        'nz-wlg',
        'nz-hlz',
        'nz-trg',
        'nz-hutt',
        'nz-dud',
        'nz-pmr',
      ]}
    />
    <DataSources />
  {/if}
</div>

<style>
  p {
    padding: 0 1.25rem;
  }
</style>
