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
      locationContext: { type: String },
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
    const singleContext = this.locationContext !== 'single'

    let subText = html`
      <strong class="departures">
        ${departCount} departures
      </strong>
      ${singleContext ? html` &larr; from ${regions}` : ''}<br />
      <strong class="arrivals">
        ${arrivalCount} arrivals
      </strong>
      ${singleContext ? html`&rarr; to ${regions}` : ''}
    `
    if (regions === this.id) {
      subText = html` <strong class="wfh">
          ${departCount} live & ${mode.join('/')}
        </strong>
        in ${this.id}`
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
        <h4>${this.id}</h4>
        ${loading ? html`<strong class="none">Loading...</strong>` : ''}
        ${this.parsedData.currentRegions.length !== 0 && !loading
          ? subText
          : ''}
      </div>
    `
  }
}
customElements.define('map-tooltip', MapTooltip)
