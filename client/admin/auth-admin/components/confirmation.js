class Confirmation extends HTMLElement {
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
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        .reset {
          position: absolute;
          inset: 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .reset-box {
          width: 30rem;
          min-height: 20rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: stretch;
          overflow: hidden;
          background-color: var(--secondary-color,rgb(94, 55, 81));
          border-radius: 1rem;
          box-shadow: var(--sahdow,5px 5px 0px 0px rgba(0, 0, 0, 0.2));
          header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5%;
            background-color: var(--primary-color,rgb(0, 56, 168));
            border-bottom: var(--border,3px solid rgba(0, 0, 0, 0.2));
          }
        }
        .logo {
          --size: 2rem;
          width: var(--size);
          height: var(--size);
        }
        .reset-form {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          align-items: center;
          padding: 1%;
        }
        input {
          width: 95%;
          height: 2rem;
          margin-top: 2%;
          padding: 1% 2%;
          background-color: var(--white,white);
          color: var(--black,black);
          border: none;
          border-bottom: var(--border,3px solid rgba(0, 0, 0, 0.2));
          border-width: 5px;
          border-radius: 5px 5px 0 0;
          resize: none;
        }
        input:focus {
          border-color: var(--green, green);
          outline: none;
        }
        .buttons {
          width: 100%;
          display: flex;
          flex-direction: row-reverse;
          justify-content: space-between;
          align-items: center;
          padding: 3%;
        }
        .forgot {
          color: inherit;
          font: inherit;
          text-decoration: none;
          &:hover {
            filter: brightness(0.9);
          }
        }
        .reset-button {
          padding: 3%;
          color: inherit;
          background-color: var(--primary-color,rgb(0, 56, 168));
          border: none;
          border-radius: 0.5rem;
          font: inherit;
          cursor: pointer;
          box-shadow: var(--sahdow,5px 5px 0px 0px rgba(0, 0, 0, 0.2));
          &:hover {
            filter: brightness(0.9);
          }
        }
      </style>
      <div class="reset">
        <div class="reset-box">
          <header>
            <svg class="logo" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M296.421 47.5845C270.857 47.5845 250.134 68.3079 250.134 93.8715V406.136C250.134 430.102 268.348 449.814 291.688 452.184C293.244 452.342 294.823 452.423 296.421 452.423H430.446C456.009 452.423 476.733 431.7 476.733 406.136V337.051C476.733 311.487 456.009 290.764 430.446 290.764C404.882 290.764 384.159 311.487 384.159 337.051V359.849H342.708V140.158H384.159V162.957C384.159 188.52 404.882 209.244 430.446 209.244C456.009 209.244 476.733 188.52 476.733 162.957V93.8715C476.733 93.6718 476.732 93.4723 476.729 93.2732C476.691 90.2865 476.37 87.3679 475.792 84.543C471.476 63.4508 452.814 47.5845 430.446 47.5845C430.436 47.5845 430.427 47.5845 430.417 47.5845L296.421 47.5845Z" fill="#E9ECFE"></path>
              <path d="M157.404 139.574V359.264H115.953V336.466C115.953 310.903 95.2295 290.179 69.6659 290.179C44.1023 290.179 23.3789 310.903 23.3789 336.466V405.536C23.3789 405.541 23.3789 405.546 23.3789 405.552C23.3789 431.115 44.1023 451.839 69.6659 451.839H203.691C229.255 451.839 249.978 431.115 249.978 405.552V93.287C249.978 67.7234 229.255 47 203.691 47L69.6659 47C44.1023 47 23.3789 67.7234 23.3789 93.287C23.3789 118.851 44.1023 139.574 69.6659 139.574L157.404 139.574Z" fill="#E9ECFE"></path>
            </svg>
            <h2>Confirm password</h2>
          </header>
          <form class="reset-form">
            <input type="email" name="email" placeholder="email">
            <div class="buttons">
              <button class="reset-button">Reset password</button>
            </div>
          </form>
        </div>
      </div>
      `
  }
}

customElements.define('confirmation-component', Confirmation)
