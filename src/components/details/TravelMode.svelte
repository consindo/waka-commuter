<script>
  import GraphTooltip from './GraphTooltip.svelte'

  const data = $props()
  const width = 300
  const height = 300

  // has both the NZ & AU strings in here
  const getColor = (category) => {
    const colorMap = {
      'Drive a private car, truck or van': '#EF6C00',
      'Car, as driver': '#EF6C00',
      'Drive a company car, truck or van': '#FF9800',
      Truck: '#FF9800',
      'Motorbike/scooter': '#D35400',
      'Passenger in a car, truck, van, or company bus': '#9C27B0',
      'Car, as passenger': '#9C27B0',
      'Taxi/ride-share service': '#8E44AD',
      'Public bus': '#FFC107',
      Bus: '#FFC107',
      'School bus': '#FFEB3B',
      'Walk or jog': '#4CAF50',
      'Walked only': '#4CAF50',
      Bicycle: '#CDDC39',
      Train: '#3F51B5',
      'Tram/light rail': '#2980b9',
      Ferry: '#2196F3',
      'Work at home': '#607D8B',
      'Worked at home': '#607D8B',
      'Not applicable': '#BDC3C7',
      'Did not go to work': '#95a5a6',
      Other: '#9E9E9E',
      'Other Mode': '#9E9E9E',
    }
    return colorMap[category] || '#888'
  }

  const categorizeData = (data, level) => {
    // our super high level categories
    let categories = {
      Drive: ['car', 'truck', 'taxi'],
      Transit: ['bus', 'public bus', 'school bus', 'train', 'ferry', 'tram'],
      Active: ['walk', 'bicycle'],
      Other: [],
    }
    if (level === 2) {
      categories = {
        Drive: ['drive', 'truck', 'motorbike'],
        Bus: ['bus', 'public bus', 'school bus'],
        Passenger: ['passenger', 'taxi'],
        Train: ['train', 'tram'],
        Ferry: ['ferry'],
        Walk: ['walk'],
        Cycle: ['bicycle'],
        WFH: ['home'],
        'Didn’t work': ['not go to work'],
        Other: [],
      }
    }

    // map the categories the other way around
    // this just makes writing the above definitions easier
    const categoryMap = {}
    Object.keys(categories).forEach((c) => {
      categories[c].forEach((i) => {
        categoryMap[i] = c
      })
      // sets it to empty, so we can use them as buckets
      categories[c] = {}
    })

    // pops everything into the right category
    const buckets = {}
    Object.keys(data).forEach((category) => {
      buckets[category] = Object.assign({}, categories)
      Object.keys(data[category]).forEach((row) => {
        let finalCategory = 'Other'
        Object.keys(categoryMap).forEach((c) => {
          if (row.toLowerCase().includes(c)) {
            finalCategory = categoryMap[c]
          }
        })
        if (buckets[category][finalCategory][row] === undefined) {
          buckets[category][finalCategory][row] = 0
        }
        // don't care about the totals
        if (row === 'Total') return
        buckets[category][finalCategory][row] += data[category][row]
      })
    })

    return buckets
  }

  const convertToRows = (data, keys) => {
    let total = 0
    const rows = Object.keys(data).map((category) => {
      const overall = {
        total: 0,
      }
      keys.forEach((i) => {
        overall[i] = data[category][i] || 0
        overall.total += overall[i]
        total += overall[i]
      })
      overall.category = category
      return overall
    })
    rows.sort((a, b) => a.total - b.total)
    return [rows, total]
  }

  const categorizationLevel = 2
  const bucket = $derived(categorizeData(data, categorizationLevel).data)

  const keys = $derived(
    Object.keys(bucket)
      .map((i) => {
        const order = Object.keys(bucket[i])
        order.sort((a, b) => bucket[i][b] - bucket[i][a])
        return order
      })
      .flat()
  )
  const [rows, total] = $derived(convertToRows(bucket, keys))

  const paddedWidth = width - 85
  const paddedHeight = height - 25

  const x = $derived(
    d3
      .scaleLinear()
      .range([0, paddedWidth])
      .domain([0, d3.max(rows, (d) => d.total)])
      .nice()
  )
  const y = $derived(
    d3
      .scaleBand()
      .range([paddedHeight, 0])
      .paddingInner(0.05)
      .align(0.1)
      .domain(rows.map((d) => d.category))
  )

  // generate grid
  let grid = $state(null)
  $effect(() =>
    d3
      .select(grid)
      .call(d3.axisBottom(x).ticks(5).tickSize(-paddedHeight).tickFormat(''))
      .select('.domain')
      .style('display', 'none')
  )

  // generate axis
  let yaxis = $state(null)
  $effect(() =>
    d3
      .select(yaxis)
      .call(d3.axisLeft(y).tickSize(0))
      .style('font-family', 'inherit')
      .style('font-size', '0.6875rem')
      .selectAll('text')
      .style('transform', 'translate(-2px, 0)')
  )

  let xaxis = $state(null)
  $effect(() =>
    d3
      .select(xaxis)
      .call(d3.axisBottom(x).ticks(5, 's'))
      .style('font-family', 'inherit')
      .style('font-size', '0.6875rem')
      .selectAll('text')
      .style('transform', 'translate(0, 4px)')
  )

  const stack = $derived(d3.stack().keys(keys)(rows))

  let tooltipOpacity = $state(0)
  let tooltipPosition = $state([0, 0])
  let tooltipContent = $state([])
</script>

<svg {width} {height} viewBox="0 0 {width} {height}">
  <g transform="translate(60, 0)">
    <g bind:this={yaxis} class="axis" />
    <g bind:this={grid} transform="translate(0, {paddedHeight})" class="grid" />
    <g
      bind:this={xaxis}
      transform="translate(0, {paddedHeight})"
      class="axis"
    />
    <g
      onpointerenter={() => (tooltipOpacity = 1)}
      onpointerleave={() => (tooltipOpacity = 0)}
      onpointermove={(e) => {
        tooltipPosition = [e.clientX, e.clientY]
        const keyName = e.target.dataset.name
        const keyValue = e.target.dataset.value

        tooltipContent = [
          [
            keyName,
            `${keyValue.toLocaleString()} (${Math.round((keyValue / total) * 100)}%)`,
          ],
        ]
      }}
    >
      {#each stack as bar}
        <g fill={getColor(bar.key)}>
          {#each bar as segment}
            {@const dataValue = segment.data[bar.key]}
            {#if dataValue > 0}
              <rect
                data-name={bar.key}
                data-value={dataValue}
                x={x(segment[0])}
                y={y(segment.data.category)}
                height={y.bandwidth() - 3}
                width={x(segment[1]) - x(segment[0])}
              />
            {/if}
          {/each}
        </g>
      {/each}
    </g>
  </g>
</svg>

<GraphTooltip
  opacity={tooltipOpacity}
  content={tooltipContent}
  x={tooltipPosition[0]}
  y={tooltipPosition[1]}
/>

<style>
  svg {
    font-family: 'Fira Sans Condensed', 'Fira Sans', sans-serif;
  }
  .axis {
    color: #eee;
    user-select: none;
  }
  .grid {
    color: #555;
  }
</style>
