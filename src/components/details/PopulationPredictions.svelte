<script>
  import { onMount } from 'svelte'

  export let population, rowFilter

  let focusText = null,
    focusTextPos = 0

  let rows = [
    {
      id: 'Emp_Wkf_POPD_15+yrs_',
      color: '#3498db',
      name: 'Employed Residents',
      title:
        'Employed persons in the workforce by place of usual residence (aged 15+ years old in occupied private dwellings)',
    },
    {
      id: 'Not_in_Wkf_POPD_15+yrs_',
      color: '#d35400',
      name: 'Residents not in Wkf',
      title:
        'Persons not in the workforce by place of usual residence (aged 15+ years old in occupied private dwellings)',
    },
    {
      id: 'UnEmp_Wkf_POPD_15+yrs_',
      color: '#c0392b',
      name: 'Unemployed Residents',
      title:
        'Unemployed persons in the workforce by place of usual residence (aged 15+ years old in occupied private dwellings)',
    },
    {
      id: 'EMP_',
      name: 'Employed in Area',
      color: '#2ecc71',
      title: 'Employment at place of work',
    },
    {
      id: 'ERP_',
      name: 'Resident Population',
      color: '#7f8c8d',
      title: 'Estimated Resident Population',
    },
    {
      id: 'POPD_',
      name: 'In private dwellings',
      title: 'Population in occupied private dwellings',
      color: '#8e44ad',
    },
    {
      id: 'PNPD_',
      name: 'In non-private dwellings',
      title: 'Population in non-private dwellings',
      color: '#2980b9',
    },
    {
      id: 'SPD_',
      name: 'Structural Private Dwellings',
      title: 'Structural Private Dwellings',
      color: '#7f8c8d',
    },
    {
      id: 'OPD_',
      name: 'Occupied Private Dwellings',
      title: 'Occupied Private Dwellings',
      color: '#2980b9',
    },
  ].filter((i) => rowFilter.includes(i.id))

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
          value: population[r.id + c],
          category: r.name,
        }))
      ),
      // columns.map((column, key) =>
      //   rows.reduce(
      //     (acc, row) => {
      //       return {
      //         date: new Date(column),
      //         value: acc.value + population[row + column],
      //         category: 'Total',
      //       }
      //     },
      //     { value: 0 }
      //   )
      // ),
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
        d3.max(d3data, (d) => +d.value) * 1.1, // some padding on the top
      ])
      .range([height, 0])
    svg
      .append('g')
      .style('font-family', "'Fira Sans Condensed', 'Fira Sans', sans-serif")
      .call(d3.axisLeft(y))

    const bisect = d3.bisector((d) => d.date).left

    const res = sumstat.map((d) => d.key) // list of group names
    const color = d3
      .scaleOrdinal()
      .domain(res)
      .range(rows.map((i) => i.color))

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
    const focusItems = rows.map(() =>
      svg
        .append('g')
        .append('circle')
        .style('fill', '#fff')
        .attr('r', 3)
        .style('opacity', 0)
    )

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

        const selData = new Array(d3data.length / columns.length)
          .fill(0)
          .map((value, key) => {
            return d3data[i + columns.length * key]
          })

        focusItems.forEach((item, key) => {
          item
            .attr('cx', x(selData[key].date))
            .attr('cy', y(selData[key].value))
        })

        focusText = `<h4 style="margin: 0; padding: 0; font-size: 1.25em">${selData[0].date.getFullYear()}</h4>
        ${rows
          .map(
            (row, key) =>
              `<strong style="color: ${row.color}">${
                row.name
              }:</strong> ${selData[key].value.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}<br />`
          )
          .join('')}
        `
        focusTextPos = Math.min(x(selData[0].date) + 50, width - 80)
      })
      .on('mouseover', function () {
        focusItems.forEach((i) => i.style('opacity', 1))
      })
      .on('mouseout', function () {
        focusItems.forEach((i) => i.style('opacity', 0))
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
        <th title={row.id.slice(0, -1) + ': ' + row.title}>{row.name}</th>
        {#each columns as column}
          <td>{population[row.id + column].toFixed(1)}</td>
        {/each}
      </tr>
    {/each}
    <!-- <tr>
      <th>Total</th>
      {#each columns as column}
        <td
          >{rows
            .reduce((acc, row) => acc + population[row + column], 0)
            .toFixed(1)}</td
        >
      {/each}
    </tr> -->
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
  /*tr:last-child td {
    border-top: 1px solid #888;
  }*/
</style>
