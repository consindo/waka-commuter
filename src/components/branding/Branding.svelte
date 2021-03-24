<script>
  import { getSource } from '../../sources.js'

  const source = getSource()
  const brandingClass = source.brandingClass
</script>

<div class={brandingClass}>
  <h1>Commuter</h1>
  <nav class="controls">
    <a
      href="#"
      title="Show both arrivals & departures on map"
      class="btn-direction-all selected">All</a
    >
    &middot;
    <a
      href="#"
      title="Only show places where people arrive from"
      class="btn-direction-arrivals">Arrivals</a
    >
    &middot;
    <a
      href="#"
      title="Only show places where people depart to"
      class="btn-direction-departures">Departures</a
    >
  </nav>
</div>

<style>
  div {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    background-image: url('/css/icon.png');
    background-repeat: no-repeat;
    background-position: 0.75rem 50%;
    background-size: 2.5rem 2.5rem;
    padding: 0.75rem;
    text-indent: 3rem;
    color: #fff;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
    user-select: none;
    letter-spacing: -0.5px;
  }

  h1 {
    line-height: 2.5rem;
    padding: 0;
    margin: 0;
    font-size: 1.75rem;
    line-height: 1.1;
  }

  a {
    font-size: 0.9rem;
    color: #ddd;
    text-decoration: none;
    padding: 0 0.15rem;
  }

  a:first-child {
    padding-left: 0;
  }

  a.selected {
    color: #fff;
    font-weight: bold;
  }
  a:hover {
    text-decoration: underline;
  }

  .wsp {
    background-image: url('/css/wsp.svg');
    background-size: auto 24px;
    text-indent: 3.875rem;
  }
</style>
