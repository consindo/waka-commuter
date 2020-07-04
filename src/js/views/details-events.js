import Dispatcher from '../dispatcher.js'

// actions
const toggleDirection = (direction) => (e) => Dispatcher.setDirection(direction)
const toggleSegment = (segment) => (e) => Dispatcher.setSegment(segment)

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
}
