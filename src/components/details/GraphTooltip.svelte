<script>
  const { content, x, y, opacity } = $props()
</script>

<div style={`opacity: ${opacity}; transform: translate(${x - 10}px, ${y}px);`}>
  {#each content as i}
    <p><strong>{i[0]}:</strong> {i[1]}</p>
  {/each}
</div>

<style>
  div {
    position: absolute;
    top: 0;
    right: 100vw;
    margin-left: -100vw;
    background: rgba(0, 0, 0, 0.95);
    color: #fff;
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-size: 1rem;
    pointer-events: none;
    opacity: 0;
    z-index: 10;
  }

  p {
    margin: 0.25rem 0;
    text-align: right;
  }
</style>
