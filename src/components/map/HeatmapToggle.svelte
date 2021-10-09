<script>
  import { getSource } from '../../sources.js'
  const source = getSource()
  const showHeatmap = source.heatmapData != null
</script>

{#if showHeatmap}
<div class="loi-container">
  <label><input type="checkbox" class="loi-input" checked>Locations of Interest</label>
</div>
{/if}

<style>
  .loi-container {
    font-size: 13px;
    line-height: 22px;
    background: rgba(255,0,0,0.2);
    padding: 2px 5px;
  }
  .loi-container input {
    margin: 0;
    margin-right: 4px;
  }
</style>
