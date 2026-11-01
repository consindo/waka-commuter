<script>
  import { getSource } from '../../sources.js'

  import Banner from './Banner.svelte'
  import Regions from './Regions.svelte'
  import DataSources from './DataSources.svelte'
  import DataSourcesAu from './DataSourcesAu.svelte'

  const { setLocation } = $props()

  const source = getSource()

  const getImageUrl = (name) =>
    new URL(`/static/css/${name}`, import.meta.url).href
</script>

<div class="details-splash">
  {#if source.brandingClass === 'wsp'}
    <Banner
      dataSource="Christchurch Transport Model Version 18"
      background="linear-gradient(
        120deg,
        rgba(10, 0, 20, 0.8) 50%,
        rgba(10, 0, 20, 0.4)
      ), url({getImageUrl('splash-2.avif')})"
    />
    <Regions {setLocation} enabledRegions={['nz-chc']} />
  {:else if source.brandingClass === 'ason'}
    <Banner
      dataSource="2021 Census"
      background="linear-gradient(
        120deg,
        rgba(10, 0, 20, 0.75) 50%,
        rgba(10, 0, 20, 0.3)
      ), url({getImageUrl('splash-3.avif')})"
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
    <Banner title="Explore how we travel" dataSource="2018 & 2023 MATSim" branding="aucklandcouncil" />
    <p>
      This uses the full 2018 & 2023 MATSim travel model. Trips back home are
      filtered out by default.
    </p>
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
    padding: 0 var(--sidebar-padding);
    line-height: 1.35;
  }
</style>
