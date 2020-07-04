import { LitElement, html } from 'lit-element'

class TravelMode extends LitElement {
  static get properties() {
    return {
      data: { type: Object },
    }
  }

  categorizeData(level) {
    // our super high level categories
    let categories = {
      '🚗': ['car'],
      '🚌': ['public bus', 'school bus', 'train', 'ferry'],
      '🏃‍♀️': ['walk', 'bicycle'],
      '🏠': [],
    }
    if (level === 2) {
      categories = {
        '🚗': ['drive'],
        '👥': ['passenger'],
        '🚌': ['public bus', 'school bus'],
        '🚄': ['train'],
        '⛴️': ['ferry'],
        '🏃‍♀️': ['walk'],
        '🚲': ['bicycle'],
        '🏠': [],
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
    Object.keys(this.data).forEach((category) => {
      buckets[category] = Object.assign({}, categories)
      Object.keys(this.data[category]).forEach((row) => {
        let finalCategory = '🏠'
        Object.keys(categoryMap).forEach((c) => {
          if (row.toLowerCase().includes(c)) {
            finalCategory = categoryMap[c]
          }
        })
        if (buckets[category][finalCategory][row] === undefined) {
          buckets[category][finalCategory][row] = 0
        }
        buckets[category][finalCategory][row] += this.data[category][row]
      })
    })

    return buckets
  }

  convertToRows(data, keys) {
    const rows = Object.keys(data).map((category) => {
      const overall = {
        total: 0,
      }
      keys.forEach((i) => {
        overall[i] = data[category][i] || 0
        overall.total += overall[i]
      })
      overall.category = category
      return overall
    })
    rows.sort((a, b) => a.total - b.total)
    return rows
  }

  getElement() {
    const container = document.createElement('div')
    const svg = d3
      .select(container)
      .append('svg')
      .attr('width', 300)
      .attr('height', 300)
      .append('g')
      .attr('transform', 'translate(50, 50)')
    return [container, svg]
  }

  render() {
    const categorizationLevel = 1
    const buckets = this.categorizeData(categorizationLevel)
    const bucket = buckets.Total
    //
    const [svgContainer, svg] = this.getElement()
    const keys = Object.keys(bucket)
      .map((i) => Object.keys(bucket[i]))
      .flat()
    const rows = this.convertToRows(bucket, keys)

    const width = 200
    const height = 200

    // set x & y scale
    const x = d3
      .scaleLinear()
      .range([0, width])
      .domain([0, d3.max(rows, (d) => d.total)])
      .nice()

    const y = d3
      .scaleBand()
      .range([height, 0])
      .paddingInner(0.05)
      .align(0.1)
      .domain(rows.map((d) => d.category))

    // set the colors
    var z = d3
      .scaleOrdinal()
      .range([
        '#98abc5',
        '#8a89a6',
        '#7b6888',
        '#6b486b',
        '#a05d56',
        '#d0743c',
        '#ff8c00',
      ])
      .domain(keys)

    var g = svg.append('g')

    g.append('g')
      .selectAll('g')
      .data(d3.stack().keys(keys)(rows))
      .enter()
      .append('g')
      .attr('fill', (d) => z(d.key))
      .selectAll('rect')
      .data((d) => d)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d[0]))
      .attr('y', (d) => y(d.data.category))
      .attr('height', y.bandwidth())
      .attr('width', (d) => x(d[1]) - x(d[0]))
      .on('mouseover', function () {
        tooltip.style('opacity', 1)
      })
      .on('mouseout', function () {
        tooltip.style('opacity', 0)
      })
      .on('mousemove', function (d) {
        const keyName = d3.select(this.parentNode).datum().key
        const keyValue = d.data[keyName]
        var xPosition = d3.mouse(this)[0] - 5
        var yPosition = d3.mouse(this)[1] - 5
        tooltip.attr(
          'transform',
          'translate(' + xPosition + ',' + yPosition + ')'
        )
        tooltip.select('text').text(`${keyName}: ${keyValue}`)
      })

    g.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x).ticks(5, 's'))

    g.append('g')
      .attr('class', 'axis')
      .call(d3.axisLeft(y).tickSize(0))
      .selectAll('text')
      .style('font-size', categorizationLevel === 1 ? '1.5rem' : '1.2rem')

    var tooltip = svg
      .append('g')
      .attr('class', 'tooltip')
      .style('opacity', '0')
      .style('pointer-events', 'none')

    tooltip
      .append('rect')
      .attr('width', 100)
      .attr('height', 20)
      .attr('fill', '#000')
      .style('opacity', 0.5)

    tooltip
      .append('text')
      .attr('x', 30)
      .attr('dy', '1.2em')
      .attr('fill', 'white')
      .style('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')

    return svgContainer
  }
}
customElements.define('travel-mode', TravelMode)
