import { store } from '../redux/store.js'
import { updateCart } from '../redux/cart-slice.js'

class Products extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.products = [
      {
        id: 1,
        name: 'Buzz cola light',
        price: 10.00,
        units: 16,
        measure: 330,
        measureUnit: 'ml'
      },
      {
        id: 2,
        name: 'Buzz cola con limón',
        price: 10.00,
        units: 16,
        measure: 330,
        measureUnit: 'ml'
      },
      {
        id: 3,
        name: 'Buzz cola',
        price: 10.00,
        units: 16,
        measure: 330,
        measureUnit: 'ml'
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
          font-size: 1.25rem;
        }
        .products {
          height: 90vh;
          display: flex;
          flex-direction: column;
        }
        .product-gallery {
          display: flex;
          align-items: flex-start;
          flex-wrap: wrap;
          flex: 1;
          overflow: auto;
        }
        .product {
          width: 22rem;
          display: grid;
          grid-template-areas: 
          "name name price"
          "details details quantity";
          gap: 1rem;
          margin: 1rem auto;
          padding: 1rem;
          border-bottom: var(--border, 3px solid rgba(0, 0, 0, 0.2));
          border-color: var(--white, rgb(203, 219, 235));
        }
        .name {
          grid-area: name;
        }
        .price {
          grid-area: price;
          text-align: end;
        }
        .details {
          grid-area: details;
        }
        .quantity {
          grid-area: quantity;
          display: flex;
          justify-content: flex-end;
          align-items: stretch;
          button {
            --size: 1.5rem;
            width: var(--size);
            min-height: var(--size);
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: var(--primary-color, rgb(0, 56, 168));
            color: inherit;
            border: none;
            font: inherit;
            cursor: pointer;
            &:hover {
              filter: brightness(1.1);
            }
            &.substract {
              border-radius: 0.2rem 0 0 0.2rem;
            }
            &.add {
              border-radius: 0 0.2rem 0.2rem;
            }
          }
        }
        .quantity-number {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 0.5rem;
          background-color: var(--white, rgb(203, 219, 235));
          color: var(--primary-color, rgb(0, 56, 168));
          line-height: 0;
        }
      </style>
      <div class="products">
        <div class="product-gallery"></div>
      </div>
      `
    this.products.forEach(product => {
      const productContainer = document.createElement('div')
      const name = document.createElement('p')
      const price = document.createElement('p')
      const details = document.createElement('p')
      const quantity = document.createElement('div')
      const substract = document.createElement('button')
      const add = document.createElement('button')
      const number = document.createElement('p')
      productContainer.classList.add('product')
      name.classList.add('name')
      name.innerHTML = product.name
      price.classList.add('price')
      price.innerHTML = `${product.price.toFixed(2)}€`
      details.classList.add('details')
      details.innerHTML = `${product.units}u, ${product.measure}${product.measureUnit}`
      quantity.classList.add('quantity')
      substract.classList.add('substract')
      substract.innerHTML = '-'
      add.classList.add('add')
      add.innerHTML = '+'
      number.classList.add('quantity-number')
      number.innerHTML = 0
      productContainer.appendChild(name)
      productContainer.appendChild(price)
      productContainer.appendChild(details)
      quantity.appendChild(substract)
      quantity.appendChild(number)
      quantity.appendChild(add)
      productContainer.appendChild(quantity)
      add.addEventListener('click', (event) => {
        number.innerHTML++
        store.dispatch(updateCart({
          ...product,
          quantity: parseInt(number.innerHTML)
        }))
      })
      substract.addEventListener('click', (event) => {
        if (number.innerHTML > 0) {
          number.innerHTML--
          store.dispatch(updateCart({
            ...product,
            quantity: parseInt(number.innerHTML)
          }))
        }
      })
      this.shadow.querySelector('.product-gallery').appendChild(productContainer)
    })
  }
}

customElements.define('products-component', Products)
