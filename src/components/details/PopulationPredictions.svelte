<script>
  import { onMount } from 'svelte'

  export let population

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

    // Create the circle that travels along the curve of chart
    const focus = svg
      .append('g')
      .append('circle')
      .style('fill', 'none')
      .attr('stroke', '#fff')
      .attr('r', 8.5)
      .style('opacity', 0)

    // Create the text that travels along the curve of chart
    const focusText = svg
      .append('g')
      .append('text')
      .style('opacity', 0)
      .style('fill', '#fff')
      .attr('text-anchor', 'left')
      .attr('alignment-baseline', 'middle')

    svg
      .append('rect')
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .attr('width', width)
      .attr('height', height)
      .on('mousemove', function () {
        // recover coordinate we need
        const x0 = x.invert(d3.mouse(this)[0])
        const i = bisect(d3data, x0, 1)
        const selectedData = d3data[i]
        focus.attr('cx', x(selectedData.date)).attr('cy', y(selectedData.value))
        focusText
          .html(
            selectedData.date.getFullYear() +
              '  -  ' +
              selectedData.value.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })
          )
          .attr('x', x(selectedData.date) + 15)
          .attr('y', y(selectedData.value))
      })
      .on('mouseover', function () {
        focus.style('opacity', 1)
        focusText.style('opacity', 1)
      })
      .on('mouseout', function () {
        focus.style('opacity', 0)
        focusText.style('opacity', 0)
      })
  })
</script>

<div>
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
