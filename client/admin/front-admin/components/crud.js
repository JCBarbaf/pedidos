class Crud extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.render()
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
      <style>
        .crud {
          width: 95%;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1%;
          margin: 0 auto;
          padding-top: 2%;
        }
        .data-list {
          flex: 1;
        }
        .data-add {
          flex: 2;
        }
        /*Media queries*/
        @media (max-width: 1000px) {
          .data-add {
              flex: 1;
          }
        }
      </style>
      <div class="crud">
          <div class="data-list">
            <slot name="data-list"></slot>
          </div>
          <div class="data-add">
            <slot name="data-add"></slot>
          </div>
      </div>
      `
  }
}

customElements.define('crud-component', Crud)
