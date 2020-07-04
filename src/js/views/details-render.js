// web components
import '../components/population-bubbles.js'
import '../components/travel-mode.js'

const setBubble = (container, location, data) => {
  const bubble = document.createElement('population-bubbles')
  bubble.setAttribute('scale', JSON.stringify(location))
  bubble.setAttribute('data', JSON.stringify(data))

  const locationContainer = container.querySelector('.location')
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
  departModeData
) => {
  const arriveContainer = document.querySelector('.arrive-from')
  const departContainer = document.querySelector('.depart-to')

  setBubble(arriveContainer, location, arriveData)
  setBubble(departContainer, location, departData)
  setMode(arriveContainer, arriveModeData)
  setMode(departContainer, departModeData)
}
