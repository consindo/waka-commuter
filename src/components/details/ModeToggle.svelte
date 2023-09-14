<script>
  import filterIcon from '../../../static/icons/filter.svg'

  const modes = [
    { id: 'mode-1', name: '🚆 Train ' },
    { id: 'mode-2', name: '🚍 Bus ' },
    { id: 'mode-3', name: '⛴️ Ferry' },
    { id: 'mode-4', name: '🚈 Tram/light rail' },
    { id: 'mode-5', name: '🚖 Taxi/ride-share service' },
    { id: 'mode-6', name: '🚘 Car, as driver' },
    { id: 'mode-7', name: '🚘 Car, as passenger' },
    { id: 'mode-8', name: '🚛 Truck' },
    { id: 'mode-9', name: '🏍️ Motorbike/scooter' },
    { id: 'mode-10', name: '🚲 Bicycle' },
    { id: 'mode-11', name: '✈️ Other mode' },
    { id: 'mode-12', name: '🚶 Walked only' },
    { id: 'mode-13', name: '🏠 Worked at home' },
    { id: 'mode-14', name: '🛌 Did not go to work' },
    { id: 'mode-15', name: '❓ Not stated' },
  ]
  export let selection = []
  let internalSelection = modes.map((i) => i.id)
  $: {
    let newValue = []
    if (internalSelection.length !== modes.length) {
      newValue = internalSelection
    }
    if (selection.length !== 0 || newValue.length !== 0) {
      selection = newValue
    }
  }

  let overlayVisible = false
  const toggleFilter = () => (overlayVisible = !overlayVisible)
  const toggleAll = () => {
    if (internalSelection.length === modes.length) {
      internalSelection = []
    } else {
      internalSelection = modes.map((i) => i.id)
    }
  }
</script>

<button
  on:click={toggleFilter}
  title="Filter Mode"
  class:active={overlayVisible}><img src={filterIcon} alt="Filter" /></button
>
<div class="overlay" class:visible={overlayVisible}>
  <ul>
    <li>
      <label
        ><span>All Modes</span><input
          type="checkbox"
          checked={internalSelection.length === modes.length}
          on:click={toggleAll}
        /></label
      >
    </li>
    {#each modes as mode}
      <li>
        <label
          ><span>{mode.name}</span><input
            type="checkbox"
            bind:group={internalSelection}
            value={mode.id}
          /></label
        >
      </li>
    {/each}
  </ul>
</div>

<style>
  .overlay {
    position: absolute;
    background: #222;
    color: #fff;
    right: 1.5rem;
    padding: 0.5rem 0.25rem;
    border-radius: 5px;
    display: none;
    text-align: left;
    box-shadow: 0 1px 3px 3px rgba(0, 0, 0, 0.3);
    border: var(--border);
  }
  .visible {
    display: block;
  }
  ul {
    padding: 0;
    margin: 0;
    list-style-type: none;
  }
  label {
    display: flex;
    padding: 0.125rem 0.25rem;
    font-size: 14px;
    border-radius: 3px;
  }
  label span {
    flex: 1;
    padding-right: 1rem;
  }
  label:hover {
    background: #111;
  }
  button {
    margin-top: -6px;
    margin-bottom: 0;
    vertical-align: top;
    background: transparent;
  }
  button.active {
    background: #000;
  }
</style>
