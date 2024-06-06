class Header extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.title = this.getAttribute('title')
  }

  connectedCallback () {
    this.render()
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
      <style>
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 3%;
            background-color: var(--primary-color,rgb(0, 56, 168));
            border-bottom: var(--border,3px solid rgba(0, 0, 0, 0.2));
        }
        header .logo {
            width: 50px;
            height: 50px;
        }
      </style>
      <header>
          <svg class="logo" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M296.421 47.5845C270.857 47.5845 250.134 68.3079 250.134 93.8715V406.136C250.134 430.102 268.348 449.814 291.688 452.184C293.244 452.342 294.823 452.423 296.421 452.423H430.446C456.009 452.423 476.733 431.7 476.733 406.136V337.051C476.733 311.487 456.009 290.764 430.446 290.764C404.882 290.764 384.159 311.487 384.159 337.051V359.849H342.708V140.158H384.159V162.957C384.159 188.52 404.882 209.244 430.446 209.244C456.009 209.244 476.733 188.52 476.733 162.957V93.8715C476.733 93.6718 476.732 93.4723 476.729 93.2732C476.691 90.2865 476.37 87.3679 475.792 84.543C471.476 63.4508 452.814 47.5845 430.446 47.5845C430.436 47.5845 430.427 47.5845 430.417 47.5845L296.421 47.5845Z" fill="#E9ECFE"></path>
              <path d="M157.404 139.574V359.264H115.953V336.466C115.953 310.903 95.2295 290.179 69.6659 290.179C44.1023 290.179 23.3789 310.903 23.3789 336.466V405.536C23.3789 405.541 23.3789 405.546 23.3789 405.552C23.3789 431.115 44.1023 451.839 69.6659 451.839H203.691C229.255 451.839 249.978 431.115 249.978 405.552V93.287C249.978 67.7234 229.255 47 203.691 47L69.6659 47C44.1023 47 23.3789 67.7234 23.3789 93.287C23.3789 118.851 44.1023 139.574 69.6659 139.574L157.404 139.574Z" fill="#E9ECFE"></path>
          </svg>
          <title-component title="${this.title}"></title-component>
          <menu-component></menu-component>
      </header>
      `
  }
}

customElements.define('header-component', Header)
