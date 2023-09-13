<script>
  const modes = [
    { id: 'mode-1', name: 'Train' },
    { id: 'mode-2', name: 'Bus' },
  ]
  export let selection = []
  let internalSelection = []
  $: {
    selection = internalSelection
  }
</script>

<div>
  <ul>
    <li>
      <label
        ><input
          type="checkbox"
          checked={selection.length === 0}
          on:click={() => (selection = [])}
        />All</label
      >
    </li>
    {#each modes as mode}
      <li>
        <label
          ><input
            type="checkbox"
            bind:group={internalSelection}
            value={mode.id}
          />{mode.name}</label
        >
      </li>
    {/each}
  </ul>
</div>

<style>
  div {
    position: absolute;
    background: #000;
    color: #fff;
  }
</style>
