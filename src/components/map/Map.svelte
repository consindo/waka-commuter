<script>
  import Legend from './Legend.svelte'
</script>

<div id="map">
  <div id="map-content"></div>
  <Legend />
</div>

<style>
  #map {
    flex: 1;
  }

  #map-content {
    width: 100%;
    height: 100%;
  }
</style>
