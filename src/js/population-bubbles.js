import { LitElement } from 'lit-element'

class PopulationBubbles extends LitElement {
  static get properties() {
    return {
      data: { type: Object },
    }
  }

  constructor(props) {
    super(props)

    this.width = 300
    this.height = 300
  }

  getElement() {
    const container = document.createElement('div')
    const svg = d3
      .select(container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
    return [container, svg]
  }

  getMap() {
    return {
      Balmoral: [-36.886, 174.747],
      'Eden Terrace': [-36.862, 174.75],
      'Takapuna Central': [-36.788, 174.77],
      'Birkdale North': [-36.797, 174.701],
      'Silverdale South (Auckland)': [-36.621, 174.669],
    }
  }

  getTooltip() {
    const container = document.createElement('div')
    const tooltip = d3
      .select(container)
      .style('opacity', 0)
      .attr('class', 'tooltip')
      .style('background-color', 'white')
      .style('border', 'solid')
      .style('border-width', '2px')
      .style('border-radius', '5px')
      .style('padding', '5px')
      .style('position', 'absolute')
      .style('top', 0)
      .style('left', 0)
    return [container, tooltip]
  }

  render() {
    console.log(this.data)
    const [svgContainer, svg] = this.getElement()
    const [tooltipContainer, tooltip] = this.getTooltip()

    const rawData = this.data
    const mapData = this.getMap()
    const data = Object.keys(rawData)
      .map((i) => {
        // will make this more robust
        if (mapData[i]) {
          return {
            key: i,
            value: rawData[i],
            x: mapData[i][1] * 10,
            y: mapData[i][0] * -10,
          }
        }
        return {
          key: i,
          value: rawData[i],
        }
      })
      .sort((a, b) => {
        return b.value - a.value
      })
      .slice(0, 20)
    console.log(data)

    // defines the size of the circles
    const size = d3.scaleLinear().domain([0, 500]).range([10, 60])

    const node = svg
      .append('g')
      .selectAll('circle')
      .data(data)
      .enter()
      .append('g')
      .attr('transform', `translate(${this.width / 2}, ${this.height / 2})`)
      .on('mouseover', () => tooltip.style('opacity', 1))
      .on('mouseleave', () => tooltip.style('opacity', 0))
      .on('mousemove', (d) =>
        tooltip
          .html(`<u>${d.key}</u><br>${d.value} inhabitants`)
          .style(
            'transform',
            `translate(${d3.event.pageX + 20}px, ${d3.event.pageY}px)`
          )
      )

    const circle = node
      .append('circle')
      .attr('class', 'node')
      .attr('r', (d) => size(d.value))
      .style('fill', '#bada55')
      .style('fill-opacity', 0.8)
      .attr('stroke', 'black')
      .style('stroke-width', 1)

    const label = node
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .style('font-family', 'sans-serif')
      .style('font-size', '10px')
      .style('pointer-events', 'none')
      .text((d) => d.key)

    const simulation = d3
      .forceSimulation()
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force('charge', d3.forceManyBody().strength(0.1))
      .force(
        'collide',
        d3
          .forceCollide()
          .strength(0.2)
          .radius((d) => size(d.value) + 3)
          .iterations(1)
      )

    simulation.nodes(data).on('tick', (d) => {
      node.attr('transform', (e) => `translate(${e.x}, ${e.y})`)
    })

    svgContainer.appendChild(tooltipContainer)
    return svgContainer
  }
}

customElements.define('population-bubbles', PopulationBubbles)
