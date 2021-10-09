<script>
  import HeatmapToggle from './HeatmapToggle.svelte'
</script>

<div class="map-legend hidden all">
  <HeatmapToggle />
  <div class="map-legend-colors" />
  <ul>
    <li class="hide-departures hide-all">Less Arrivals</li>
    <li class="hide-departures">More Arrivals</li>
    <li class="hide-arrivals hide-all">Less Departures</li>
    <li class="hide-arrivals">More Departures</li>
  </ul>
</div>

<style>
  .map-legend {
    width: 220px;
    background: rgba(20, 20, 20, 0.6);
    border-radius: 4px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    position: absolute;
    bottom: 10px;
    left: 49px;
    color: #fff;
    user-select: none;
    overflow: hidden;
  }

  /* Warning: map-styles.js is source of truth for this */
  .map-legend-colors {
    height: 20px;
    border-radius: 2px;
    background-image: linear-gradient(
      90deg,
      #0d47a1,
      #2196f3,
      #ba68c8,
      #f44336,
      #b71c1c
    );
    margin: 5px;
  }

  ul {
    margin: 0;
    padding: 0 7px 3px;
    list-style-type: none;
    display: flex;
    font-family: 'Fira Sans Condensed';
    font-size: 11px;
  }
  li {
    flex: 1;
  }

  @media (max-width: 1020px) {
    .map-legend {
      top: calc(var(--real-height) - 164px);
      left: auto;
      right: 8px;
      bottom: auto;
    }
  }
</style>
