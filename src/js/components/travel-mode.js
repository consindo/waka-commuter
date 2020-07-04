import { LitElement, html } from 'lit-element'

class TravelMode extends LitElement {
  static get properties() {
    return {
      data: { type: Object },
    }
  }

  categorizeData(level) {
    // our super high level categories
    let categories = {
      'Private Transport': ['car'],
      'Public Transport': ['public bus', 'school bus', 'train', 'ferry'],
      'Active Modes': ['walk', 'bicycle'],
      Other: [],
    }
    if (level === 2) {
      categories = {
        Drive: ['drive'],
        Passenger: ['passenger'],
        Bus: ['public bus', 'school bus'],
        Train: ['train'],
        Ferry: ['ferry'],
        Walk: ['walk'],
        Cycle: ['bicycle'],
        Other: [],
      }
    }

    // map the categories the other way around
    // this just makes writing the above definitions easier
    const categoryMap = {}
    Object.keys(categories).forEach((c) => {
      categories[c].forEach((i) => {
        categoryMap[i] = c
      })
      // sets it to empty, so we can use them as buckets
      categories[c] = {}
    })

    // pops everything into the right category
    const buckets = {}
    Object.keys(this.data).forEach((category) => {
      buckets[category] = Object.assign({}, categories)
      Object.keys(this.data[category]).forEach((row) => {
        let finalCategory = 'Other'
        Object.keys(categoryMap).forEach((c) => {
          if (row.toLowerCase().includes(c)) {
            finalCategory = categoryMap[c]
          }
        })
        if (buckets[category][finalCategory][row] === undefined) {
          buckets[category][finalCategory][row] = 0
        }
        buckets[category][finalCategory][row] += this.data[category][row]
      })
    })

    return buckets
  }

  render() {
    // hardcode to level 2 for now
    const buckets = this.categorizeData(2)
    const bucket = buckets.Total
    return html`${Object.keys(bucket).map((category) => {
      return html`<strong>${category}</strong>
        <ul>
          ${Object.keys(bucket[category]).map((i) => {
            return html`<li>${i}: ${bucket[category][i]}</li>`
          })}
        </ul>`
    })}`
  }
}
customElements.define('travel-mode', TravelMode)
