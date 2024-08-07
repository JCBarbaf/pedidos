class Order extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.customerId = 1
  }

  connectedCallback () {
    this.loadData().then(() => this.render())
  }

  async loadData() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${this.getAttribute('endpoint')}`,{
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('customerAccessToken'),
      },
    })
    this.orders = await response.json()
    console.log(this.orders)
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
        .orders {
          height: 90vh;
          display: flex;
          flex-direction: column;
        }
        .filters {
          display: grid;
          grid-template-areas: 
          "inputs"
          "open";
          &.opened {
            .filter-content {
              max-height: 20rem;
            }
            .arrow-down {
              transform: rotate(180deg);
            }
          }
        }
        .filter-content {
          max-height: 0;
          grid-area: inputs;
          overflow: hidden;
          transition: max-height 0.3s ease-in;
        }
        .filter-inputs {
          display: flex;
          justify-content: space-evenly;
          align-items: center;
          padding: 1rem 0;
          background-color: var(--secondary-color, rgb(94, 55, 81));
          input {
            width: 40%;
            padding: 0.2rem;
            background-color: var(--grey-white, rgb(187, 194, 212));
            border: var(--border, 3px solid rgba(0, 0, 0, 0.2));
            &:focus {
              border-color: var(--green, rgb(34, 156, 34));
              outline: none;
            }
          }
        }
        .open-filters {
          grid-area: open;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background-color: var(--primary-color, rgb(0, 56, 168));
          border-top: var(--border, 3px solid rgba(0, 0, 0, 0.2));
          border-radius: 0 0 1rem 1rem;
          cursor: pointer;
        }
        .arrow-down {
          --size: 1rem;
          width: var(--size);
          height: var(--size);
          transition: transform 0.3s ease-in;
          * {
            fill: var(--white, rgb(203, 219, 235));
          }
        }
        .order-gallery {
          display: flex;
          align-items: flex-start;
          flex-wrap: wrap;
          flex: 1;
          overflow: auto;
        }
        .order {
          width: 22rem;
          display: grid;
          grid-template-areas: 
          "returnTag returnTag returnTag"
          "reference reference total"
          "dateTime dateTime button"
          ;
          gap: 1rem;
          margin: 1rem auto;
          padding: 1rem;
          border-bottom: var(--border, 3px solid rgba(0, 0, 0, 0.2));
          border-color: var(--white, rgb(203, 219, 235));
          &.returned {
            border-color: var(--red, rgb(153, 31, 24));
            .return-tag {
              visibility: visible;
            }
          }
        }
        .reference {
          grid-area: reference;
        }
        .total {
          grid-area: total;
          text-align: end;
        }
        .dateTime {
          grid-area: dateTime;
          font-size: 1rem;
          color: var(--grey, rgb(113, 117, 129));
        }
        .details-button {
          grid-area: button;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0.5rem;
          background-color: var(--primary-color, rgb(0, 56, 168));
          color: var(--white, rgb(203, 219, 235));
          border: none;
          border-radius: 100rem;
          font: inherit;
          font-size: 1rem;
          text-decoration: none;
          cursor: pointer;
          &:hover {
            transform: scale(1.1);
            filter: brightness(1.1);
          }
        }
        .return-tag {
          grid-area: returnTag;
          visibility: hidden;
          padding: 0.25rem;
          background-color: var(--red, rgb(153, 31, 24));
          border-radius: 1rem 1rem 0.25rem 0.25rem;
          text-align: center;
        }
        .order-button {
          width: 15rem;
          margin: 1rem auto;
          padding: 1rem;
          background-color: var(--primary-color, rgb(0, 56, 168));
          color: var(--white, rgb(203, 219, 235));
          font: inherit;
          border-radius: 100rem;
          box-shadow: var(--sahdow, 5px 5px 0px 0px rgba(0, 0, 0, 0.2));
          text-decoration: none;
          text-align: center;
        }
        .details-background {
          opacity: 0;
          background-color: rgba(0, 0, 0,0.2);
          position: absolute;
          inset: 0;
          display: flex;
          justify-content: flex-end;
          overflow: hidden;
          z-index: 200;
          pointer-events: none;
          transition: opacity 0.3s ease-in;
          &:has(.active) {
            opacity: 1;
            pointer-events: all;
          }
        }
        .details {
          width: 100%;
          max-width: 30rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          background-color: var(--secondary-color, rgb(94, 55, 81));
          border-left: var(--border, 3px solid rgba(0, 0, 0, 0.2));
          transform: translateX(100%);
          transition: transform 0.3s ease-in;
          &.active {
            transform: translateX(0);
          }
        }
        .details-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background-color: var(--primary-color, rgb(0, 56, 168));
          border-bottom: var(--border, 3px solid rgba(0, 0, 0, 0.2));
        }
        .close {
          background: none;
          color:inherit;
          border: none;
          font: inherit;
          cursor: pointer;
          &:hover {
            transform: scale(1.1);
          }
        }
        .product-gallery {
          flex: 1;
          overflow: auto;
        }
        .product {
          width: 22rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 1rem auto;
          padding: 1rem;
          border-bottom: var(--border, 3px solid rgba(0, 0, 0, 0.2));
        }
        .details-total {
          padding: 1rem;
          border-block: var(--border, 3px solid rgba(0, 0, 0, 0.2));
          border-color: var(--white, rgb(203, 219, 235));
          font-size: 2rem;
          text-align: center;
        }
        .details-total-price {
          font-size: inherit;
        }
        .return-button {
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
          &:disabled {
            background-color: var(--grey, rgb(113, 117, 129));
            pointer-events: none;
          }
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
          z-index: 500;
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
          animation: drop 0.3s ease-in-out forwards;
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
          align-items: center;
          gap: 1rem;
          p {
            color: var(--grey-white, rgb(187, 194, 212));
            font-size: 1.2rem;
          }
        }
        .modal-title {
          font-size: 1.75rem;
        }
        .home-button {
          padding: 0.75rem 2rem;
          background-color: var(--primary-color, rgb(0, 56, 168));
          color: var(--white, rgb(203, 219, 235));
          border-radius: 20rem;
          text-decoration: none;
          &:hover {
            transform: scale(1.1);
            filter: brightness(1.1);
          }
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
      <div class="orders">
        <div class="filters">
          <div class="filter-content">
            <div class="filter-inputs">
              <input type="text" name="reference" class="reference-filter" placeholder="Referencia">
              <input type="date" name="saleDate" class="date-filter">
            </div>
          </div>
          <div class="open-filters">
            <p>Filtrar</p>
            <svg class="arrow-down" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M58.1411 84.3343C54.3948 91.2219 44.6051 91.2219 40.8589 84.3343L8.73419 25.2723C5.1205 18.6285 9.87527 10.5 17.3753 10.5L81.6247 10.5C89.1247 10.5 93.8795 18.6285 90.2658 25.2723L58.1411 84.3343Z" fill="black"/>
            </svg>
          </div>
        </div>
        <div class="order-gallery"></div>
      </div>
      <div class="details-background">
        <div class="details">
          <header class="details-header">
            <h5>Detalles</h5>
            <button class="close">X</button>
          </header>
          <div class="product-gallery"></div>
          <div class="details-total">Total: <span class="details-total-price"></span>€</div>
          <button class="return-button">Devolver pedido</button>
        </div>
      </div>
      <div class="modal-background">
        <div class="modal">
          <header class="modal-header">
            <h3>Devolución realizada</h3>
            <button class="close-modal">x</button>
          </header>
          <main class="modal-main">
            <h5 class="modal-title">¡La petición de su devolución se ha realizado con éxito!</h5>
            <p>Su devolución será procesada en los proximos dias.</p>
            <p>Referencia: <span class="order-reference"></span></p>
          </main>
        </div>
      </div>
      `
    this.LoadOrders()
    const details = this.shadow.querySelector('.details')
    this.shadow.addEventListener('click', async (event) => {
      if (event.target.closest('.open-filters')) {
        const filters = event.target.closest('.filters')
        if(filters.classList.contains('opened')) {
          const reference = this.shadow.querySelector('[name="reference"]').value.trim() == '' ? null : this.shadow.querySelector('[name="reference"]').value
          const saleDate = this.shadow.querySelector('[name="saleDate"]').value.trim() == '' ? null : this.shadow.querySelector('[name="saleDate"]').value
          // console.log(reference, saleDate)
          const response = await fetch(`${import.meta.env.VITE_API_URL}${this.getAttribute('endpoint')}?reference=${reference}&saleDate=${saleDate}`,{
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('customerAccessToken'),
            },
          })
          this.orders = await response.json()
          console.log(this.orders)
          this.LoadOrders()
        }
        filters.classList.toggle('opened')
      }
      if (event.target.closest('.details-button')) {
        this.LoadSaledetails(event.target.closest('.details-button').dataset.saleId, event.target.closest('.details-button').dataset.returned)
        details.classList.add('active')
      }
      if (event.target.closest('.close') || (event.target.closest('.details-background') && !event.target.closest('.details'))) {
        details.classList.remove('active')
      }
      if (event.target.closest('.return-button')) {
        const saleId = event.target.closest('.return-button').dataset.saleId
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/customer/returns/${saleId}`, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('customerAccessToken'),
          },
          method: 'post'
        })
        const data = await response.json()
        this.shadow.querySelector('.details').classList.remove('active')
        this.shadow.querySelector('.modal-background').classList.add('active')
        this.shadow.querySelector('.order-reference').innerHTML = data.reference
        await this.loadData()
        this.LoadOrders()
      }
      if (event.target.closest('.close-modal') || (event.target.closest('.modal-background') && !event.target.closest('.modal'))) {
        this.shadow.querySelector('.modal-background').classList.remove('active')
      }
    })
  }
  LoadOrders() {
    console.log('hola')
    this.shadow.querySelector('.order-gallery').innerHTML = ""
    this.orders.forEach(order => {
      const orderContainer = document.createElement('div')
      const reference = document.createElement('p')
      const total = document.createElement('p')
      const dateTime = document.createElement('p')
      const button = document.createElement('button')
      const returnedTag = document.createElement('p')
      orderContainer.classList.add('order')
      if (order.returned) orderContainer.classList.add('returned')
      reference.classList.add('reference')
      reference.innerHTML = order.reference
      total.classList.add('total')
      total.innerHTML = `${order.totalBasePrice}€`
      dateTime.classList.add('dateTime')
      dateTime.innerHTML = `${order.saleDate} ${order.saleTime}`
      button.classList.add('details-button')
      button.dataset.saleId = order.id
      if (order.returned) button.dataset.returned = true
      button.innerHTML = 'Ver pedido'
      returnedTag.classList.add('return-tag')
      returnedTag.innerHTML = 'Devolución'
      orderContainer.appendChild(reference)
      orderContainer.appendChild(total)
      orderContainer.appendChild(dateTime)
      orderContainer.appendChild(button)
      orderContainer.appendChild(returnedTag)
      this.shadow.querySelector('.order-gallery').appendChild(orderContainer)
    })
  }
  async LoadSaledetails(saleId, returned) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${this.getAttribute('endpoint')}/details/${saleId}`,{
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('customerAccessToken'),
      },
    })
    const saleDetails = await response.json()
    const productGallery = this.shadow.querySelector('.product-gallery')
    let totalPrice = 0
    productGallery.innerHTML = ""
    saleDetails.forEach(saleDetail => {
      const productContainer = document.createElement('div')
      const productName = document.createElement('p')
      const productSale = document.createElement('p')
      productContainer.classList.add('product')
      productName.classList.add('product-name')
      productName.innerHTML = saleDetail.productName
      productSale.classList.add('product-sale')
      productSale.innerHTML = `${saleDetail.quantity} x ${saleDetail.basePrice}€`
      totalPrice += saleDetail.quantity * saleDetail.basePrice
      productContainer.appendChild(productName)
      productContainer.appendChild(productSale)
      productGallery.appendChild(productContainer)
    })
    this.shadow.querySelector('.details-total-price').innerHTML = totalPrice.toFixed(2)
    this.shadow.querySelector('.return-button').dataset.saleId = saleId
    this.shadow.querySelector('.return-button').disabled = returned ? true: false
  }
}

customElements.define('order-component', Order)
