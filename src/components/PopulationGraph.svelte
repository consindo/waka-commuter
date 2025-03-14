<script>
  import { onMount } from 'svelte'
  import Dispatcher from '../dispatcher.js'

  export let data, mode, tooltipData

  let needFrame = true

  // takes 30 hottest results
  const graphData = data
    .sort((a, b) => {
      if (a.value === b.value) return a.key.localeCompare(b.key)
      return a.value < b.value ? 1 : -1
    })
    .slice(0, 30)

  let el
  onMount(() => {
    const tooltipclick = (d) => {
      if (
        d3.event.ctrlKey ||
        d3.event.metaKey ||
        Dispatcher.currentRegion.includes(d.originalKey)
      ) {
        Dispatcher.addRegion(d.originalKey)
      } else {
        Dispatcher.setRegions([d.originalKey], true)
      }

      // element will be disposed when the next page loads
      mapTooltip.setAttribute('loading', true)
    }
    const tooltipover = () => {
      d3.select(this).style('opacity', 0.8)
      mapTooltip.setAttribute('opacity', 1)
    }
    const tooltipleave = () => {
      d3.select(this).style('opacity', 1)
      mapTooltip.setAttribute('opacity', 0)
    }
    const tooltipmove = (d) => {
      if (needFrame) {
        needFrame = false
        const x = d3.event.pageX
        const y = d3.event.pageY
        const id = d.key
        requestAnimationFrame(() => {
          needFrame = true
          mapTooltip.setAttribute('id', id)
          mapTooltip.setAttribute('x', x)
          mapTooltip.setAttribute('y', y)
        })
      }
    }

    if (graphData.length === 0) return
    const margin = { top: 16, right: 30, bottom: 40, left: 180 },
      width = 580 - margin.left - margin.right,
      height = 14 * graphData.length + margin.top + margin.bottom

    const svg = d3
      .select(el)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    const x = d3.scaleLinear().domain([0, graphData[0].value]).range([0, width])

    // Y axis
    const y = d3
      .scaleBand()
      .range([0, height])
      .domain(graphData.map((d) => d.key))
      .paddingInner(0.1)

    svg
      .append('g')
      .call(d3.axisLeft(y).tickSize(0))
      .selectAll('text')
      .style('font-family', "'Fira Sans Condensed', 'Fira Sans', sans-serif")
      .style('font-size', '0.6875rem')

    svg
      .append('g')
      .attr('class', 'grid')
      .attr('transform', 'translate(0,' + height + ')')
      .style('color', '#555')
      .call(d3.axisBottom(x).ticks(5).tickSize(-height).tickFormat(''))

    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x).ticks(5, 's'))
      .selectAll('text')
      .style('font-size', '0.6875rem')
      .style('font-family', "'Fira Sans Condensed', 'Fira Sans', sans-serif")

    const color = d3
      .scaleLinear()
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
      .interpolate(d3.interpolateHcl)

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
      .on('click', tooltipclick)
      .on('mouseover', tooltipover)
      .on('mouseleave', tooltipleave)
      .on('mousemove', tooltipmove)

    const mapTooltip = document.createElement('map-tooltip')
    mapTooltip.setAttribute('data', tooltipData)
    mapTooltip.setAttribute('locationContext', 'single')
    mapTooltip.setAttribute('percentage', 'true')
    mapTooltip.setAttribute('showOnly', mode)
    mapTooltip.setAttribute('opacity', 0)
    el.appendChild(mapTooltip)
  })
</script>

{#if data.length > 0}
  <h3>Top {mode}</h3>
{/if}
<div bind:this={el}></div>

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
