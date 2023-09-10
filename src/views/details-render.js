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
    container.querySelector('.mode-container').style.display = 'none'
    return
  } else {
    container.querySelector('.mode-container').style.display = 'block'
  }
  const mode = document.createElement('travel-mode')
  if (source.brandingClass === 'statsnz') {
    mode.setAttribute('data', JSON.stringify(data))
  } else {
    // don't need to split between workplace and education
    mode.setAttribute('data', JSON.stringify({ Total: data.Total }))
  }

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
  segment
) => {
  document.querySelector('.details-splash').classList.add('hidden')
  document.querySelector('.details-location').classList.remove('hidden')
  const arriveContainer = document.querySelector('.arrive-from.graph-container')
  const departContainer = document.querySelector('.depart-to.graph-container')

  let pop = 'Unknown'
  if (departModeData != null && departModeData.Total.Total !== undefined) {
    pop = departModeData.Total.Total.toLocaleString()
  } else if (
    arriveModeData != null &&
    arriveModeData.Total.Total !== undefined
  ) {
    pop = arriveModeData.Total.Total.toLocaleString()
  }
  if (source.isModeGraphsEnabled) {
    document.querySelector('.population-count').innerText = pop
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
}

export const hideDetails = () => {
  document.querySelector('.details-splash').classList.remove('hidden')
  document.querySelector('.details-location').classList.add('hidden')
}
