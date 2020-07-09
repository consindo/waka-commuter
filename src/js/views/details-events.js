import Dispatcher from '../dispatcher.js'

// actions
// this is gross... don't usually do this
// but this is competition code, so don't have time to make it good
const linkHack = (e, direction) => {
  e.preventDefault()
  e.currentTarget.parentElement
    .querySelector('.selected')
    .classList.remove('selected')
  e.currentTarget.classList.add('selected')

  if (direction) {
    const legend = document.querySelector('.map-legend')
    legend.classList.remove('all', 'departures', 'arrivals')
    legend.classList.add(direction)
  }
}
const toggleDirection = (direction) => (e) => {
  linkHack(e, direction)
  Dispatcher.setDirection(direction)
}
const toggleSegment = (segment) => (e) => {
  linkHack(e)
  Dispatcher.setSegment(segment)
}

// events
export const bindDetailsEvents = () => {
  document
    .querySelector('.btn-direction-all')
    .addEventListener('click', toggleDirection('all'))
  document
    .querySelector('.btn-direction-arrivals')
    .addEventListener('click', toggleDirection('arrivals'))
  document
    .querySelector('.btn-direction-departures')
    .addEventListener('click', toggleDirection('departures'))

  document
    .querySelector('.btn-segment-all')
    .addEventListener('click', toggleSegment('all'))
  document
    .querySelector('.btn-segment-workplace')
    .addEventListener('click', toggleSegment('workplace'))
  document
    .querySelector('.btn-segment-education')
    .addEventListener('click', toggleSegment('education'))

  document.querySelector('.btn-close').addEventListener('click', () => {
    Dispatcher.setRegions([])
  })

  document.querySelector('.btn-expand').addEventListener('click', () => {
    document.getElementById('app').classList.toggle('map-view')
  })
}
