import { LitElement, html, css } from 'lit-element'

class GraphTooltip extends LitElement {
  static get properties() {
    return {
      content: { type: Array },
      x: { type: Number },
      y: { type: Number },
      opacity: { type: Number },
    }
  }

  static get styles() {
    return css`
      div {
        position: absolute;
        top: 0;
        right: 100vw;
        margin-left: -100vw;
        background: rgba(0, 0, 0, 0.95);
        color: #fff;
        padding: 0.25rem 0.75rem;
        border-radius: 4px;
        font-size: 1rem;
        pointer-events: none;
        opacity: 0;
        z-index: 10;
      }

      p {
        margin: 0.25rem 0;
        text-align: right;
      }
    `
  }

  render() {
    return html`
      <div
        style="opacity: ${this.opacity}; transform: translate(${this.x -
        10}px, ${this.y}px);"
      >
        ${(this.content || []).map(
          (i) => html`<p><strong>${i[0]}:</strong> ${i[1]}</p>`
        )}
      </div>
    `
  }
}
customElements.define('graph-tooltip', GraphTooltip)
