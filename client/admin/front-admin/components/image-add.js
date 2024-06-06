import { store } from '../redux/store.js'
import { removeImage, removeImages, setImageGallery, addImage } from '../redux/images-slice.js'
import isEqual from 'lodash-es/isEqual'
class ImageAdd extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.name = this.getAttribute('name')
    this.multiple = this.getAttribute('multiple')
    this.unsubscribe = null
    this.images = []
  }

  connectedCallback () {
    this.render()
    this.unsubscribe = store.subscribe(() => {
      console.log(this.images)
      const currentState = store.getState()
      if (currentState.images.showedImages.length > 0 && !isEqual(this.images, currentState.images.showedImages)) {
        this.images = currentState.images.showedImages
        // console.log(this.images)
        this.showThumbnails(this.images)
      } else if (currentState.images.showedImages.length <= 0) {
        this.images = []
        this.removeThumbnails()
      }
    })
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
      <style>
        :host {
          background-color: red;
          flex: 1;
        }
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        .container {
          --size: 8rem;
          max-width: 100%;
          display: flex;
          align-items: center;
          gap: 2%;
        }
        .add-image {
          width: var(--size);
          height: var(--size);
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          margin: 2% 0;
          background-color: var(--tertiary-color,rgb(150, 156, 172));
          color: rgb(0,0,0,0.2);
          border: var(--border,3px solid rgba(0, 0, 0, 0.2));
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 4rem;
          &:hover {
            transform: scale(1.1);
          }
        }
        .add-button {
          background: none;
          border: none;
        }
        .thumbnail {
          /*width: 100%;
          height: 100%;*/
          width: var(--size);
          height: var(--size);
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          object-fit: cover;
        }
        .add-image .thumbnail {
          position: absolute;
        }
        .container>.thumbnail {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          margin: 2% 0;
          border: var(--border,3px solid rgba(0, 0, 0, 0.2));
          border-radius: 0.5rem;
          cursor: pointer;
        }
        .thumbnail-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
        }
        .image-icon {
          width: 100%;
          height: 100%;
          & * {
            fill: rgb(0,0,0,0.3)
          }
        }
        *:hover>.delete-button {
          display: flex;
        }
        .delete-button {
          width: 1.2rem;
          height: 1.2rem;
          position: absolute;
          top: 3%;
          right: 3%;
          display: none;
          justify-content: center;
          align-items: center;
          background-color: var(--red, red);
          color: white;
          border-radius: 1rem;
          font-size: 1rem;
          z-index: 100;
        }
      </style>
      <div class="container">
        <div class="add-image">
          <button class="add-button">
            <svg class="image-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" /></svg>
          </button>
        </div>
      </div>
      `
    this.shadow.addEventListener('click', (event) => {
      if (event.target.closest('.add-button')) {
        event.preventDefault()
        const image = {
          name: this.getAttribute('name')
        }
        store.dispatch(setImageGallery(image))
        document.dispatchEvent(new CustomEvent('showImageModal'))
      }
    })
  }

  showThumbnails (images) {
    const oldImages = this.shadow.querySelectorAll('.thumbnail')
    oldImages?.forEach(image => {
      image.remove()
    })
    images.forEach(image => {
      if (image.name === this.name) {
        const thumbnail = document.createElement('div')
        const newImage = document.createElement('img')
        const deleteButton = document.createElement('p')
        thumbnail.classList.add('thumbnail')
        newImage.alt = image.alt
        newImage.title = image.title
        newImage.src = `${import.meta.env.VITE_API_URL}/api/admin/images/${image.filename}`
        newImage.classList.add('thumbnail-image')
        deleteButton.innerHTML = 'x'
        deleteButton.classList.add('delete-button')
        deleteButton.addEventListener('click', (event) => {
          store.dispatch(removeImage(image))
          thumbnail.remove()
        })
        thumbnail.appendChild(newImage)
        thumbnail.appendChild(deleteButton)
        if (this.multiple !== null) {
          const container = this.shadow.querySelector('.container')
          container.appendChild(thumbnail)
        } else {
          const button = this.shadow.querySelector('.add-image')
          button.appendChild(thumbnail)
        }
        store.dispatch(addImage({
          ...image,
          imageConfiguration: JSON.parse(this.getAttribute('image-configuration'))
        }))
      }
    })
  }

  removeThumbnails () {
    const images = this.shadow.querySelectorAll('.thumbnail')
    images.forEach(image => {
      image.remove()
    })
  }
}

customElements.define('image-add-component', ImageAdd)
