import { LitElement, html, css } from 'lit-element'
import { humanRegionName, chooseBestName } from '../data.js'

import { getSource } from '../sources.js'

class MapTooltip extends LitElement {
  static get properties() {
    return {
      id: { type: String },
      friendlyName: { type: String },
      data: { type: Object },
      x: { type: Number },
      y: { type: Number },
      opacity: { type: Number },
      loading: { type: Boolean },
      locationContext: { type: String },
      percentage: { type: Boolean },
      showOnly: { type: String },
      populationCount: { type: Number },
    }
  }

  static get styles() {
    return css`
      div {
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.95);
        color: #fff;
        padding: 0.5rem 0.75rem;
        border-radius: 4px;
        font-size: 1rem;
        pointer-events: none;
        opacity: 0;
      }
      h4 {
        margin: 0;
        font-size: 1.2rem;
        text-transform: capitalize;
      }
      .none {
        color: #999;
      }
      .wfh {
        color: #badc58;
      }
      .departures {
        color: #f44336;
      }
      .arrivals {
        color: #90caf9;
      }
      .bad {
        color: #f0932b;
      }
      .dire {
        color: #f44336;
      }
    `
  }

  parsedData = {
    currentRegions: [],
    mode: [],
    arriveData: {},
    departData: {},
  }

  updated(properties) {
    if (properties.has('data')) {
      const { currentRegions, mode, arriveData, departData } = this.data
      const tooltipData = {
        currentRegions,
        mode,
        arriveData: {},
        departData: {},
      }
      arriveData.forEach(
        (r) => (tooltipData.arriveData[r.key] = [r.value, r.percentage])
      )
      departData.forEach(
        (r) => (tooltipData.departData[r.key] = [r.value, r.percentage])
      )

      this.parsedData = tooltipData
      this.requestUpdate()
    }
  }

  render() {
    const percentage = this.percentage === true
    const loading = this.loading === true
    let { mode } = this.parsedData
    const id = humanRegionName([this.id || ''], 'condensed')
    const friendlyName = chooseBestName(id, this.friendlyName)
    const regions = humanRegionName(this.parsedData.currentRegions, 'condensed')
    const departData = this.parsedData.departData[this.id] || []
    const arriveData = this.parsedData.arriveData[this.id] || []

    const source = getSource()
    if (source.brandingClass === 'ason') {
      mode = ['work']
    }

    const populationCount = this.populationCount

    const departCount = departData[0]
      ? Number.isInteger(departData[0])
        ? departData[0]
        : departData[0].toFixed(2)
      : 0
    const arrivalCount = arriveData[0]
      ? Number.isInteger(arriveData[0])
        ? arriveData[0]
        : arriveData[0].toFixed(2)
      : 0

    const departPercentage = Math.round((departData[1] || 0) * 10000) / 100
    const arrivalPercentage = Math.round((arriveData[1] || 0) * 10000) / 100
    const singleContext = this.locationContext !== 'single'

    const departuresBlock = html`<strong class="departures">
        ${departCount} departures
      </strong>
      ${percentage ? `(${departPercentage}%)` : ''}
      ${singleContext ? html` &larr; from ${regions}` : ''}<br />`
    const arrivalsBlock = html`
      <strong class="arrivals"> ${arrivalCount} arrivals </strong>
      ${percentage ? `(${arrivalPercentage}%)` : ''}
      ${singleContext ? html`&rarr; to ${regions}` : ''}
    `
    let subText = html`
      ${this.showOnly === 'arrivals' ? '' : departuresBlock}
      ${this.showOnly === 'departures' ? '' : arrivalsBlock}
    `

    if (regions === id) {
      subText = html`<strong class="wfh">
          ${departCount} live & ${mode.join('/')}
        </strong>
        in ${id}
        ${percentage
          ? html` <br />
              <small>
                ${this.showOnly === 'arrivals'
                  ? ''
                  : html`(${departPercentage}% of departures)<br />`}
                ${this.showOnly === 'departures'
                  ? ''
                  : html`(${arrivalPercentage}% of arrivals)`}
              </small>`
          : ''}`
    } else if (departCount === 0 && arrivalCount === 0) {
      subText = html`<strong class="none">
          No ${mode.length === 2 ? '' : mode[0]} travel
        </strong>
        to/from ${regions}`
    }

    return html`
      <div
        style="opacity: ${this.opacity}; transform: translate(${this.x +
        20}px, ${this.y}px);"
      >
        <h4>${friendlyName}</h4>
        ${loading ? html`<strong class="none">Loading...</strong><br />` : ''}
        ${populationCount != null
          ? html`<em>Population: ${populationCount}</em><br />`
          : ''}
        ${this.parsedData.currentRegions.length !== 0 && !loading
          ? subText
          : ''}
      </div>
    `
  }
}
customElements.define('map-tooltip', MapTooltip)
