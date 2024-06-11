class Order extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.orders = [
      {
        reference: 10101011010,
        total: 180.00,
        dateTime: new Date('2024-6-10 12:55')
      },
      {
        reference: 10101011011,
        total: 10.00,
        dateTime: new Date('2024-6-11 6:30')
      },
      {
        reference: 10101011012,
        total: 250.00,
        dateTime: new Date('2024-7-20 1:00')
      },
      {
        reference: 10101011013,
        total: 1080.00,
        dateTime: new Date('2020-6-10 00:00')
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
          }
        }
        .open-filters {
          grid-area: open;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0.5rem;
          background-color: var(--primary-color, rgb(0, 56, 168));
          border-top: var(--border, 3px solid rgba(0, 0, 0, 0.2));
          border-radius: 0 0 1rem 1rem;
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
          "reference reference total"
          "dateTime dateTime button";
          gap: 1rem;
          margin: 1rem auto;
          padding: 1rem;
          border-bottom: var(--border, 3px solid rgba(0, 0, 0, 0.2));
          border-color: var(--white, rgb(203, 219, 235));
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
        .button {
          grid-area: button;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0.5rem;
          background-color: var(--primary-color, rgb(0, 56, 168));
          color: var(--white, rgb(203, 219, 235));
          border-radius: 100rem;
          font: inherit;
          font-size: 1rem;
          text-decoration: none;
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
      </style>
      <div class="orders">
        <div class="filters">
          <div class="filter-content">
            <div class="filter-inputs">
              <input type="text" name="reference" class="reference-filter" placeholder="Referencia">
              <input type="date" name="date" class="date-filter">
            </div>
          </div>
          <div class="open-filters">
            <svg class="arrow-down" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M58.1411 84.3343C54.3948 91.2219 44.6051 91.2219 40.8589 84.3343L8.73419 25.2723C5.1205 18.6285 9.87527 10.5 17.3753 10.5L81.6247 10.5C89.1247 10.5 93.8795 18.6285 90.2658 25.2723L58.1411 84.3343Z" fill="black"/>
            </svg>
          </div>
        </div>
        <div class="order-gallery"></div>
      </div>
      `
    this.orders.forEach(order => {
      const orderContainer = document.createElement('div')
      const reference = document.createElement('p')
      const total = document.createElement('p')
      const dateTime = document.createElement('p')
      const button = document.createElement('a')
      orderContainer.classList.add('order')
      reference.classList.add('reference')
      reference.innerHTML = order.reference
      total.classList.add('total')
      total.innerHTML = `${order.total.toFixed(2)}€`
      dateTime.classList.add('dateTime')
      dateTime.innerHTML = `${String(order.dateTime.getDate()).padStart(2, '0')}/${String(order.dateTime.getMonth() + 1).padStart(2, '0')}/${order.dateTime.getFullYear()} ${String(order.dateTime.getHours()).padStart(2, '0')}:${String(order.dateTime.getMinutes()).padStart(2, '0')}`
      button.classList.add('button')
      button.href = '#'
      button.innerHTML = 'Ver pedido'
      orderContainer.appendChild(reference)
      orderContainer.appendChild(total)
      orderContainer.appendChild(dateTime)
      orderContainer.appendChild(button)
      this.shadow.querySelector('.order-gallery').appendChild(orderContainer)
    })
    this.shadow.querySelector('.open-filters').addEventListener('click', (event) => {
      console.log(event.target.parentNode)
      event.target.closest('.filters').classList.toggle('opened')
    })
  }
}

customElements.define('order-component', Order)
