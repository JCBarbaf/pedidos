class HomeButton extends HTMLElement {
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
          .home-icon {
            width: 3rem;
            height: 3rem;
            cursor: pointer;
            * {
              fill: var(--white, rgb(203, 219, 235))
            }
            &:hover {
              transform: scale(1.1)
            }
          }
        </style>
        <div class="home-button">
          <svg class="home-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M41.2 87V60.8824H58.8V87H80.8V52.1765H94L50 13L6 52.1765H19.2V87H41.2Z" fill="black"/>
          </svg>
        </div>
      `
    let firstTime = true
    const burgerButton = this.shadow.querySelector('.burger-button')
    burgerButton?.addEventListener('click', () => {
      if (firstTime) {
        firstTime = false
        burgerButton.parentNode.classList.add('opened')
      } else {
        burgerButton.parentNode.classList.toggle('opened')
        burgerButton.parentNode.classList.toggle('closed')
      }
    })
  }
}
customElements.define('home-button-component', HomeButton)
