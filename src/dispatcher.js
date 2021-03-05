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

  loadBlocks = () => {
    if (this.currentRegion.length === 0) {
      this.trigger('clear-blocks')
    } else {
      this.trigger(
        'load-blocks',
        this.currentRegion,
        this.dataDirection,
        this.dataSegment
      )
    }
  }

  addRegion = (regionName) => {
    // assumes regionName is a string
    const currentIndex = this.currentRegion.indexOf(regionName)
    if (currentIndex > -1) {
      this.currentRegion.splice(currentIndex, 1)
    } else {
      this.currentRegion.push(regionName)
    }
    this.loadBlocks()
  }

  setRegions = (regionName) => {
    this.currentRegion = regionName
    this.loadBlocks()
  }

  setDirection = (direction) => {
    this.dataDirection = direction
    this.loadBlocks()
  }

  setSegment = (segment) => {
    this.dataSegment = segment
    this.loadBlocks()
  }
}

// singleton hack...
export default new Dispatcher()
