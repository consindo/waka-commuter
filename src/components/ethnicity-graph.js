import { LitElement, html, css } from 'lit-element'
import './graph-tooltip.js'

class Ethnicity extends LitElement {
  static get properties() {
    return {
      data: { type: Object },
    }
  }

  static get styles() {
    return css`
      .axis {
        color: #eee;
      }
      .axis-y text {
        transform: translate(-2px, 0);
        user-select: none;
      }
      .axis-x text {
        transform: translate(0, 4px);
        user-select: none;
      }
      .grid {
        color: #555;
      }
      .grid .domain {
        display: none;
      }
    `
  }

  width = 300
  height = 300

  getColor(category) {
    const colorMap = {
      European: '#3F51B5',
      Maori: '#FF9800',
      'Middle Eastern/Latin American/African': '#9C27B0',
      Asian: '#FFC107',
      'Pacific Peoples': '#4CAF50',
      Other: '#9E9E9E',
    }
    return colorMap[category] || '#888'
  }

  categorizeData(level) {
    // our super high level categories
    let categories = {
      European: ['european'],
      Māori: ['maori'],
      MELAA: ['middle eastern/latin american/african'],
      Asian: ['asian'],
      Pacifika: ['pacific peoples'],
      Other: ['other ethnicity'],
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
        buckets[category][finalCategory][row] += this.data[category][row]
      })
    })
    return buckets
  }

  convertToRows(data, keys) {
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

  getElement() {
    const container = document.createElement('div')
    const svg = d3
      .select(container)
      .append('svg')
      .style('display', 'block')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewbox', `0 0 ${this.width} ${this.height}`)
      .append('g')
      .attr('transform', 'translate(60, 0)')
    return [container, svg]
  }

  render() {
    const categorizationLevel = 1
    const buckets = this.categorizeData(categorizationLevel)
    const bucket = buckets.Total

    const [svgContainer, svg] = this.getElement()
    const graphTooltip = document.createElement('graph-tooltip')

    const keys = Object.keys(bucket)
      .map((i) => {
        const order = Object.keys(bucket[i])
        order.sort((a, b) => bucket[i][b] - bucket[i][a])
        return order
      })
      .flat()
    const [rows, total] = this.convertToRows(bucket, keys)

    const width = this.width - 85
    const height = this.height - 25

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

    const g = svg.append('g')

    g.append('g')
      .attr('class', 'axis axis-y')
      .call(d3.axisLeft(y).tickSize(0))
      .selectAll('text')
      .style('font-size', '0.6875rem')
      .style('font-family', "'Fira Sans Condensed', 'Fira Sans', sans-serif")

    g.append('g')
      .attr('class', 'grid')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x).ticks(5).tickSize(-height).tickFormat(''))

    let isTouch = false
    let needFrame = true
    g.append('g')
      .selectAll('g')
      .data(d3.stack().keys(keys)(rows))
      .enter()
      .append('g')
      .attr('fill', (d) => this.getColor(d.key))
      .selectAll('rect')
      .data((d) => d)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d[0]))
      .attr('y', (d) => y(d.data.category))
      .attr('height', y.bandwidth() - 3)
      .attr('width', (d) => x(d[1]) - x(d[0]))
      .on('touchstart', () => {
        isTouch = true
      })
      .on('mouseover', () => {
        if (isTouch) return
        graphTooltip.setAttribute('opacity', 1)
      })
      .on('mouseleave', () => {
        isTouch = false
        graphTooltip.setAttribute('opacity', 0)
      })
      .on('mousemove', function (d) {
        if (needFrame) {
          needFrame = false
          const x = d3.event.pageX
          const y = d3.event.pageY

          const keyName = d3.select(this.parentNode).datum().key
          const keyValue = d.data[keyName]
          const content = [keyName, `${Math.round((keyValue / total) * 100)}%`]

          requestAnimationFrame(() => {
            needFrame = true
            graphTooltip.setAttribute('content', JSON.stringify([content]))
            graphTooltip.setAttribute('x', x)
            graphTooltip.setAttribute('y', y)
          })
        }
      })

    g.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x).ticks(5, 's'))
      .style('font-size', '0.6875rem')
      .style('font-family', "'Fira Sans Condensed', 'Fira Sans', sans-serif")

    svgContainer.appendChild(graphTooltip)
    return svgContainer
  }
}
customElements.define('ethnicity-graph', Ethnicity)
