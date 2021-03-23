<div class="map-legend hidden all">
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
    pointer-events: none;
  }

  .map-legend.all .hide-all,
  .map-legend.departures .hide-departures,
  .map-legend.arrivals .hide-arrivals {
    display: none;
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

  .arrivals .map-legend-colors {
    background-image: linear-gradient(-90deg, #0d47a1, #2196f3, #bbdefb);
  }

  .departures .map-legend-colors {
    background-image: linear-gradient(90deg, #ffcdd2, #f44336, #b71c1c);
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
  .arrivals li:nth-child(2),
  li:last-child {
    text-align: right;
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
