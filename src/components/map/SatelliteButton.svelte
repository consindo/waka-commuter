<script>
  let { style, styleChange, mapLabels, setMapLabels } = $props()

  let visible = $state(false)
  let checked = $state(mapLabels)
  $effect(() => {
    setMapLabels(checked)
  })

  function toggleVisible() {
    visible = !visible
  }

  const handleClick = (newStyle) => () => {
    visible = false
    styleChange(newStyle)
  }

  const label = $derived(style === 'satellite' ? 'Street Map' : 'Satellite Map')

  const triggerShortcut = (e) => {
    if (e.target.tagName !== 'INPUT' && e.key === 'l') {
      checked = !checked
    }
  }
</script>

<svelte:window onkeydown={triggerShortcut} />

<button class="style" onclick={toggleVisible} title={label} aria-label={label}>
</button>
<div class="options" class:visible>
  <h4>Map Style</h4>
  <button onclick={handleClick('light')}>Light</button>
  <button onclick={handleClick('dark')}>Dark</button>
  <button onclick={handleClick('satellite')}>Satellite</button>
  {#if mapLabels !== undefined}
    <label>
      <input type="checkbox" bind:checked />
      Area Labels
    </label>
  {/if}
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
  h4 {
    margin: 0.75rem 0.75rem 0.25rem;
    font-size: 0.9rem;
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
  .options button:hover,
  .options label:hover {
    color: var(--surface-text-interactive);
  }
  label {
    cursor: pointer;
    padding: 0.25rem 1rem 0.75rem 0.5rem;
    font-size: 13.3333px;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
</style>
