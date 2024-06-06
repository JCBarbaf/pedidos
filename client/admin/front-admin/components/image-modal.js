import { store } from '../redux/store.js'
import { showImage, removeImage } from '../redux/images-slice.js'
class ImageModal extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.images = []
  }

  connectedCallback () {
    this.loadData().then(() => this.render())
    document.addEventListener('showImageModal', event => {
      this.openModal()
    })
  }

  async loadData () {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/images`)
    const data = await response.json()
    this.images = data.rows
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        *::-webkit-scrollbar {
          width: 5px;
        }
        *::-webkit-scrollbar-track {
          background: none;
        }
        *::-webkit-scrollbar-thumb {
          background: var(--tertiary-color,rgb(150, 156, 172));
          border-radius: 10px;
        }
        button:hover {
          filter: brightness(1.1);
          transform: scale(1.1)
        }
        .modal-container {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          display: none;
          justify-content: center;
          align-items: center;
          background-color: rgb(0,0,0,0.3)
        }
        .modal-container:has(.active) {
          display: flex;
        }
        .modal {
          width: 50%;
          overflow: hidden;
          background-color: var(--secondary-color, rgb(94, 55, 81));
          border-radius: 1rem;
        }
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2%;
          background-color: var(--primary-color, rgb(0, 56, 168));
          border-bottom: var(--border,3px solid rgba(0, 0, 0, 0.2));
        }
        .close {
          background: none;
          border: none;
          color: var(--white, white);
          cursor: pointer;
          font-size: 1.5rem;
          font-weight: bold;
        }
        main {
          height: 60vh;
          display: flex;
          justify-content: space-between;
        }
        .gallery {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          gap: 5%;
          margin: 1%;
          padding: 3%;
          overflow-y: auto;
        }
        .image-container, .gallery .add-image {
          --size: 8rem;
          width: var(--size);
          height: var(--size);
          display: block;
          overflow: hidden;
          border: var(--border,3px solid rgba(0, 0, 0, 0.2));
          border-radius: 0.5rem;
          cursor: pointer;
          &:hover {
            transform: scale(1.1);
          }
        }
        .gallery .add-image {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: var(--tertiary-color,rgb(150, 156, 172));
          color: rgb(0,0,0,0.2);
          font-size: 4rem;
        }
        input[type="file"] {
          display: none;
        }
        .image-container {
          position: relative;
          &.selected {
            border-color: var(--green, green);
          }
        }
        .image {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }
        .delete-image {
          position: absolute;
          top: 0;
          right: 0;
          display: none;
          padding: 3% 5%;
          background-color: var(--red, red);
          color: var(--white, white);
          border: none;
          border-radius: 0 0 0 0.5rem;
          font-size: 1rem;
          cursor: pointer;
          &:hover {
            transform: none;
            filter: brightness(0.9);
          }
        }
        .image-container:hover .delete-image {
          display: block;
        }
        form {
          padding: 3%;
          border-left: var(--border,3px solid rgba(0, 0, 0, 0.2));
        }
        input,label {
          display: block;
          margin-bottom: 5%;
        }
        input {
          padding: 3%;
          background-color: var(--white, white);
          border: none;
          border-bottom: var(--border,3px solid rgba(0, 0, 0, 0.2));
          border-radius: 0.2rem 0.2rem 0 0;
          font: inherit;
        }
        input:focus {
          outline: none;
          border-color: var(--green, green)
        }
        footer {
          display: flex;
          justify-content: flex-end;
          padding: 2%;
          border-top: var(--border,3px solid rgba(0, 0, 0, 0.2));
        }
        .submit-button {
          padding: 1% 3%;
          background-color: var(--tertiary-color,rgb(150, 156, 172));
          color: var(--black,black);
          border: var(--border,3px solid rgba(0, 0, 0, 0.2));
          border-radius: 0.5rem;
          cursor: pointer;
          font: inherit;
          &:disabled {
            pointer-events: none;
            filter: brightness(0.8)
          }
        }
        
      </style>
      <div class="modal-container">
        <div class="modal">
          <header>
            <h2 class="title">Imagen destacada</h2>
            <button class="close">X</button>
          </header>
          <main>
            <div class="gallery">
              <label class="add-image" for="image">+</label>
              <input type="file" accept="image/png, image/gif, image/jpeg, image/webp" name="file" id="image">
            </div>
            <form>
              <div class="form-element">
                <label for="title">Título:</label>
                <input type="text" name="title" id="title">
              </div>
              <div class="form-element">
                <label for="alt">Texto alternativo:</label>
                <input type="text" name="alt" id="alt">
              </div>
            </form>
          </main>
          <footer>
            <button class="submit-button" disabled>Añadir</button>
          </footer>
        </div>
      </div>
    `
    const modal = this.shadow.querySelector('.modal')
    modal.addEventListener('click', async (event) => {
      if (event.target.closest('.close')) {
        modal.classList.remove('active')
      }
      if (event.target.closest('.delete-image')) {
        const imageContainer = event.target.closest('.delete-image').parentNode
        const endpoint = imageContainer.querySelector('.image').src
        const response = await fetch(endpoint, {
          method: 'DELETE'
        })
        const data = await response.json()
        if (response.status === 200) {
          if (imageContainer.classList.contains('selected')) {
            imageContainer.classList.remove('selected')
          }
          imageContainer.remove()
        } else {
          alert(data.message)
        }
      } else if (event.target.closest('.image-container')) {
        const imageContainer = event.target.closest('.image-container')
        if (imageContainer.classList.contains('selected')) {
          imageContainer.classList.remove('selected')
        } else {
          imageContainer.parentNode.querySelector('.selected')?.classList.remove('selected')
          imageContainer.classList.add('selected')
        }
        this.toggleDisabled()
      }
      if (event.target.closest('.submit-button')) {
        let image = store.getState().images.imageGallery
        const selectedImage = this.shadow.querySelector('.image-container.selected .image')
        const title = this.shadow.querySelector('#title').value
        const alt = this.shadow.querySelector('#alt').value
        const filename = selectedImage.alt
        image = { ...image, title, alt, filename }
        store.dispatch(showImage(image))
        modal.classList.remove('active')
      }
    })
    const input = this.shadow.querySelector('#image')
    input.addEventListener('change', (event) => {
      this.uploadImage(event.target.files[0])
    })
    this.images.forEach(file => {
      this.createImage(file.filename)
    })
  }

  openModal () {
    const modal = this.shadow.querySelector('.modal')
    modal.classList.add('active')
  }

  async uploadImage (file) {
    const formData = new FormData()
    formData.append('file', file)
    const result = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/images`, {
      method: 'POST',
      body: formData
    })
    const filenames = await result.json()
    this.shadow.querySelector('.gallery .selected')?.classList.remove('selected')
    filenames.forEach(file => {
      const container = this.createImage(file)
      container.classList.add('selected')
    })
  }

  createImage (file) {
    const gallery = this.shadow.querySelector('.gallery')
    const container = document.createElement('div')
    const image = document.createElement('img')
    const deleteImage = document.createElement('button')
    container.classList.add('image-container')
    image.src = `${import.meta.env.VITE_API_URL}/api/admin/images/${file}`
    image.title = file
    image.alt = file
    image.classList.add('image')
    deleteImage.innerHTML = 'x'
    deleteImage.classList.add('delete-image')
    container.appendChild(deleteImage)
    container.appendChild(image)
    gallery.appendChild(container)
    return container
  }

  toggleDisabled () {
    const button = this.shadow.querySelector('.submit-button')
    this.shadow.querySelector('.gallery .selected') ? button.disabled = false : button.disabled = true
  }
}
customElements.define('image-modal-component', ImageModal)
