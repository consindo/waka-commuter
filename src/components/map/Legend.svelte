<script>
  import HeatmapToggle from './HeatmapToggle.svelte'
</script>

<div class="map-legend hidden all">
  <HeatmapToggle />
  <div class="map-legend-colors"></div>
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
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(2px);
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
    position: absolute;
    bottom: 10px;
    left: 49px;
    color: var(--surface-text);
    user-select: none;
    overflow: hidden;
  }
  @media (prefers-color-scheme: dark) {
    .map-legend {
      background: rgba(1, 1, 1, 0.6);
    }
  }

  /* Warning: map-styles.js is source of truth for this */
  .map-legend-colors {
    height: 20px;
    border-radius: 2px;
    background-image: linear-gradient(
      90deg,
      #1d4ed8,
      #3b82f6,
      #e879f9,
      #ef4444,
      #b91c1c
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
      left: auto;
      right: 8px;
      top: auto;
      bottom: 36px;
    }
  }
</style>
