<script>
  import { onMount } from 'svelte'

  export let data

  // takes 30 hottest results
  const graphData = data
    .sort((a, b) => {
      if (a.value === b.value) return a.key.localeCompare(b.key)
      return a.value < b.value ? 1 : -1
    })
    .slice(0, 30)

  let el
  onMount(() => {
    if (graphData.length === 0) return
    const margin = { top: 20, right: 30, bottom: 40, left: 180 },
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
      .domain(
        graphData.map(function (d) {
          return d.key
        })
      )
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

    //Bars
    svg
      .selectAll('myRect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', x(0))
      .attr('y', (d) => y(d.key))
      .attr('width', (d) => x(d.value))
      .attr('height', y.bandwidth())
      .attr('fill', '#bada55')
  })
</script>

<div bind:this={el}></div>
Hello
