// web components
import '../components/population-bubbles.js'
import '../components/travel-mode.js'

const setBubble = (container, location, data, tooltipData, showOnly) => {
  const bubble = document.createElement('population-bubbles')
  bubble.setAttribute('scale', JSON.stringify(location))
  bubble.setAttribute('data', JSON.stringify(data))
  bubble.setAttribute('tooltipData', tooltipData)
  bubble.setAttribute('showOnly', showOnly)

  const locationContainer = container.querySelector('.location')
  bubble.setAttribute('width', '580')
  bubble.setAttribute('height', '400')

  locationContainer.innerHTML = ''
  locationContainer.appendChild(bubble)
}

const setMode = (container, data) => {
  const mode = document.createElement('travel-mode')
  mode.setAttribute('data', JSON.stringify(data))

  const arriveModeContainer = container.querySelector('.mode')
  arriveModeContainer.innerHTML = ''
  arriveModeContainer.appendChild(mode)
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
  const arriveContainer = document.querySelector('.arrive-from')
  const departContainer = document.querySelector('.depart-to')
  document.querySelector('.population-count').innerText =
    departModeData.Total.Total

  const populationLabel = document.querySelector('.population-label')
  if (segment === 'all') {
    populationLabel.innerText = 'Resident Workers & Students:'
  } else if (segment === 'workplace') {
    populationLabel.innerText = 'Resident Workers:'
  } else if (segment === 'education') {
    populationLabel.innerText = 'Resident Students:'
  }

  setBubble(arriveContainer, location, arriveData, tooltipData, 'arrivals')
  setBubble(departContainer, location, departData, tooltipData, 'departures')
  setMode(arriveContainer, arriveModeData)
  setMode(departContainer, departModeData)
}
