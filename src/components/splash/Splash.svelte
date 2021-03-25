<script>
  import { getSource } from '../../sources.js'

  import Banner from './Banner.svelte'
  import Regions from './Regions.svelte'
  import DataSources from './DataSources.svelte'

  const source = getSource()
</script>

<div class="details-splash">
  {#if source.brandingClass === 'wsp'}
    <Banner dataSource="Christchurch Transport Model Version 18" />
    <Regions
      on:locationChange
      enabledRegions={['nz-chc']}
    />
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
