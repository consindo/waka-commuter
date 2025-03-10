<script>
  let { style, styleChange } = $props()

  let visible = $state(false)

  function toggleVisible() {
    visible = !visible
  }

  const handleClick = (newStyle) => () => {
    visible = false
    styleChange(newStyle)
  }

  const label = $derived(style === 'satellite' ? 'Street Map' : 'Satellite Map')
</script>

<button class="style" onclick={toggleVisible} title={label} aria-label={label}>
</button>
<div class="options" class:visible>
  <button onclick={handleClick('light')}>Light</button>
  <button onclick={handleClick('dark')}>Dark</button>
  <button onclick={handleClick('satellite')}>Satellite</button>
</div>

<style>
  button.style {
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
    background-image: url(/static/icons/map.svg);
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  }
  button:hover {
    background-color: #ddd;
  }
  button:active {
    background-color: #ccc;
  }
  .options {
    position: absolute;
    bottom: 142px;
    left: 10px;
    flex-direction: column;
    background: var(--surface-bg);
    border-radius: 5px;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
    display: none;
  }
  .options.visible {
    display: flex;
  }
  .options button {
    text-align: left;
    border: 0;
    padding: 0.5rem 0.75rem;
    background: transparent;
    cursor: pointer;
  }
  .options button:hover {
    color: var(--surface-text-interactive);
  }
</style>
