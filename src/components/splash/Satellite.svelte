<script>
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  let style = 'map'

  function handleClick(event) {
    if (style === 'satellite') {
      style = 'map'
    } else {
      style = 'satellite'
    }
    dispatch('styleChange', { style })
  }
</script>

<button class={style} on:click={handleClick}>
  {style === 'map' ? 'Switch to Satellite Map' : 'Switch to Street Map'}
</button>

<style>
  button {
    margin: 0.25rem var(--sidebar-padding);
    padding: 0.5rem 1.25rem;
    background-color: #333;
    background-repeat: no-repeat;
    text-indent: 24px;
    background-position: 12px 50%;
    border: 0;
    color: #fff;
    font-family: 'Fira Sans', sans-serif;
    font-size: 1rem;
    border-radius: 5px;
    font-weight: 700;
  }
  button:hover {
    background-color: #222;
  }
  button:active {
    background-color: #000;
  }
  button.map {
    background-image: url(/icons/satellite.svg);
  }
  button.satellite {
    background-image: url(/icons/map.svg);
  }
</style>
