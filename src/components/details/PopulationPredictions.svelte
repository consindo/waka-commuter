<script>
  import { onMount } from 'svelte'

  export let population

  let focusText = null,
    focusTextPos = 0

  let rows = [
    'Emp_Wkf_POPD_15+yrs_',
    'UnEmp_Wkf_POPD_15+yrs_',
    'Not_in_Wkf_POPD_15+yrs_',
  ]
  let rowMapping = {
    'Emp_Wkf_POPD_15+yrs_': 'Employed',
    'UnEmp_Wkf_POPD_15+yrs_': 'Unemployed',
    'Not_in_Wkf_POPD_15+yrs_': 'Not in Wkf',
  }
  let columns = [
    '2016',
    '2017',
    '2018',
    '2019',
    '2020',
    '2021',
    '2022',
    '2023',
    '2024',
    '2025',
    '2026',
    '2031',
    '2036',
    '2041',
    '2046',
    '2051',
    '2056',
    '2061',
    '2066',
  ]

  let el
  onMount(() => {
    const margin = { top: 16, right: 30, bottom: 40, left: 60 },
      width = 580 - margin.left - margin.right,
      height = 200 + margin.top + margin.bottom

    const svg = d3
      .select(el)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    const d3data = [
      ...rows.map((r) =>
        columns.map((c) => ({
          date: new Date(c),
          value: population[r + c],
          category: rowMapping[r],
        }))
      ),
      columns.map((column, key) =>
        rows.reduce(
          (acc, row) => {
            return {
              date: new Date(column),
              value: acc.value + population[row + column],
              category: 'Total',
            }
          },
          { value: 0 }
        )
      ),
    ].flat()

    const sumstat = d3
      .nest() // nest function allows to group the calculation per level of a factor
      .key((d) => d.category)
      .entries(d3data)

    const x = d3
      .scaleTime()
      .domain(d3.extent(d3data, (d) => d.date))
      .range([0, width])

    svg
      .append('g')
      .attr('class', 'grid')
      .attr('transform', 'translate(0,' + height + ')')
      .style('color', '#555')
      .call(d3.axisBottom(x).tickSize(-height).tickFormat(''))

    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .style('font-family', "'Fira Sans Condensed', 'Fira Sans', sans-serif")
      .call(d3.axisBottom(x))

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(d3data, function (d) {
          return +d.value
        }),
      ])
      .range([height, 0])
    svg
      .append('g')
      .style('font-family', "'Fira Sans Condensed', 'Fira Sans', sans-serif")
      .call(d3.axisLeft(y))

    const bisect = d3.bisector(function (d) {
      return d.date
    }).left

    const res = sumstat.map((d) => d.key) // list of group names
    const color = d3
      .scaleOrdinal()
      .domain(res)
      .range(['#3498db', '#c0392b', '#d35400', '#7f8c8d'])

    // Add the line
    svg
      .selectAll('.line')
      .data(sumstat)
      .enter()
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', (d) => color(d.key))
      .attr('stroke-width', 1.5)
      .attr('d', (d) => {
        return d3
          .line()
          .x((d) => x(d.date))
          .y((d) => y(d.value))(d.values)
      })

    // Create several circles that travels along the curve of chart
    const focus = svg
      .append('g')
      .append('circle')
      .style('fill', '#fff')
      .attr('r', 3)
      .style('opacity', 0)
    const focus2 = svg
      .append('g')
      .append('circle')
      .style('fill', '#fff')
      .attr('r', 3)
      .style('opacity', 0)
    const focus3 = svg
      .append('g')
      .append('circle')
      .style('fill', '#fff')
      .attr('r', 3)
      .style('opacity', 0)
    const focus4 = svg
      .append('g')
      .append('circle')
      .style('fill', '#fff')
      .attr('r', 3)
      .style('opacity', 0)

    svg
      .append('rect')
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .attr('width', width)
      .attr('height', height)
      .on('mousemove', function () {
        // recover coordinate we need
        const x0 = x.invert(d3.mouse(this)[0])
        const i = bisect(d3data.slice(columns.length * -1), x0, 1)
        const selData = d3data[i]
        const selData2 = d3data[i + columns.length]
        const selData3 = d3data[i + columns.length * 2]
        const selData4 = d3data[i + columns.length * 3]
        focus.attr('cx', x(selData.date)).attr('cy', y(selData.value))
        focus2.attr('cx', x(selData2.date)).attr('cy', y(selData2.value))
        focus3.attr('cx', x(selData3.date)).attr('cy', y(selData3.value))
        focus4.attr('cx', x(selData4.date)).attr('cy', y(selData4.value))
        focusText = `<h4 style="margin: 0; padding: 0; font-size: 1.25em">${selData.date.getFullYear()}</h4>
          <strong style="color: #3498db">Employed:</strong> ${selData.value.toLocaleString(
            undefined,
            {
              maximumFractionDigits: 2,
            }
          )}<br />
          <strong style="color: #c0392b">Unemployed:</strong> ${selData2.value.toLocaleString(
            undefined,
            {
              maximumFractionDigits: 2,
            }
          )}<br />
          <strong style="color: #d35400">Not in Wkf:</strong> ${selData3.value.toLocaleString(
            undefined,
            {
              maximumFractionDigits: 2,
            }
          )}<br />
          <strong>Total:</strong> ${selData4.value.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}
        `
        focusTextPos = Math.min(x(selData.date) + 50, width - 80)
      })
      .on('mouseover', function () {
        focus.style('opacity', 1)
        focus2.style('opacity', 1)
        focus3.style('opacity', 1)
        focus4.style('opacity', 1)
      })
      .on('mouseout', function () {
        focus.style('opacity', 0)
        focus2.style('opacity', 0)
        focus3.style('opacity', 0)
        focus4.style('opacity', 0)
        focusText = null
      })
  })
</script>

<div class="svg-wrapper">
  {#if focusText}
    <div class="focus-text" style={`left: ${focusTextPos}px`}>
      {@html focusText}
    </div>
  {/if}
  <div bind:this={el}></div>
</div>
<div class="container">
  <table>
    <tr>
      <th></th>
      {#each columns as column}
        <th>{column}</th>
      {/each}
    </tr>
    {#each rows as row}
      <tr>
        <th title={row}>{rowMapping[row]}</th>
        {#each columns as column}
          <td>{population[row + column].toFixed(1)}</td>
        {/each}
      </tr>
    {/each}
    <tr>
      <th>Total</th>
      {#each columns as column}
        <td
          >{rows
            .reduce((acc, row) => acc + population[row + column], 0)
            .toFixed(1)}</td
        >
      {/each}
    </tr>
  </table>
</div>

<style>
  .container {
    width: 100%;
    overflow-x: scroll;
    box-sizing: border-box;
    padding: 0.5em 0 1em;
    margin-bottom: 1em;
  }
  .svg-wrapper {
    position: relative;
  }
  .focus-text {
    position: absolute;
    top: 1rem;
    left: 0;
    background: rgba(0, 0, 0, 0.75);
    padding: 0.5rem;
    font-size: 13px;
    line-height: 1.5;
    border-radius: 3px;
    pointer-events: none;
  }
  table {
    font-size: 14px;
    border-collapse: collapse;
  }
  tr th:first-child {
    position: sticky;
    left: 0;
    padding-left: 18px;
    padding-right: 8px;
    background: #111;
  }
  th,
  td {
    text-align: right;
    padding: 3px 6px;
  }
  th:nth-child(even),
  td:nth-child(even) {
    background: #333;
  }
  tr:last-child td {
    border-top: 1px solid #888;
  }
</style>
