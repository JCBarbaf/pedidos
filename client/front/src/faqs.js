class Faqs extends HTMLElement {

  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  async connectedCallback () {
    this.loadData().then(() => this.render())
  }

  async loadData () {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${this.getAttribute('endpoint')}`)
    const data = await response.json()
    // console.log(data)
    this.rows = data
    this.faqs = []
    this.rows.forEach(row => {
      this.faqs.push({
        title: row.locales.question,
        description: row.locales.answer,
        images: row.images
      })
    });
  }

  render () {
    this.shadow.innerHTML =
    /*html*/`
    <style>

      .faqs-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      details {
        color: hsl(0, 0%, 100%);
        font-family: 'Lato', sans-serif;
        font-size: 1.2rem;
      }

      summary {
        border-bottom: 1px solid hsl(0, 0%, 100%);
        color: hsl(0, 0%, 100%);
        cursor: pointer;
        font-family: 'Lato', sans-serif;
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 1rem;
        padding: 0.5rem;
      }
      /*picture * {
        width: 5rem;
        height: 5rem;
      }*/
    </style>
    <div class="faqs-container">
    </div>
    `
    const faqsContainer = this.shadow.querySelector('.faqs-container')
    this.faqs.forEach(faq => {
      console.log(faq)
      const faqElement = document.createElement('details')
      const faqElementSummary = document.createElement('summary')
      const picture = document.createElement('picture')
      const sourceLg = document.createElement('source')
      const sourceMd = document.createElement('source')
      const sourceSm = document.createElement('source')
      const image = document.createElement('img')
      sourceLg.srcset = `${import.meta.env.VITE_API_URL}/api/front/images/image/${faq.images.lg.avatar.filename}`
      sourceMd.srcset = `${import.meta.env.VITE_API_URL}/api/front/images/image/${faq.images.md.avatar.filename}`
      sourceSm.srcset = `${import.meta.env.VITE_API_URL}/api/front/images/image/${faq.images.sm.avatar.filename}`
      image.src = `${import.meta.env.VITE_API_URL}/api/front/images/image/${faq.images.xs.avatar.filename}`
      sourceLg.media = '(min-width: 1024px)'
      sourceMd.media = '(min-width: 768px)'
      sourceSm.media = '(min-width: 526px)'
      image.title = faq.images.xs.avatar.title
      image.title = faq.images.xs.avatar.alt
      picture.appendChild(sourceLg)
      picture.appendChild(sourceMd)
      picture.appendChild(sourceSm)
      picture.appendChild(image)
      faqElement.name = "faq"
      faqElementSummary.textContent = faq.title
      faqElement.appendChild(faqElementSummary)
      faqElement.appendChild(picture)
      faqElement.innerHTML += faq.description
      faqsContainer.appendChild(faqElement)
    });
  }
}

customElements.define('faqs-component', Faqs)