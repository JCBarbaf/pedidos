class CompaniesDataList extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.rows = null
  }

  connectedCallback () {
    document.addEventListener('reload', this.handlerReload.bind(this))
    this.loadData().then(() => this.render())
  }

  async loadData () {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${this.getAttribute('endpoint')}`)
    const data = await response.json()
    this.rows = data.rows
  }

  handlerReload () {
    this.loadData(this.currentPage).then(() => this.render())
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
        <style>
            svg {
                width: 30px;
            }
            svg * {
                fill: var(--white,white);
            }
            button {
                background: none;
                border: none;
                color: inherit;
                cursor: pointer;
            }
            button:has( svg):hover {
                animation: shake 0.2s ease-in forwards;
            }
            *::-webkit-scrollbar {
                width: 5px;
            }
            *::-webkit-scrollbar-track {
                background: none;
            }
            *::-webkit-scrollbar-thumb {
                background: var(--primary-color,rgb(0, 56, 168));
                border-radius: 10px;
            }
            span {
                margin-right: 1%;
                color: var(--tertiary-color,rgb(150, 156, 172));
                font-weight: bold;
                text-transform: capitalize;
            }
            main {
                height: 80vh;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                gap: 1%;
                overflow: hidden;
                background-color: var(--grey-black,rgb(32, 39, 55));
                border-radius: 20px;
                box-shadow: var(--sahdow,5px 5px 0px 0px rgba(0, 0, 0, 0.2));
            }
            header {
                background-color: var(--primary-color,rgb(0, 56, 168));
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 0;
                padding: 2% 3% 1% 2%;
                border-bottom: var(--border,3px solid rgba(0, 0, 0, 0.2));
            }
            .list-content {
                width: 95%;
                flex: 1;
                overflow-y: auto;
                margin: 0 auto;
                padding: 0 1%;
            }
            .data-table {
                width: 95%;
                overflow: hidden;
                margin: 0 auto 3%;
                background-color: var(--secondary-color,rgb(94, 55, 81));
                border-radius: 10px;
                box-shadow: var(--sahdow,5px 5px 0px 0px rgba(0, 0, 0, 0.2))
            }
            .data-table header {
                display: flex;
                justify-content: flex-end;
                padding: 1%;
                background-color: var(--primary-color,rgb(0, 56, 168));
                border-bottom: var(--border,3px solid rgba(0, 0, 0, 0.2));
            }
            .data-table-content {
                padding: 1% 3%;
            }
            footer {
                display: flex;
                justify-content: center;
                padding: 2%;
                background-color: var(--primary-color,rgb(0, 56, 168));
                border-top: var(--border,3px solid rgba(0, 0, 0, 0.2));
            }
            .pagination {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .pagination svg {
                width: 15px;
            }
            .pagination button:hover {
                filter: brightness(0.8);
                animation: none;
            }
            .pagination button:disabled {
                font-weight: bold;
                filter: brightness(0.5);
            }
            .pagination .last-page {
                transform: scaleX(-1);
            }
            .pagination .current-page {
                border-bottom: var(--border,3px solid rgba(0, 0, 0, 0.2));
                border-color: var(--tertiary-color,rgb(150, 156, 172));
            }
            @keyframes shake {
                0% {
                    transform: scale(1) rotate(0deg);
                }
                25% {
                    transform: scale(1.1) rotate(20deg);
                }
                75% {
                    transform: scale(1.1) rotate(-20deg);
                }
                100% {
                    transform: scale(1.1) rotate(0deg);
                }
            }
        </style>
        <main>
            <header>
                <p>5 Registros</p>
                <button class="filter-button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M14,12V19.88C14.04,20.18 13.94,20.5 13.71,20.71C13.32,21.1 12.69,21.1 12.3,20.71L10.29,18.7C10.06,18.47 9.96,18.16 10,17.87V12H9.97L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L14.03,12H14Z" />
                    </svg>
                </button>
            </header>
            <filter-component></filter-component>
            <div class="list-content">
                <delete-component></delete-component>
            </div>
            <footer>
                <div class="pagination">
                    <button class="first-page">
                        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.852 54.4136C9.04933 52.2298 9.04934 46.7702 12.852 44.5864L80.444 5.76861C84.2467 3.58477 89 6.31457 89 10.6822V88.3178C89 92.6854 84.2467 95.4152 80.444 93.2314L12.852 54.4136Z" fill="#D9D9D9"/>
                        </svg>
                    </button>
                    <button>1</button>
                    <button disabled>···</button>
                    <button class="current-page" >5</button>
                    <button disabled>···</button>
                    <button>10</button>
                    <button class="last-page">
                        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.852 54.4136C9.04933 52.2298 9.04934 46.7702 12.852 44.5864L80.444 5.76861C84.2467 3.58477 89 6.31457 89 10.6822V88.3178C89 92.6854 84.2467 95.4152 80.444 93.2314L12.852 54.4136Z" fill="#D9D9D9"/>
                        </svg>
                    </button>
                </div>
            </footer>
        </main>
      `
    const main = this.shadow.querySelector('main')
    this.rows.forEach(dataRow => {
      const dataList = this.shadow.querySelector('.list-content')
      const dataEntry = document.createElement('div')
      dataEntry.classList.add('data-table')
      const dataHeader = document.createElement('header')
      const editButton = document.createElement('button')
      editButton.classList.add('edit-button')
      editButton.dataset.id = dataRow.id
      editButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
        </svg>
      `
      const deleteButton = document.createElement('button')
      deleteButton.classList.add('delete-button')
      deleteButton.dataset.id = dataRow.id
      deleteButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M9,8H11V17H9V8M13,8H15V17H13V8Z" />
      </svg>
      `
      const tableContent = document.createElement('div')
      tableContent.classList.add('data-table-content')
      Object.entries(dataRow).forEach(([key, value]) => {
        if (key !== 'id') {
          const dataLine = document.createElement('p')
          dataLine.innerHTML = `<span>${key}</span>: ${value}`
          tableContent.appendChild(dataLine)
        }
      })
      dataEntry.appendChild(dataHeader)
      dataHeader.appendChild(deleteButton)
      dataHeader.appendChild(editButton)
      dataEntry.appendChild(tableContent)
      dataList.appendChild(dataEntry)
    })
    main?.addEventListener('click', async (event) => {
      if (event.target.closest('.delete-button')) {
        const elementId = event.target.closest('.delete-button').dataset.id
        const endpoint = `${import.meta.env.VITE_API_URL}${this.getAttribute('endpoint') + '/' + elementId}`
        document.dispatchEvent(new CustomEvent('showDeleteModal', {
          detail: {
            endpoint
          }
        }))
      }
      if (event.target.closest('.filter-button')) {
        document.dispatchEvent(new CustomEvent('showFilterModal'))
      }
      if (event.target.closest('.edit-button')) {
        const elementId = event.target.closest('.edit-button').dataset.id
        const response = await fetch(`${import.meta.env.VITE_API_URL}${this.getAttribute('endpoint') + '/' + elementId}`)
        const data = await response.json()
        document.dispatchEvent(new CustomEvent('showElement', { detail: { data } }))
      }
    })
  }
}
customElements.define('companies-data-list-component', CompaniesDataList)
