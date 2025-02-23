<script>
  let { style, styleChange } = $props()

  function handleClick() {
    let newStyle = 'satellite'
    if (style === 'satellite') {
      style = 'map'
    }
    styleChange(newStyle)
  }

  const label = $derived(style === 'map' ? 'Satellite Map' : 'Street Map')
</script>

<button class={style} onclick={handleClick} title={label} aria-label={label}>
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
