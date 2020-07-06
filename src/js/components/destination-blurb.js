import { LitElement, html, css } from 'lit-element'

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
    `
  }

  getVars() {
    console.log(this.destinationData)

    const place = this.currentRegions.join(' & ')

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
        regionCount += 1
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

    let destination = 'work or school'
    if (this.segment === 'workplace') {
      destination = 'work'
    } else if (this.segment === 'education') {
      destination = 'school'
    }

    const searchObj = this.modeData.Total
    const popularMode = Object.keys(searchObj)
      .filter((key) => key !== 'Total')
      .reduce((a, b) => (searchObj[a] > searchObj[b] ? a : b))
    const popularPercentage = Math.round(
      (searchObj[popularMode] / searchObj.Total) * 100
    )

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
      travel to ${vars.place} for ${vars.destination}
      (${vars.travellersPercentage}%), while
      <strong class="wfh"
        >${vars.residentsCount.toLocaleString()}
        ${vars.residentsCount === 1 ? 'person' : 'people'}
        (${vars.residentsPercentage}%)</strong
      >
      ${vars.travellersCount > 0 ? 'also' : ''} live in ${vars.place}.
      ${vars.regionCount === 0
        ? ''
        : html`People arrive from
            <strong class="arrivals"
              >${vars.regionCount} different
              ${vars.regionCount === 1 ? 'area' : 'areas'}</strong
            >, the majority being
            <strong>
              ${vars.topRegion} (${vars.topRegionCount.toLocaleString()}
              people—${vars.topRegionPercentage}% of arrivals)</strong
            >.`}
      The most popular way to arrive to ${vars.destination} is to
      <strong>
        ${vars.popularMode.toLowerCase()} (${vars.popularPercentage}%)</strong
      >.`
  }

  getDepartureMessage() {
    const vars = this.getVars()
    return html`<strong class="departures"
        >${vars.travellersCount.toLocaleString()}
        ${vars.travellersCount === 1 ? 'person' : 'people'}
        (${vars.travellersPercentage}%)</strong
      >
      leave ${vars.place} to
      <strong class="departures"
        >${vars.regionCount} different
        ${vars.regionCount === 1 ? 'area' : 'areas'}</strong
      >
      for ${vars.destination}.
      ${vars.regionCount === 0
        ? ''
        : html`<strong>${vars.topRegion}</strong>, with
            <strong>
              ${vars.topRegionCount.toLocaleString()}
              ${vars.topRegionCount === 1 ? 'departure' : 'departures'}
              (${vars.topRegionPercentage}%)
            </strong>
            is the top destination outside of ${vars.place}.`}
      To depart to ${vars.destination}, people in ${vars.place} mostly
      <strong>
        ${vars.popularMode.toLowerCase()} (${vars.popularPercentage}%)</strong
      >.`
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
