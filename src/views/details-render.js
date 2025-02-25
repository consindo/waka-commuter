// web components
import '../components/population-bubbles.js'

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

export const setDetails = (
  location,
  arriveData,
  departData,
  arriveModeData,
  departModeData,
  tooltipData
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

  // do the html updates
  setBubble(arriveContainer, location, arriveData, tooltipData, 'arrivals')
  setBubble(departContainer, location, departData, tooltipData, 'departures')
}

export const hideDetails = () => {
  document.querySelector('.details-splash').classList.remove('hidden')
  document.querySelector('.details-location').classList.add('hidden')
}
