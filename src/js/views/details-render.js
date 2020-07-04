// web components
import '../components/population-bubbles.js'
import '../components/travel-mode.js'

export const setDetails = (initialLocation, arriveData, departData) => {
  // creates web components
  const arriveLocation = document.createElement('population-bubbles')
  const arriveMode = document.createElement('travel-mode')
  const departLocation = document.createElement('population-bubbles')
  const departMode = document.createElement('travel-mode')

  // puts the data in the elements
  arriveLocation.setAttribute('scale', JSON.stringify(initialLocation))
  arriveLocation.setAttribute('data', JSON.stringify(arriveData))
  departLocation.setAttribute('scale', JSON.stringify(initialLocation))
  departLocation.setAttribute('data', JSON.stringify(departData))

  // writes everything to the dom
  const arriveContainer = document.querySelector('.arrive-from')
  const arriveLocContainer = arriveContainer.querySelector('.location')
  const arriveModeContainer = arriveContainer.querySelector('.mode')
  arriveLocContainer.innerHTML = ''
  arriveLocContainer.appendChild(arriveLocation)
  arriveModeContainer.innerHTML = ''
  arriveModeContainer.appendChild(arriveMode)

  const departContainer = document.querySelector('.depart-to')
  const departLocContainer = departContainer.querySelector('.location')
  const departModeContainer = departContainer.querySelector('.mode')
  departLocContainer.innerHTML = ''
  departLocContainer.appendChild(departLocation)
  departModeContainer.innerHTML = ''
  departModeContainer.appendChild(departMode)
}
