<script>
  import { getSource } from '../../sources.js'
  import Search from './Search.svelte'
  import Dispatcher from '../../dispatcher.js'

  export let regionNames

  const source = getSource()
  const brandingClass = source.brandingClass

  const triggerClick = (direction) => (e) => {
    e.preventDefault()
    currentDirection = direction
    Dispatcher.setDirection(direction)
  }

  let currentDirection = Dispatcher.dataDirection
  const loadBlocks = () => {
    currentDirection = Dispatcher.dataDirection
    const legend = document.querySelector('.map-legend')
    legend.classList.remove('all', 'departures', 'arrivals')
    legend.classList.add(currentDirection)
  }
  Dispatcher.bind('load-blocks', loadBlocks)
</script>

<div class={brandingClass}>
  <Search {regionNames} />
  <nav class="controls">
    <a
      class:selected={currentDirection === 'all'}
      on:click={triggerClick('all')}
      href="#"
      title="Show both arrivals & departures on map"
      class="btn-direction-all selected">All</a
    >
    &middot;
    <a
      class:selected={currentDirection === 'arrivals'}
      on:click={triggerClick('arrivals')}
      href="#"
      title="Only show places where people arrive from"
      class="btn-direction-arrivals">Arrivals</a
    >
    &middot;
    <a
      class:selected={currentDirection === 'departures'}
      on:click={triggerClick('departures')}
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
    background-image: url(/static/css/icon.png);
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

  .hide {
    display: none;
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
    background-image: url(/static/css/wsp.svg);
    background-size: auto 24px;
    text-indent: 3.875rem;
  }

  .ason {
    background-image: url(/static/css/ason.png);
    background-size: auto 24px;
    background-position: 0.75rem 18px;
    text-indent: 0;
    padding-top: 48px;
  }
</style>
