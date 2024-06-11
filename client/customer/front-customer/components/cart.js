class Cart extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.products = [
      {
        name: 'Buzz cola light',
        price: 10.00,
        units: 16,
        measure: 330,
        measureUnit: 'ml',
        quantity: 3
      },
      {
        name: 'Buzz cola con limón',
        price: 20.00,
        units: 16,
        measure: 330,
        measureUnit: 'ml',
        quantity: 2
      },
      {
        name: 'Buzz cola',
        price: 30.55,
        units: 16,
        measure: 330,
        measureUnit: 'ml',
        quantity: 1
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
          text-align: end;
        }
        .total {
          padding: 1rem;
          border-block: var(--border, 3px solid rgba(0, 0, 0, 0.2));
          border-color: var(--white, rgb(203, 219, 235));
          font-size: 2rem;
          text-align: center;
        }
        .order-button {
          width: 15rem;
          margin: 1rem auto;
          padding: 1rem;
          background-color: var(--primary-color, rgb(0, 56, 168));
          color: var(--white, rgb(203, 219, 235));
          font: inherit;
          border: none;
          border-radius: 100rem;
          box-shadow: var(--sahdow, 5px 5px 0px 0px rgba(0, 0, 0, 0.2));
          text-decoration: none;
          text-align: center;
          cursor: pointer;
          &:hover {
            transform: scale(1.05);
            filter: brightness(1.1);
          }
        }
        .modal-background {
          visibility: hidden;
          position: fixed;
          inset: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(0,0,0,0.4);
          &.active {
            visibility: visible;
          }
        }
        .modal {
          max-width: 90%;
          width: 50rem;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          overflow: hidden;
          background-color: var(--secondary-color, rgb(94, 55, 81));
          border-radius: 1rem;
          text-align: center;
        }
        .active .modal {
          animation: drop 0.3s ease-in forwards;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0;
          padding: 1rem;
          background-color: var(--primary-color, rgb(0, 56, 168));
          border-bottom: var(--border, 3px solid rgba(0, 0, 0, 0.2));
        }
        .close-modal {
          background: none;
          color: inherit;
          border: none;
          font: inherit;
          cursor: pointer;
          &:hover {
            transform: scale(1.1);
          }
        }
        .modal-main {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 1rem;
          p {
            color: var(--grey-white, rgb(187, 194, 212));
            font-size: 1.2rem;
          }
        }
        .modal-title {
          font-size: 1.75rem;
        }
        @keyframes drop {
          0% {
            transform: translateY(-100vh);
          }
          80% {
            transform: translateY(10vh);
          }
          95% {
            transform: translateY(-1vh);
          }
          100% {
            transform: translateY(0);
          }
        }
      </style>
      <div class="products">
        <div class="product-gallery"></div>
        <p class="total">Total: ${this.products.reduce((sum, product) => sum + (product.price * product.quantity), 0)}€</p>
        <button class="order-button">Finalizar pedido</button>
      </div>
      <div class="modal-background">
        <div class="modal">
          <header class="modal-header">
            <h3>Pedido realizado</h3>
            <button class="close-modal">x</button>
          </header>
          <main class="modal-main">
            <h5 class="modal-title">¡Gracias por comprar con nosotros!</h5>
            <p>Su pedido ha sido realizado con éxito</p>
          </main>
        </div>
      </div>
      `
    this.products.forEach(product => {
      const productContainer = document.createElement('div')
      const name = document.createElement('p')
      const price = document.createElement('p')
      const details = document.createElement('p')
      const quantity = document.createElement('p')
      productContainer.classList.add('product')
      name.classList.add('name')
      name.innerHTML = product.name
      price.classList.add('price')
      price.innerHTML = `${product.price.toFixed(2)}€`
      details.classList.add('details')
      details.innerHTML = `${product.units}u, ${product.measure}${product.measureUnit}`
      quantity.classList.add('quantity')
      quantity.innerHTML = `${product.quantity}x${product.price.toFixed(2)}€`
      productContainer.appendChild(name)
      productContainer.appendChild(price)
      productContainer.appendChild(details)
      productContainer.appendChild(quantity)
      this.shadow.querySelector('.product-gallery').appendChild(productContainer)
    })
    const modal = this.shadow.querySelector('.modal-background')
    this.shadow.querySelector('.order-button').addEventListener('click', (event) => {
      event.preventDefault()
      modal.classList.add('active')
    })
    modal.addEventListener('click', (event) => {
      if (!event.target.closest('.modal') || event.target.closest('.close-modal')) {
        modal.classList.remove('active')
      }
    })
  }
}

customElements.define('cart-component', Cart)