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
const toggleSegment = (e) => {
  linkHack(e)

  // only currently works with the statsnz and wsp sources
  const primary = document.querySelector('nav.primary-controls .selected')
  const secondary = document.querySelector('nav.secondary-controls .selected')

  let newSegment = primary.dataset.segment.toLowerCase()
  if (secondary) {
    newSegment = [secondary.dataset.segment.toLowerCase(), newSegment].join('-')
  }

  Dispatcher.setSegment(newSegment)
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

  document.querySelector('.btn-close').addEventListener('click', () => {
    Dispatcher.setRegions([])
  })

  for (const node of document.querySelectorAll('.btn-segment')) {
    node.addEventListener('click', toggleSegment)
  }

  for (const node of document.querySelectorAll('.btn-expand')) {
    node.addEventListener('click', () => {
      document.getElementById('details')
      document.getElementById('app').classList.toggle('map-view')
    })
  }
}
