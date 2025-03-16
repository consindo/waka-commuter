<script>
  import {
    select,
    scaleBand,
    interpolateHcl,
    axisBottom,
    axisLeft,
    scaleLinear,
  } from 'd3'

  import Dispatcher from '../dispatcher.js'
  import MapTooltip from './map/MapTooltip.svelte'

  let { data, mode, tooltipData } = $props()

  let id = $state(null)
  let loading = $state(false)
  let position = $state([0, 0])
  let opacity = $state(0)

  // takes 30 hottest results
  const graphData = data
    .slice()
    .sort((a, b) => {
      return Math.abs(a.value) < Math.abs(b.value) ? 1 : -1
    })
    .slice(0, 30)
    .sort((a, b) => {
      if (a.value === b.value) return a.key.localeCompare(b.key)
      return a.value < b.value ? 1 : -1
    })

  const color = scaleLinear()
    .domain([
      graphData[0]?.value / -1,
      graphData[0]?.value / -2,
      graphData[0]?.value / -10,
      graphData[0]?.value / -25,
      0,
      graphData[0]?.value / 25,
      graphData[0]?.value / 10,
      graphData[0]?.value / 2,
      graphData[0]?.value,
    ])
    .range(
      mode === 'arrivals'
        ? [
            '#884d0d',
            '#a1670d',
            '#f37e21',
            '#fdeee3',
            '#fff',
            '#E3F2FD',
            '#2196F3',
            '#0D47A1',
            '#0D4888',
          ]
        : [
            '#006666',
            '#1cb7b7',
            '#36e7f4',
            '#ebfffc',
            '#fff',
            '#FFEBEE',
            '#F44336',
            '#B71C1C',
            '#660000',
          ]
    )
    .interpolate(interpolateHcl)

  const margin = { top: 16, right: 30, bottom: 40, left: 180 }
  const width = 580 - margin.left - margin.right
  const height = $derived(14 * graphData.length + margin.top + margin.bottom)

  const x = $derived(
    scaleLinear()
      .domain([Math.min(graphData.slice(-1)[0].value, 0), graphData[0].value])
      .range([0, width])
      .nice()
  )

  // Y axis
  const y = $derived(
    scaleBand()
      .range([0, height])
      .domain(graphData.map((d) => d.key))
      .paddingInner(0.1)
  )

  let grid = $state(null)
  $effect(() => {
    select(grid).call(axisBottom(x).ticks(5).tickSize(-height).tickFormat(''))
  })

  let yaxis = $state(null)
  $effect(() => {
    select(yaxis)
      .call(axisLeft(y).tickSize(0))
      .selectAll('text')
      .style('font-family', "'Fira Sans Condensed', 'Fira Sans', sans-serif")
      .style('font-size', '0.6875rem')
  })

  let xaxis = $state(null)
  $effect(() => {
    select(xaxis)
      .call(axisBottom(x).ticks(5, 's'))
      .selectAll('text')
      .style('font-size', '0.6875rem')
      .style('font-family', "'Fira Sans Condensed', 'Fira Sans', sans-serif")
  })
</script>

{#if data.length > 0}
  <h3>Top {mode}</h3>
{/if}
<div>
  <svg
    width={width + margin.left + margin.right}
    height={height + margin.top + margin.bottom}
    viewBox="0 0 {width + margin.left + margin.right}"
  >
    <g transform="translate({margin.left}, {margin.top})">
      <g bind:this={yaxis} class="axis" />
      <g bind:this={grid} transform="translate(0, {height})" class="grid" />
      <g bind:this={xaxis} transform="translate(0, {height})" class="axis" />
      <g
        onclick={(e) => {
          const key = e.target.dataset.key
          if (
            e.ctrlKey ||
            e.metaKey ||
            Dispatcher.currentRegion.includes(key)
          ) {
            Dispatcher.addRegion(key)
          } else {
            Dispatcher.setRegions([key], true)
          }

          // element will be disposed when the next page loads
          loading = true
        }}
        onpointerover={() => (opacity = 1)}
        onpointerleave={() => (opacity = 0)}
        onpointermove={(e) => {
          position = [e.clientX, e.clientY]
          id = e.target.dataset.key
        }}
      >
        {#each graphData as bar}
          <rect
            x={x(Math.min(bar.value, 0))}
            y={y(bar.key)}
            width={Math.abs(x(bar.value) - x(0))}
            height={y.bandwidth()}
            fill={color(bar.value)}
            data-key={bar.key}
          />
        {/each}
      </g>
    </g>
  </svg>
</div>

{#if tooltipData && id}
  <MapTooltip
    data={tooltipData}
    locationContext="single"
    percentage
    {id}
    {position}
    showOnly={mode}
    {loading}
    {opacity}
  />
{/if}

<style>
  h3 {
    width: 178px;
    text-align: right;
    font-size: 1.125rem;
    text-transform: capitalize;
    margin-bottom: 0;
    margin-top: 0;
    margin-left: 0;
  }
  div {
    text-align: left;
  }
  .axis {
    color: var(--surface-text);
    user-select: none;
  }
  .grid {
    color: var(--surface-gridlines);
  }
  rect:hover {
    opacity: 0.8;
  }
</style>
