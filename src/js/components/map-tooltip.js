import { LitElement, html, css } from 'lit-element'

class MapTooltip extends LitElement {
  static get properties() {
    return {
      id: { type: String },
      data: { type: Object },
      x: { type: Number },
      y: { type: Number },
      opacity: { type: Number },
      loading: { type: Boolean },
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
      strong {
        font-size: 1.2rem;
      }
      .departures {
        color: #f44336;
        font-weight: bold;
      }
      .arrivals {
        color: #90caf9;
        font-weight: bold;
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
      arriveData.forEach((r) => (tooltipData.arriveData[r.key] = r.value))
      departData.forEach((r) => (tooltipData.departData[r.key] = r.value))

      this.parsedData = tooltipData
      this.requestUpdate()
    }
  }

  render() {
    const loading = this.loading === true
    const { mode } = this.parsedData
    const regions = this.parsedData.currentRegions.join(' & ')
    const departCount = this.parsedData.departData[this.id] || 0
    const arrivalCount = this.parsedData.arriveData[this.id] || 0

    let subText = html`
      <br /><span class="departures">${departCount} arrivals</span> &larr; from
      ${regions} <br /><span class="arrivals">${arrivalCount} departures</span>
      &rarr; to ${regions}
    `
    if (departCount === 0 && arrivalCount === 0) {
      subText = html`<br />No ${mode.length === 2 ? '' : mode[0]} travel to/from
        ${regions}`
    } else if (regions === this.id) {
      subText = html`<br />${departCount} live & ${mode.join('/')} in ${this.id}`
    }

    return html`
      <div
        style="opacity: ${this.opacity}; transform: translate(${this.x +
        20}px, ${this.y}px);"
      >
        <strong>${this.id}</strong>
        ${loading ? html`<br />Loading...` : ''}
        ${this.parsedData.currentRegions.length !== 0 && !loading
          ? subText
          : ''}
      </div>
    `
  }
}
customElements.define('map-tooltip', MapTooltip)
