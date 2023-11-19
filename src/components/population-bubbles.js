import { LitElement, css } from 'lit-element'
import './map-tooltip.js'

// no no no really should not be doing this yikes
import Dispatcher from '../dispatcher.js'

class PopulationBubbles extends LitElement {
  static get properties() {
    return {
      data: { type: Array },
      scale: { type: Object },
      tooltipData: { type: Object },
      showOnly: { type: String },
      width: { type: Number },
      height: { type: Number },
      attribution: { type: Boolean },
    }
  }

  constructor(props) {
    super(props)
  }

  getElement() {
    const container = document.createElement('div')
    const svg = d3
      .select(container)
      .append('svg')
      .style('display', 'block')
      .style('margin', '0 auto')
      .attr('width', this.width)
      .attr('height', this.height)
    return [container, svg]
  }

  render() {
    const color = d3
      .scaleLinear()
      .domain([0, 10, 50, 250, 1000, 5000])
      .range(
        this.showOnly === 'arrivals'
          ? ['#fff', '#E3F2FD', '#2196F3', '#0D47A1', '#0D4777', '#001']
          : ['#fff', '#FFEBEE', '#F44336', '#B71C1C', '#220000', '#100']
      )
      .interpolate(d3.interpolateHcl)

    const [svgContainer, svg] = this.getElement()
    const mapTooltip = document.createElement('map-tooltip')
    mapTooltip.setAttribute('data', JSON.stringify(this.tooltipData))
    mapTooltip.setAttribute('locationContext', 'single')
    mapTooltip.setAttribute('percentage', 'true')
    mapTooltip.setAttribute('showOnly', this.showOnly)
    mapTooltip.setAttribute('opacity', 0)

    if (this.attribution === true) {
      svg
        .append('a')
        .attr(
          'href',
          'https://datafinder.stats.govt.nz/data/category/census/2018/commuter-view/'
        )
        .append('text')
        .text('Commuter View')
        .attr('y', this.height - 12)
        .attr('x', this.width - 95)
        .style('fill', '#ddd')
        .style('font-size', '12px')
    }

    const rawData = this.data
    const data = rawData
      // don't show bubble if there's less than one trip to it
      .filter((i) => i.value >= 1)
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 30)
      .map((i) => {
        // if i.x or i.y is 0, means that the zone is missing on the map
        let x = i.x ? (i.x - this.scale.lng) * 400 : 0
        let y = i.y ? (i.y - this.scale.lat) * -300 : 0
        if (x > 50) x = 50
        if (x < -50) x = -50
        if (y > 50) y = 50
        if (y < -50) y = -50

        return {
          key: i.key,
          originalKey: i.originalKey,
          value: i.value,
          percentage: i.percentage,
          x,
          y,
        }
      })

    // defines the size of the circles
    const size = d3.scaleSqrt().domain([0, 1]).range([25, 85])

    let isTouch = false
    let needFrame = true
    const node = svg
      .append('g')
      .selectAll('circle')
      .data(data)
      .enter()
      .append('g')
      .attr('transform', `translate(${this.width / 2}, ${this.height / 2})`)
      .on('click', (d) => {
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
      })
      .on('touchstart', () => {
        isTouch = true
      })
      .on('mouseover', function () {
        if (isTouch) return
        d3.select(this).style('opacity', 0.8)
        mapTooltip.setAttribute('opacity', 1)
      })
      .on('mouseleave', function () {
        isTouch = false
        d3.select(this).style('opacity', 1)
        mapTooltip.setAttribute('opacity', 0)
      })
      .on('mousemove', (d) => {
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
      })

    const circle = node
      .append('circle')
      .attr('class', 'node')
      .attr('r', (d) => size(d.percentage))
      .style('fill', (d) => color(d.value))
      .style('fill-opacity', 0.8)

    // removes the "(Auckland)" off labels
    const labelTransform = (t) =>
      t
        .replace(/ \(.*\)/, '')
        .replace(/ - /g, '-')
        .split('-')
        .join('- ')
        .split(' / ')
        .join(' ')
        .split('TZ ')
        .join('TZ')
        .split(' ')

    const lineHeight = 14
    const label = node
      .append('text')
      .attr('text-anchor', 'middle')
      .style('fill', (d) => (d3.hsl(color(d.value)).l > 0.6 ? '#111' : '#fff'))
      .style('text-shadow', (d) =>
        d3.hsl(color(d.value)).l > 0.6
          ? '0 1px 0 rgba(255,255,255,0.25)'
          : '0 1px 0 rgba(0,0,0,0.4)'
      )
      .style('font-size', '11px')
      .style('font-family', "'Fira Sans Condensed', 'Fira Sans', sans-serif")
      .style('letter-spacing', '-0.15px')
      .style('pointer-events', 'none')
      .attr('y', (d) => labelTransform(d.key).length * lineHeight * -0.5 - 3)

    label
      .selectAll('text')
      .data((d) => labelTransform(d.key))
      .enter()
      .append('tspan')
      .text((d) => d)
      .attr('x', 0)
      .attr('dx', 0)
      .attr('dy', lineHeight)

    const simulation = d3
      .forceSimulation()
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force('charge', d3.forceManyBody().strength(0.1))
      .force(
        'collide',
        d3
          .forceCollide()
          .strength(0.2)
          .radius((d) => size(d.percentage) + 3)
          .iterations(1)
      )

    simulation.nodes(data).on('tick', (d) => {
      node.attr('transform', (e) => `translate(${e.x}, ${e.y})`)
    })

    svgContainer.appendChild(mapTooltip)
    return svgContainer
  }
}

customElements.define('population-bubbles', PopulationBubbles)
