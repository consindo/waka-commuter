import { LitElement } from 'lit-element'

class TravelMode extends LitElement {
  render() {
    const el = document.createElement('div')
    el.innerText = 'Hello World'
    return el
  }
}
customElements.define('travel-mode', TravelMode)
