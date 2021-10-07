// web components
import '../components/population-bubbles.js'
import '../components/travel-mode.js'
import '../components/destination-blurb.js'
import '../components/ethnicity-graph.js'

import { getSource } from '../sources.js'
const source = getSource()

const setBubble = (container, location, data, tooltipData, showOnly) => {
  const bubble = document.createElement('population-bubbles')
  bubble.setAttribute('scale', JSON.stringify(location))
  bubble.setAttribute('data', JSON.stringify(data))
  bubble.setAttribute('tooltipData', tooltipData)
  bubble.setAttribute('showOnly', showOnly)

  if (source.brandingClass === 'statsnz') {
    bubble.setAttribute('attribution', true)
  }

  const locationContainer = container.querySelector('.location')
  bubble.setAttribute('width', '580')
  bubble.setAttribute('height', '400')

  locationContainer.innerHTML = ''
  locationContainer.appendChild(bubble)
}

const setMode = (container, data) => {
  // effectively disables the graphs
  if (data === null) {
    Array.from(document.querySelectorAll('.mode-container')).forEach(
      (el) => (el.style.display = 'none')
    )
    return
  }
  const mode = document.createElement('travel-mode')
  mode.setAttribute('data', JSON.stringify(data))

  const arriveModeContainer = container.querySelector('.mode')
  arriveModeContainer.innerHTML = ''
  arriveModeContainer.appendChild(mode)
}

const setBlurb = (
  selector,
  currentRegions,
  mode,
  segment,
  destinationData,
  modeData
) => {
  const blurb = document.createElement('destination-blurb')
  blurb.setAttribute('currentRegions', JSON.stringify(currentRegions))
  blurb.setAttribute('mode', mode)
  blurb.setAttribute('segment', segment)
  blurb.setAttribute('destinationData', JSON.stringify(destinationData))
  blurb.setAttribute('modeData', JSON.stringify(modeData))

  const container = document.querySelector(selector)
  container.innerHTML = ''
  container.appendChild(blurb)
}

export const setDetails = (
  location,
  arriveData,
  departData,
  arriveModeData,
  departModeData,
  tooltipData,
  segment,
  vaccineData,
  ethnicityData
) => {
  document.querySelector('.details-splash').classList.add('hidden')
  document.querySelector('.details-location').classList.remove('hidden')
  const arriveContainer = document.querySelector('.arrive-from.graph-container')
  const departContainer = document.querySelector('.depart-to.graph-container')

  if (departModeData != null) {
    document.querySelector(
      '.population-count'
    ).innerText = departModeData.Total.Total.toLocaleString()
  }

  const populationLabel = document.querySelector('.population-label')
  if (source.isCovidBlurbEnabled === true) {
    populationLabel.innerText = 'Population:'
    document.querySelector(
      '.population-count'
    ).innerText = vaccineData.total.populationCount.toLocaleString()
  } else if (segment === 'all') {
    populationLabel.innerText = 'Resident Workers & Students:'
  } else if (segment === 'workplace') {
    populationLabel.innerText = 'Resident Workers:'
  } else if (segment === 'education') {
    populationLabel.innerText = 'Resident Students:'
  }

  // hack
  const currentRegions = JSON.parse(tooltipData).currentRegions

  // do the html updates
  setBlurb(
    '.arrive-from.blurb-container',
    currentRegions,
    'arrivals',
    segment,
    arriveData,
    arriveModeData
  )
  setBlurb(
    '.depart-to.blurb-container',
    currentRegions,
    'departures',
    segment,
    departData,
    departModeData
  )
  setBubble(arriveContainer, location, arriveData, tooltipData, 'arrivals')
  setBubble(departContainer, location, departData, tooltipData, 'departures')
  setMode(arriveContainer, arriveModeData)
  setMode(departContainer, departModeData)

  if (source.isCovidBlurbEnabled === true) {
    const covidContainer = document.querySelector('.dynamic-covid')
    covidContainer.innerHTML = `
    <div style="flex: 1">
    <h4>Total</h4>
      <p>1<sup>st</sup> Doses: ${vaccineData.total.dose1Count}</p>
      <p>2<sup>nd</sup> Doses: ${vaccineData.total.dose2Count}</p>
      <p>Unvaccinated: ${
        vaccineData.total.populationCount - vaccineData.total.dose1Count
      }</p>
    </div>
    `
    if (vaccineData.maori) {
      covidContainer.innerHTML += `
    <div style="flex: 1">
    <h4>Maori</h4>
      <p>1<sup>st</sup> Doses: ${vaccineData.maori.dose1Count}</p>
      <p>2<sup>nd</sup> Doses: ${vaccineData.maori.dose2Count}</p>
      <p>Unvaccinated: ${
        vaccineData.maori.populationCount - vaccineData.maori.dose1Count
      }</p>
    </div>
    `
    }
    if (vaccineData.pacific) {
      covidContainer.innerHTML += `
    <div style="flex: 1">
    <h4>Pacific</h4>
      <p>1<sup>st</sup> Doses: ${vaccineData.pacific.dose1Count}</p>
      <p>2<sup>nd</sup> Doses: ${vaccineData.pacific.dose2Count}</p>
      <p>Unvaccinated: ${
        vaccineData.pacific.populationCount - vaccineData.pacific.dose1Count
      }</p>
    </div>
    `
    }

    const ethnicity = document.createElement('ethnicity-graph')
    ethnicity.setAttribute('data', JSON.stringify({ Total: ethnicityData }))

    const ethnicityContainer = document.querySelector('.covid-details .mode')
    ethnicityContainer.innerHTML = ''
    ethnicityContainer.appendChild(ethnicity)
  }
}

export const hideDetails = () => {
  document.querySelector('.details-splash').classList.remove('hidden')
  document.querySelector('.details-location').classList.add('hidden')
}

export const setDetailsControls = (
  detailsControls,
  detailsSecondaryControls
) => {
  const mapFn = (s) =>
    `<a href="#" class="btn-segment" data-segment=${s}>${s}</a>`

  const container = document.querySelector('.nav-header nav.primary-controls')
  container.innerHTML = detailsControls.map(mapFn).join(' &middot; ')
  container.querySelector('.btn-segment').classList.add('selected')

  if (detailsSecondaryControls != null) {
    const secondaryContainer = document.querySelector(
      '.nav-header nav.secondary-controls'
    )
    secondaryContainer.innerHTML = detailsSecondaryControls
      .map(mapFn)
      .join(' &middot; ')
    secondaryContainer.querySelector('.btn-segment').classList.add('selected')
  }
}
