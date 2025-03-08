<script>
  let { style, styleChange } = $props()

  function handleClick() {
    let newStyle = 'satellite'
    if (style === 'satellite') {
      style = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'light'
        : 'dark'
    }
    styleChange(newStyle)
  }

  const label = $derived(style === 'satellite' ? 'Street Map' : 'Satellite Map')
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
  button.light,
  button.dark {
    background-image: url(/static/icons/satellite.svg);
  }
  button.satellite {
    background-image: url(/static/icons/map.svg);
  }
</style>
