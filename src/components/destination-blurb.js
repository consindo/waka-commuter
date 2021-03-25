import { LitElement, html, css } from 'lit-element'
import { humanRegionName } from '../data.js'

import { getSource } from '../sources.js'

class DestinationBlurb extends LitElement {
  static get properties() {
    return {
      currentRegions: { type: Array },
      mode: { type: String },
      segment: { type: String },
      destinationData: { type: Object },
      modeData: { type: Object },
    }
  }

  static get styles() {
    return css`
      p {
        margin: 0;
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
      .less-emphasis {
        color: #bbb;
      }
    `
  }

  humanMode(message, mode) {
    const msg = message.toLowerCase()
    if (this.mode === 'arrivals') {
      if (msg.includes('passenger')) {
        return 'be a ' + msg
      }
    } else {
      if (msg.includes('passenger')) {
        return 'are ' + msg.replace('passenger', 'passengers')
      }
    }
    if (msg.includes('bus') || msg.includes('ferry')) {
      return 'take a ' + msg
    }
    return msg
  }

  getVars() {
    const place = humanRegionName(this.currentRegions, 'full')
    const placeReduced = humanRegionName(this.currentRegions, 'condensed')

    let regionCount = 0
    let travellersCount = 0
    let travellersPercentage = 0
    let residentsCount = 0
    let residentsPercentage = 0
    let topRegion = ''
    let topRegionCount = 0
    let topRegionPercentage = 0
    this.destinationData.forEach((row) => {
      if (this.currentRegions.includes(row.key)) {
        residentsCount += row.value
        residentsPercentage += row.percentage
      } else {
        // don't include the region if it's less than 1
        if (row.value >= 1) {
          regionCount += 1
        }
        travellersCount += row.value
        travellersPercentage += row.percentage

        if (row.value > topRegionCount) {
          topRegion = row.key
          topRegionCount = row.value
          topRegionPercentage = row.percentage
        }
      }
    })
    travellersPercentage = Math.round(travellersPercentage * 100)
    residentsPercentage = Math.round(residentsPercentage * 100)
    topRegionPercentage = Math.round(topRegionPercentage * 100)

    let destination = ' for work or school'
    if (this.segment === 'workplace') {
      destination = ' for work'
    } else if (this.segment === 'education') {
      destination = ' for school'
    }

    const source = getSource()
    if (source.brandingClass === 'wsp') {
      destination = ''
    }

    let popularMode = null
    let popularPercentage = -1 // will prevent it from showing
    if (this.modeData != null) {
      const searchObj = this.modeData.Total
      popularMode = Object.keys(searchObj)
        .filter((key) => key !== 'Total')
        .reduce((a, b) => (searchObj[a] > searchObj[b] ? a : b))

      popularPercentage =
        searchObj.Total === 0
          ? -1
          : Math.round((searchObj[popularMode] / searchObj.Total) * 100)
    }

    return {
      travellersCount,
      travellersPercentage,
      residentsCount,
      residentsPercentage,
      regionCount,
      topRegion,
      topRegionCount,
      topRegionPercentage,
      place,
      placeReduced,
      destination,
      popularMode,
      popularPercentage,
    }
  }

  getArrivalMessage() {
    const vars = this.getVars()
    return html`<strong class="arrivals"
        >${vars.travellersCount.toLocaleString()}
        ${vars.travellersCount === 1 ? 'person' : 'people'}</strong
      >
      travel to
      <span class="less-emphasis">${vars.place}</span>${vars.destination}
      (${vars.travellersPercentage}%), while
      <strong class="wfh"
        >${vars.residentsCount.toLocaleString()}
        ${vars.residentsCount === 1 ? 'person' : 'people'}
        (${vars.residentsPercentage}%)</strong
      >
      ${vars.travellersCount > 0 ? 'also' : ''} live in ${vars.placeReduced}.
      ${vars.regionCount === 0
        ? ''
        : html`People arrive from
            <strong class="arrivals"
              >${vars.regionCount} different
              ${vars.regionCount === 1 ? 'area' : 'areas'}</strong
            >, the largest share being
            <strong>
              ${humanRegionName([vars.topRegion], 'full')}
              (${vars.topRegionCount.toLocaleString()}
              people—${vars.topRegionPercentage}% of arrivals)</strong
            >.`}
      ${vars.popularPercentage === -1
        ? ''
        : html`The most common way to arrive to ${vars.destination} is to
            <strong>
              ${this.humanMode(vars.popularMode)}
              (${vars.popularPercentage}%)</strong
            >.`}`
  }

  getDepartureMessage() {
    const vars = this.getVars()
    return html`<strong class="departures"
        >${vars.travellersCount.toLocaleString()}
        ${vars.travellersCount === 1 ? 'person' : 'people'}
        (${vars.travellersPercentage}%)</strong
      >
      leave <span class="less-emphasis">${vars.place}</span> to
      <strong class="departures"
        >${vars.regionCount} different
        ${vars.regionCount === 1 ? 'area' : 'areas'}</strong
      >${vars.destination}.
      ${vars.regionCount === 0
        ? ''
        : html`<strong>${vars.topRegion}</strong>, with
            <strong>
              ${vars.topRegionCount.toLocaleString()}
              ${vars.topRegionCount === 1 ? 'departure' : 'departures'}
              (${vars.topRegionPercentage}%)
            </strong>
            is the top destination outside of ${vars.placeReduced}.`}
      ${vars.popularPercentage === -1
        ? ''
        : html`To depart to ${vars.destination}, people in ${vars.placeReduced}
            most often
            <strong>
              ${this.humanMode(vars.popularMode)}
              (${vars.popularPercentage}%)</strong
            >.`}`
  }

  render() {
    return html`<p>
      ${this.mode === 'arrivals'
        ? this.getArrivalMessage()
        : this.getDepartureMessage()}
    </p>`
  }
}
customElements.define('destination-blurb', DestinationBlurb)
