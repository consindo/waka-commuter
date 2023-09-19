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

<button
  class={style}
  on:click={handleClick}
  title={style === 'map' ? 'Satellite Map' : 'Street Map'}
>
</button>

<style>
  button {
    margin: 0;
    background-color: #fff;
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: 22px;
    border: 0;
    color: #fff;
    font-family: 'Fira Sans', sans-serif;
    font-size: 1rem;
    border-radius: 5px;
    font-weight: 700;
    position: absolute;
    bottom: 105px;
    left: 10px;
    padding-left: 15px;
    padding-right: 14px;
    padding-top: 14px;
    padding-bottom: 15px;
    cursor: pointer;
  }
  button:hover {
    background-color: #ddd;
  }
  button:active {
    background-color: #ccc;
  }
  button.map {
    background-image: url(/static/icons/satellite.svg);
  }
  button.satellite {
    background-image: url(/static/icons/map.svg);
  }
</style>
