<script>
  import { humanRegionName, chooseBestName } from '../../data'
  import { getSource } from '../../sources'

  const {
    id,
    friendlyName,
    data,
    position,
    opacity,
    loading,
    locationContext,
    percentage,
    showOnly,
    populationCount,
  } = $props()

  const parsedData = $derived({
    currentRegions: data.currentRegions,
    mode: data.mode,
    arriveData: data.arriveData.reduce((acc, cur) => {
      acc[cur.key] = [cur.value, cur.percentage]
      return acc
    }, {}),
    departData: data.departData.reduce((acc, cur) => {
      acc[cur.key] = [cur.value, cur.percentage]
      return acc
    }, {}),
  })
  const departData = $derived(parsedData.departData[id] || [])
  const arriveData = $derived(parsedData.arriveData[id] || [])

  const source = getSource()
  const mode = $derived(
    source.brandingClass === 'ason' ? ['work'] : parsedData.mode
  )

  const humanId = $derived(humanRegionName([id || ''], 'condensed'))
  const name = $derived(chooseBestName(humanId, friendlyName))
  const regions = $derived(
    humanRegionName(parsedData.currentRegions, 'condensed')
  )

  const departCount = $derived(
    departData[0]
      ? Number.isInteger(departData[0])
        ? departData[0]
        : departData[0].toFixed(2)
      : 0
  )
  const arrivalCount = $derived(
    arriveData[0]
      ? Number.isInteger(arriveData[0])
        ? arriveData[0]
        : arriveData[0].toFixed(2)
      : 0
  )

  const departPercentage = $derived(
    Math.round((departData[1] || 0) * 10000) / 100
  )
  const arrivalPercentage = $derived(
    Math.round((arriveData[1] || 0) * 10000) / 100
  )
  const singleContext = $derived(locationContext !== 'single')
</script>

<div
  style={`opacity: ${opacity}; transform: translate(${position[0] + 20}px, ${position[1]}px);`}
>
  <h4>{name}</h4>
  {#if loading}
    <strong class="none">Loading...</strong><br />
  {/if}
  {#if populationCount != null}
    <em>Population: {populationCount}</em><br />
  {/if}
  <!-- last condition is ason specific  -->
  {#if parsedData.currentRegions.length !== 0 && !loading && !(friendlyName || '').startsWith('TZ')}
    {#if regions === humanId}
      <strong class="wfh">
        {departCount} live & {mode.join('/')}
      </strong>
      in {humanId}
      {#if percentage}
        <br />
        <small>
          {#if showOnly !== 'arrivals'}
            ({departPercentage}% of departures)<br />
          {/if}
          {#if showOnly !== 'departures'}
            ({arrivalPercentage}% of arrivals)
          {/if}
        </small>
      {/if}
    {:else if departCount === 0 && arrivalCount === 0}
      <strong class="none">
        No {mode.length === 2 ? '' : mode[0]} travel
      </strong>
      to/from {regions}
    {:else}
      {#if showOnly !== 'departures'}
        <strong class="arrivals">
          {arrivalCount} arrivals
        </strong>
        {#if percentage}
          ({arrivalPercentage}%)
        {/if}
        {#if singleContext}
          &rarr; to {regions}
        {/if}
        <br />
      {/if}
      {#if showOnly !== 'arrivals'}
        <strong class="departures">
          {departCount} departures
        </strong>
        {#if percentage}
          ({departPercentage}%)
        {/if}
        {#if singleContext}
          &larr; from {regions}
        {/if}
        <br />
      {/if}
    {/if}
  {/if}
</div>

<style>
  div {
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.95);
    color: #fff;
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
    font-size: 1rem;
    pointer-events: none;
    opacity: 0;
    z-index: 10;
    text-align: left;
  }
  h4 {
    margin: 0;
    font-size: 1.2rem;
    text-transform: capitalize;
  }
  .none {
    color: #999;
  }
  .wfh {
    color: var(--surface-text-success);
  }
  .departures {
    color: var(--surface-text-danger);
  }
  .arrivals {
    color: #7dd3fc;
  }
</style>
