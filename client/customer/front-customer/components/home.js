class Home extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.links = [
      {
        name: 'Nuevo pedido',
        url: '#'
      },
      {
        name: 'Hola',
        url: '#'
      },
      {
        name: 'Adios',
        url: '#'
      }
    ]
    this.render()
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        .home-menu {
          display: flex;
          flex-wrap: wrap;
          padding: 1rem;
        }
        .menu-item {
          min-width: 20rem;
          display: block;
          margin: 1rem auto;
          padding: 0.5rem;
          background-color: var(--primary-color, rgb(0, 56, 168));
          color: inherit;
          border-radius: 0.5rem;
          font: inherit;
          font-size: 1.5rem;
          font-weight: bold;
          text-decoration: none;
          text-align: center;
          box-shadow: var(--shadow, 5px 5px 0px 0px rgba(0, 0, 0, 0.2));
          &:hover {
            transform: scale(1.1);
            filter: brightness(1.1);
          }
        }
      </style>
      <div class="home-menu">
      </div>
      `
    this.links.forEach(link => {
      console.log(link)
      const linkElement = document.createElement('a')
      linkElement.innerHTML = link.name
      linkElement.href = link.url
      linkElement.classList.add('menu-item')
      this.shadow.querySelector('.home-menu').appendChild(linkElement)
    })
  }
}

customElements.define('home-component', Home)
