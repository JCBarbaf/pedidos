class Notification extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.title = this.getAttribute('title')
  }

  connectedCallback () {
    document.addEventListener('showNotification', event => {
      this.showNotification()
    })

    this.render()
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
      <style>
        .notification {
            position: fixed;
            bottom: 0;
            right: 0;
            display: flex;
            align-items: center;
            padding: 1% 5%;
            background-color: var(--green,rgb(34, 156, 34));
            color: var(--white,white);
            transform: translateX(100%);
            transition: transform 0.3s ease-in;
        }
        .notification.active {
            transform: translateX(0);
            transition: transform 0.3s ease-in;
        }
      </style>
      <div class="notification">
        <h3>Guardado con exito.</h3>
      </div>
      `
  }

  showNotification () {
    const notification = this.shadow.querySelector('.notification')
    notification.classList.add('active')
    setTimeout(() => {
      const notification = this.shadow.querySelector('.notification')
      notification.classList.remove('active')
    }, 5000)
  }
}

customElements.define('notification-component', Notification)
