<script>
  import filterIcon from '../../../static/icons/filter.svg'
  import { modes } from './ModeMap'

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
  class:active={overlayVisible}
  >Filter by mode <img src={filterIcon} alt="Filter" /></button
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
          ><span>{mode.icon} {mode.name}</span><input
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
    right: 1.25rem;
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
    margin-bottom: 0;
    vertical-align: top;
    border-radius: 3px;
    padding: 0.25rem 0.25rem 0.25rem 0.5rem;
    line-height: 18px;
  }
  button:hover {
    color: #fff;
  }
  button img {
    vertical-align: top;
    width: 18px;
    height: 18px;
  }
  button.active {
    background: #000;
  }
</style>
