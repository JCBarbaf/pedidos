class Filter extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.render()
    document.addEventListener('showFilterModal', event => {
      this.openModal()
    })
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
          <style>
            .modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                visibility: hidden;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: rgba(0, 0, 0, 0.2);
                z-index: 400;
            }
            .modal.active {
                visibility: visible;
            }
            .modal-content {
                min-width: 60%;
                overflow: hidden;
                background-color: var(--secondary-color,rgb(94, 55, 81));
                border-radius: 20px;
                transform: scale(0);
                transition: transform 0.1s ease-out;
            }
            .modal.active .modal-content {
                transform: scale(1);
            }
            .modal-content h3 {
                margin: 0;
                padding: 1%;
                background-color: var(--primary-color,rgb(0, 56, 168));
                text-align: center;
            }
            .modal-content form {
                padding: 2%;
            }
            .modal-content .buttons {
                display: flex;
                justify-content: space-evenly;
                padding: 2% 0;
            }
            button {
                padding: 1% 5%;
                background-color: var(--tertiary-color,rgb(150, 156, 172));
                color: inherit;
                border: none;
                border-radius: 10px;
            }
            button:hover {
                transform: scale(1.1);
                filter: brightness(1.1);
            }
            .close {
                background-color: var(--red,rgb(153, 31, 24));
            }
            .form-row {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
            }
            .form-field {
                flex: 1;
                margin: 1% 0;
                padding: 1%;
            }
            input,textarea {
                width: 95%;
                height: 2rem;
                margin-top: 2%;
                padding: 1% 2%;
                background-color: var(--white,white);
                color: var(--black);
                border: none;
                border-bottom: var(--border,3px solid rgba(0, 0, 0, 0.2));
                border-width: 5px;
                border-radius: 5px 5px 0 0;
                resize: none;
            }
            .invalid {
                border-color: var(--red,rgb(153, 31, 24));
            }
            .valid {
                border-color: var(--green,rgb(34, 156, 34));
            }
            textarea {
                min-height: 5rem;
            }
            input[type="number"]::-webkit-outer-spin-button,
            input[type="number"]::-webkit-inner-spin-button {
                appearance: none;
            }
            input:focus, textarea:focus {
                outline: none;
            }
          </style>
          <div class="filter modal">
            <div class="modal-content">
                <h3>Filtro</h3>
                <form>
                    <div class="form-field">
                        <label for="filter-name">Nombre:</label>
                        <input type="text" name="filter-name" id="filter-name">
                    </div>
                    <div class="form-field">
                        <label for="filter-email">Email:</label>
                        <input type="email" name="filter-email" id="filter-email">
                    </div>
                </form>
                <div class="buttons">
                    <button>Aceptar</button>
                    <button class="close">Cancelar</button>
                </div>
            </div>
        </div>
        `
  }

  openModal () {
    const filterModal = this.shadow.querySelector('.filter.modal')
    filterModal.classList.add('active')
    filterModal.querySelector('.close').addEventListener('click', () => {
      filterModal.classList.remove('active')
    })
  };
}
customElements.define('filter-component', Filter)
