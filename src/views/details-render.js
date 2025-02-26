import { getSource } from '../sources.js'
const source = getSource()

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
}

export const hideDetails = () => {
  document.querySelector('.details-splash').classList.remove('hidden')
  document.querySelector('.details-location').classList.add('hidden')
}
