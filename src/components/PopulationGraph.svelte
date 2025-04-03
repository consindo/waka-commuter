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
  import { getSource } from '../sources.js'

  let { data, mode, tooltipData, isComparison } = $props()

  const source = getSource()

  let id = $state(null)
  let loading = $state(false)
  let position = $state([0, 0])
  let opacity = $state(0)

  // takes 30 hottest results
  const graphData = data
    .filter((i) => i.key !== 'Total')
    .slice()
    .sort((a, b) => {
      return Math.abs(a.value) < Math.abs(b.value) ? 1 : -1
    })
    .slice(0, 30)
    .sort((a, b) => {
      if (a.value === b.value) return a.key.localeCompare(b.key)
      return a.value < b.value ? 1 : -1
    })

  const maxValue = Math.max(
    Math.abs(graphData[0]?.value || 0),
    Math.abs(graphData.slice(-1)[0]?.value || 0)
  )

  const color = scaleLinear()
    .domain([
      maxValue / -1,
      maxValue / -2,
      maxValue / -10,
      maxValue / -25,
      0,
      maxValue / 25,
      maxValue / 10,
      maxValue / 2,
      maxValue,
    ])
    .range(
      mode === 'arrivals'
        ? [
            '#006666',
            '#1cb7b7',
            '#36e7f4',
            '#ebfffc',
            '#fff',
            '#E3F2FD',
            '#2196F3',
            '#0D47A1',
            '#0D4888',
          ]
        : [
            '#facc15',
            '#fef08a',
            '#fef9c3',
            '#fefce8',
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
      .domain([
        Math.min((graphData.slice(-1)[0] || {}).value, 0),
        (graphData[0] || {}).value,
      ])
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
    const axis = select(yaxis).call(axisLeft(y).tickSize(0))
    axis
      .selectAll('text')
      .style('font-family', "'Fira Sans Condensed', 'Fira Sans', sans-serif")
      .style('font-size', '0.6875rem')

    axis
      .selectAll('text')
      .filter((d) => tooltipData.currentRegions.includes(d))
      .style('fill', `var(--surface-text-success)`)
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
  <details open={window.innerWidth > 1020 || isComparison} class:isComparison>
    <summary
      ><h3>{isComparison ? 'Greatest change in ' : 'Top'} {mode}</h3></summary
    >
    <svg
      width={width + margin.left + margin.right}
      height={height + margin.top + margin.bottom}
      viewBox="0 0 {width + margin.left + margin.right} {height +
        margin.top +
        margin.bottom}"
    >
      <g transform="translate({margin.left}, {margin.top})">
        <g bind:this={yaxis} class="axis" />
        <g bind:this={grid} transform="translate(0, {height})" class="grid" />
        <g bind:this={xaxis} transform="translate(0, {height})" class="axis" />
        <g
          onclick={(e) => {
            const key = e.target.dataset.key
            if (
              (source.canMultiSelect && e.ctrlKey) ||
              (source.canMultiSelect && e.metaKey) ||
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
    {#if source.brandingClass === 'statsnz'}
      <p class="disclaimer">
        Only journeys made by 6 or more people are shown.
      </p>
    {/if}
  </details>
{/if}

{#if tooltipData && id}
  <MapTooltip
    {isComparison}
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
  details.isComparison summary {
    pointer-events: none;
  }
  details.isComparison summary::marker {
    content: '';
  }
  details.isComparison h3 {
    margin-left: 0;
  }
  summary {
    text-align: left;
    margin-left: var(--sidebar-padding);
    cursor: pointer;
  }
  summary::marker {
    color: var(--surface-text-subtle);
    font-size: 85%;
  }
  h3 {
    text-align: left;
    font-size: 1.125rem;
    text-transform: capitalize;
    margin: 0 0 0 0.25rem;
    display: inline-block;
  }
  svg {
    max-width: 100%;
    height: auto;
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
  .disclaimer {
    text-align: left;
    font-size: 13px;
    padding: 0 var(--sidebar-padding) 1rem;
    color: var(--surface-text-subtle);
    margin-top: 0;
  }
</style>
