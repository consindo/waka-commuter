<script>
  import Banner from './Banner.svelte'
  import Regions from './Regions.svelte'
  import DataSources from './DataSources.svelte'
</script>

<div class="details-splash">
  <Banner />
  <Regions on:locationChange />
  <DataSources />
</div>
