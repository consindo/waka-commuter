<script>
  import { run } from 'svelte/legacy'
  import { getSource } from '../../sources.js'

  import filterIcon from '../../../static/icons/filter.svg'
  import { modes } from './ModeMap'

  const source = getSource()

  let { selection = $bindable([]) } = $props()
  let internalSelection = $state(modes.map((i) => i.id))
  run(() => {
    let newValue = []
    if (internalSelection.length !== modes.length) {
      newValue = internalSelection
    }
    if (selection.length !== 0 || newValue.length !== 0) {
      selection = newValue
    }
  })

  let overlayVisible = $state(false)
  const toggleFilter = () => (overlayVisible = !overlayVisible)
  const toggleAll = () => {
    if (internalSelection.length === modes.length) {
      internalSelection = []
    } else {
      internalSelection = modes.map((i) => i.id)
    }
  }

  // TM-206: don't want modes 15 & 16 to show by default
  if (source.brandingClass === 'ason') {
    internalSelection = [
      'mode-1',
      'mode-2',
      'mode-3',
      'mode-4',
      'mode-5',
      'mode-6',
      'mode-7',
      'mode-8',
      'mode-9',
      'mode-10',
      'mode-11',
      'mode-12',
      'mode-13',
      'mode-14',
    ]
  } else if (source.brandingClass === 'statsnz') {
    internalSelection = [
      'mode-1',
      'mode-2',
      'mode-3',
      'mode-6',
      'mode-7',
      'mode-10',
      'mode-11',
      'mode-12',
      'mode-13',
      'mode-17',
      'mode-18',
    ]
  }
</script>

<button onclick={toggleFilter} title="Filter Mode" class:active={overlayVisible}
  >Filter by mode <img src={filterIcon} alt="Filter" /></button
>
<div class="overlay" class:visible={overlayVisible}>
  <ul>
    <li>
      <label
        ><span>All Modes</span><input
          type="checkbox"
          checked={internalSelection.length === modes.length}
          onclick={toggleAll}
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
  <p>
    Please note that filtering by mode is less accurate due to confidentiality.
  </p>
</div>

<style>
  .overlay {
    position: absolute;
    background: var(--surface-bg-subtle);
    color: var(--surface-text);
    right: 1.25rem;
    margin-top: 0.25rem;
    padding: 0.5rem 0.25rem;
    border-radius: 5px;
    display: none;
    text-align: left;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
    border: var(--border);

    @media (max-width: 800px) {
      right: 0.5rem;
      left: 0.5rem;
    }
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
    background: var(--surface-bg);
    color: var(--surface-text-interactive);
  }
  button {
    margin-bottom: 0;
    vertical-align: top;
    border-radius: 3px;
    margin-top: 2px;
    padding: 0.25rem 0.25rem 0.25rem 0.5rem;
    line-height: 18px;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
  button:hover {
    color: var(--surface-text-interactive);
  }
  button img {
    vertical-align: top;
    width: 18px;
    height: 18px;
    filter: invert(100%);
  }
  :global(.dark) button img {
    filter: none;
  }
  button.active {
    color: var(--surface-text-interactive);
  }
  p {
    max-width: 300px;
    padding: 0.5rem 0.25rem;
    margin: 0;
    font-size: 0.8rem;
    color: var(--surface-text-subtle);
  }
</style>
