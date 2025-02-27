<script>
  import Dispatcher from '../../dispatcher.js'
  import MapTooltip from '../map/MapTooltip.svelte'

  const { scale, data, tooltipData, showOnly, width, height, attribution } =
    $props()

  // tooltip
  let id = $state(null)
  let tooltipLoading = $state(false)
  let tooltipPosition = $state([0, 0])
  let tooltipOpacity = $state(0)

  const size = d3.scaleSqrt().domain([0, 1]).range([25, 85])
  const color = d3
    .scaleLinear()
    .domain([0, 10, 50, 250, 1000, 5000])
    .range(
      showOnly === 'arrivals'
        ? ['#fff', '#E3F2FD', '#2196F3', '#0D47A1', '#0D4777', '#001']
        : ['#fff', '#FFEBEE', '#F44336', '#B71C1C', '#220000', '#100']
    )
    .interpolate(d3.interpolateHcl)

  const parsedData = $derived(
    data
      // don't show bubble if there's less than one trip to it
      .filter((i) => i.value >= 1)
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 30)
      .map((i) => {
        // if i.x or i.y is 0, means that the zone is missing on the map
        let x = i.x ? (i.x - scale.lng) * 400 : 0
        let y = i.y ? (i.y - scale.lat) * -300 : 0
        if (x > 50) x = 50
        if (x < -50) x = -50
        if (y > 50) y = 50
        if (y < -50) y = -50

        return {
          key: i.key,
          originalKey: i.originalKey,
          value: i.value,
          percentage: i.percentage,
          x,
          y,
        }
      })
  )

  // removes the "(Auckland)" off labels
  const labelTransform = (t) =>
    t
      .replace(/ \(.*\)/, '')
      .replace(/ - /g, '-')
      .split('-')
      .join('- ')
      .split(' / ')
      .join(' ')
      .split('TZ ')
      .join('TZ')
      .split(' ')

  const lineHeight = 14

  let positions = $state({})
  $effect(() => {
    const simulation = d3
      .forceSimulation()
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('charge', d3.forceManyBody().strength(0.1))
      .force(
        'collide',
        d3
          .forceCollide()
          .strength(0.2)
          .radius((d) => size(d.percentage) + 3)
          .iterations(1)
      )
    simulation.nodes(parsedData).on('tick', () => {
      positions = simulation.nodes().reduce((acc, cur) => {
        acc[cur.key] = [cur.x, cur.y]
        return acc
      }, {})
    })
  })

  const triggerClick = (d) => (e) => {
    if (e.ctrlKey || e.metaKey || Dispatcher.currentRegion.includes(d)) {
      Dispatcher.addRegion(d)
    } else {
      Dispatcher.setRegions([d], true)
    }
    tooltipLoading = true
  }

  // turns loading off when it gets new data
  $effect(() => {
    if (data) {
      tooltipLoading = false
    }
  })
</script>

<svg {width} {height}>
  {#if attribution}
    <a
      href="https://datafinder.stats.govt.nz/data/category/census/2018/commuter-view/"
    >
      <text y={height - 12} x={width - 95} style="fill: #ddd; font-size: 12px;">
        Commuter View
      </text>
    </a>
  {/if}
  <g
    onpointerenter={() => (tooltipOpacity = 1)}
    onpointerleave={() => (tooltipOpacity = 0)}
    onpointermove={(e) => {
      tooltipPosition = [e.clientX, e.clientY]
      id = e.target.dataset.name
      // const keyName = e.target.dataset.name
      // const keyValue = e.target.dataset.value
    }}
  >
    {#each parsedData as d}
      {@const label = labelTransform(d.key)}
      {@const x = positions[d.key] ? positions[d.key][0] : width / 2}
      {@const y = positions[d.key] ? positions[d.key][1] : height / 2}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <g
        class="node"
        transform="translate({x}, {y})"
        onclick={triggerClick(d.originalKey)}
      >
        <circle
          data-name={d.key}
          r={size(d.percentage)}
          fill={color(d.value)}
        />
        <text
          fill={d3.hsl(color(d.value)).l > 0.6 ? '#111' : '#fff'}
          style="text-shadow: 0 1px 0 {d3.hsl(color(d.value)).l > 0.6
            ? 'rgba(255, 255, 255, 0.25)'
            : 'rgba(0, 0, 0, 0.4)'};"
          y={label.length * lineHeight * -0.5 - 3}
          text-anchor="middle"
        >
          {#each label as l}
            <tspan x="0" dy={lineHeight}>{l}</tspan>
          {/each}
        </text>
      </g>
    {/each}
  </g>
</svg>
{#if id}
  <MapTooltip
    data={tooltipData}
    locationContext="single"
    percentage
    {id}
    position={tooltipPosition}
    {showOnly}
    loading={tooltipLoading}
    opacity={tooltipOpacity}
  />
{/if}

<style>
  .node:hover {
    opacity: 0.7;
  }
  circle {
    opacity: 0.9;
  }
  g text {
    font-size: 11px;
    letter-spacing: -0.15px;
    pointer-events: none;
  }
</style>
