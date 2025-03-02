class Events {
  bind(event, fct) {
    this._events = this._events || {}
    this._events[event] = this._events[event] || []
    this._events[event].push(fct)
  }
  unbind(event, fct) {
    this._events = this._events || {}
    if (event in this._events === false) return
    this._events[event].splice(this._events[event].indexOf(fct), 1)
  }
  trigger(event /* , args... */) {
    this._events = this._events || {}
    if (event in this._events === false) return
    for (var i = 0; i < this._events[event].length; i++) {
      this._events[event][i].apply(
        this,
        Array.prototype.slice.call(arguments, 1)
      )
    }
  }
}

class Dispatcher extends Events {
  currentRegion = []

  tooltipId = null

  dataDirection = 'all'

  dataSegment = 'all'

  concordance = {}

  loadBlocks = (animate) => {
    if (this.currentRegion.length === 0) {
      this.trigger('clear-blocks')
    } else {
      this.trigger(
        'load-blocks',
        this.currentRegion,
        this.dataDirection,
        this.dataSegment,
        animate
      )
    }
  }

  addRegion = (regionName, animate) => {
    // assumes regionName is a string
    const currentIndex = this.currentRegion.indexOf(regionName)
    if (currentIndex > -1) {
      this.currentRegion.splice(currentIndex, 1)
    } else {
      this.currentRegion.push(regionName)
    }
    this.loadBlocks(animate)
  }

  // lots of ason specific code in here
  setRegions = (regionName, animate) => {
    if (
      this.dataSegment.startsWith('2021-dzn') ||
      this.dataSegment.startsWith('2016-dzn')
    ) {
      const isDZN = (regionName[0] || '').startsWith('DZN')
      if (isDZN && this.dataDirection === 'departures') {
        this.dataDirection = 'arrivals'
      } else if (!isDZN && this.dataDirection === 'arrivals') {
        this.dataDirection = 'departures'
      }
    }

    this.currentRegion = regionName
    this.loadBlocks(animate)
  }

  setDirection = (direction) => {
    if (direction === 'all' && this.dataSegment.startsWith('2021-dzn')) {
      if ((this.currentRegion[0] || '').startsWith('DZN')) {
        this.currentRegion = []
      }
      this.dataSegment = '2021-sa2'
    } else if (direction === 'all' && this.dataSegment.startsWith('2016-dzn')) {
      if ((this.currentRegion[0] || '').startsWith('DZN')) {
        this.currentRegion = []
      }
      this.dataSegment = '2016-sa2'
    }

    this.dataDirection = direction
    this.loadBlocks()
  }

  setSegment = (segment) => {
    if (
      (segment.startsWith('2021-dzn') || segment.startsWith('2016-dzn')) &&
      this.dataDirection === 'all'
    ) {
      this.dataDirection = 'arrivals' // TM-206: should cause an error message when changed
    } else if (
      segment.startsWith('2021-sa2') ||
      segment.startsWith('2016-sa2')
    ) {
      if ((this.currentRegion[0] || '').startsWith('DZN')) {
        this.currentRegion = []
      }
    }

    this.dataSegment = segment
    this.loadBlocks()
  }
}

// singleton hack...
export default new Dispatcher()
