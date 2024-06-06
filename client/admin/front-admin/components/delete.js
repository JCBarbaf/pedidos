class Delete extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = null
  }

  connectedCallback () {
    this.render()
    document.addEventListener('showDeleteModal', event => {
      this.endpoint = event.detail.endpoint
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
                min-width: 20%;
                overflow: hidden;
                background-color: var(--secondary-color,rgb(94, 55, 81));
                border-radius: 10px;
                transform: scale(0);
                transition: transform 0.1s ease-out;
            }
            .modal.active .modal-content {
                transform: scale(1);
            }
            .modal-content h3 {
                margin: 0;
                padding: 3% 1%;
                background-color: var(--primary-color,rgb(0, 56, 168));
                text-align: center;
            }
            .modal-content form {
                padding: 2%;
            }
            .buttons {
                display: flex;
                justify-content: space-evenly;
                padding: 5% 0;
            }
            button {
                width: 30%;
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
        </style>
        <div class="delete modal">
            <div class="modal-content">
                <h3>¿Seguro que quieres borrar?</h3>
                <div class="buttons">
                    <button class="confirm">Si</button>
                    <button class="close">No</button>
                </div>
            </div>
        </div>
      `
  }

  openModal () {
    const deleteModal = this.shadow.querySelector('.delete.modal')
    deleteModal.classList.add('active')
    deleteModal.addEventListener('click', async (event) => {
      if (event.target.closest('.close')) {
        deleteModal.classList.remove('active')
      }
      if (event.target.closest('.confirm')) {
        const response = await fetch(this.endpoint, {
          method: 'DELETE'
        })
        const data = await response.json()
        document.dispatchEvent(new CustomEvent('reload'))
        deleteModal.classList.remove('active')
      }
    })
  }
}

customElements.define('delete-component', Delete)
