class BackButton extends HTMLElement {
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
          .back-icon {
            width: 2rem;
            height: 2rem;
            cursor: pointer;
            * {
              fill: var(--white, rgb(203, 219, 235))
            }
            &:hover {
              transform: scale(1.1)
            }
          }
        </style>
        <a href="./productos" class="back-button">
          <svg class="back-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.17001 47.6227C5.60999 48.8237 5.60999 51.1763 7.17002 52.3772L57.7519 91.3152C59.7246 92.8338 62.5819 91.4275 62.5819 88.938L62.5819 70L93.0819 70C94.7388 70 96.0819 68.6568 96.0819 67L96.0819 33C96.0819 31.3431 94.7388 30 93.0819 30L62.5819 30L62.5819 11.062C62.5819 8.57247 59.7246 7.16618 57.7519 8.68477L7.17001 47.6227Z" fill="black"/>
          </svg>
        </a>
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
customElements.define('back-button-component', BackButton)
