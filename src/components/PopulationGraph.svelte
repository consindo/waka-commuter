<script>
  import { onMount } from 'svelte'
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

  $inspect(opacity)

  // takes 30 hottest results
  const graphData = data
    .sort((a, b) => {
      if (a.value === b.value) return a.key.localeCompare(b.key)
      return a.value < b.value ? 1 : -1
    })
    .slice(0, 30)

  let el = $state()
  onMount(() => {
    const tooltipclick = (d) => {
      console.log(d)
      if (
        // d3.event.ctrlKey ||
        // d3.event.metaKey ||
        Dispatcher.currentRegion.includes(d.originalKey)
      ) {
        Dispatcher.addRegion(d.originalKey)
      } else {
        Dispatcher.setRegions([d.originalKey], true)
      }

      // element will be disposed when the next page loads
      loading = true
    }
    const tooltipover = () => {
      select(this).style('opacity', 0.8)
      opacity = 1
    }
    const tooltipleave = () => {
      select(this).style('opacity', 1)
      opacity = 0
    }
    const tooltipmove = (d) => {
      id = d.currentTarget.dataset.key
      position = [d.clientX, d.clientY]
    }

    if (graphData.length === 0) return
    const margin = { top: 16, right: 30, bottom: 40, left: 180 },
      width = 580 - margin.left - margin.right,
      height = 14 * graphData.length + margin.top + margin.bottom

    const svg = select(el)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    const x = scaleLinear().domain([0, graphData[0].value]).range([0, width])

    // Y axis
    const y = scaleBand()
      .range([0, height])
      .domain(graphData.map((d) => d.key))
      .paddingInner(0.1)

    svg
      .append('g')
      .call(axisLeft(y).tickSize(0))
      .selectAll('text')
      .style('font-family', "'Fira Sans Condensed', 'Fira Sans', sans-serif")
      .style('font-size', '0.6875rem')

    svg
      .append('g')
      .attr('class', 'grid')
      .attr('transform', 'translate(0,' + height + ')')
      .style('color', 'var(--surface-gridlines)')
      .call(axisBottom(x).ticks(5).tickSize(-height).tickFormat(''))

    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(axisBottom(x).ticks(5, 's'))
      .selectAll('text')
      .style('font-size', '0.6875rem')
      .style('font-family', "'Fira Sans Condensed', 'Fira Sans', sans-serif")

    const color = scaleLinear()
      .domain([
        0,
        graphData[0].value / 25,
        graphData[0].value / 10,
        graphData[0].value / 2,
        graphData[0].value,
      ])
      .range(
        mode === 'arrivals'
          ? ['#fff', '#E3F2FD', '#2196F3', '#0D47A1', '#0D4888']
          : ['#fff', '#FFEBEE', '#F44336', '#B71C1C', '#660000']
      )
      .interpolate(interpolateHcl)

    //Bars
    svg
      .selectAll('myRect')
      .data(graphData)
      .enter()
      .append('rect')
      .attr('x', x(0))
      .attr('y', (d) => y(d.key))
      .attr('width', (d) => x(d.value))
      .attr('height', y.bandwidth())
      .attr('fill', (d) => color(d.value))
      .attr('data-key', (d) => d.key)
      .on('click', tooltipclick)
      .on('mouseover', tooltipover)
      .on('mouseleave', tooltipleave)
      .on('mousemove', tooltipmove)
  })
</script>

{#if data.length > 0}
  <h3>Top {mode}</h3>
{/if}
<div bind:this={el}></div>
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
</style>
