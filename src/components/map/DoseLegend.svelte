<script>
  import HeatmapToggle from './HeatmapToggle.svelte'
  import { getSource } from '../../sources.js'
  const source = getSource()
  const show = source.enableNullState != null
</script>

<div class={show ? 'dose-legend' : 'dose-legend hidden'}>
  <HeatmapToggle />
  <div class="dose-legend-colors" />
  <ul>
    <li>50%</li>
    <li>70%</li>
    <li>95%</li>
  </ul>
  <p>Vaccination Rate</p>
</div>

<style>
  .dose-legend {
    width: 220px;
    background: rgba(20, 20, 20, 0.6);
    border-radius: 4px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    position: absolute;
    bottom: 10px;
    left: 49px;
    color: #fff;
    overflow: hidden;
    user-select: none;
  }

  /* Warning: map-styles.js is source of truth for this */
  .dose-legend-colors {
    height: 20px;
    border-radius: 2px;
    background-image: linear-gradient(
      90deg,
      #ffffcc,
      #c7e9b4,
      #7fcdbb,
      #41b6c4,
      #2c7fb8,
      #253494
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
    text-align: center;
  }
  li:first-child {
    text-align: left;
  }
  li:last-child {
    text-align: right;
  }

  p {
    font-weight: bold;
    margin: 0 7px 5px;
    font-size: 11px;
  }

  @media (max-width: 1020px) {
    .dose-legend {
      left: auto;
      right: 8px;
      bottom: auto;
      top: auto;
      bottom: 116px;
    }
  }
</style>
