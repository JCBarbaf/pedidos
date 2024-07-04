const puppeteer = require('puppeteer')
const ejs = require('ejs')
const fs = require('fs')
const path = require('path')

module.exports = class PdfService {
  async createPdf (userId, userType, type, data = []) {
    try {
      const filename = this.getFileName(userType, type, data)

      const folder = path.join(__dirname, `../storage/pdfs/${userType}/${userId}/${type}`)
      fs.mkdirSync(folder, { recursive: true })

      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      const file = path.join(`${folder}/${filename}.pdf`)

      const htmlContent = await new Promise((resolve, reject) => {
        ejs.renderFile(path.join(__dirname, `../templates/pdfs/${userType}/${type}.ejs`), { data }, (err, str) => {
          if (err) {
            reject(err);
          } else {
            resolve(str);
          }
        });
      });

      await page.setContent(htmlContent, { waitUntil: 'networkidle0', timeout: 60000 });

      await page.pdf({
        path: file,
        format: 'A4'
      });

      await browser.close();

      const result = {
        filename: `${filename}.pdf`,
        path: file
      };

      return result;

    } catch (err) {
      console.error('Hubo un error al crear el PDF:', err)
    }
  }

  async createBuffer (userId, userType, type, data = []) {
    try {
      const browser = await puppeteer.launch()
      const page = await browser.newPage()

      return new Promise((resolve, reject) => {
        ejs.renderFile(path.join(__dirname, `../templates/pdfs/${userType}/es/${type}.ejs`), { data }, async (err, htmlContent) => {
          if (err) {
            console.error('Hubo un error al renderizar el archivo EJS:', err)
            browser.close()
            reject(err)
            return
          }

          await page.setContent(htmlContent)

          const buffer = await page.pdf({
            format: 'A4'
          })

          await browser.close()

          resolve(buffer)
        })
      })
    } catch (err) {
      console.error('Hubo un error al crear el PDF:', err)
    }
  }

  async getLanguages () {
    try {
      return await Language.find({ deletedAt: { $exists: false }, selected: true }).lean().exec()
    } catch (err) {
      console.error('Hubo un error al recuperar los idiomas:', err)
    }
  }

  getFileName (userType, type, data) {
    let fileName = ''

    if (userType === 'customer' || userType === 'user') {
      if (type === 'order-details') {
        fileName = `${data.sale.reference}`
      }
    }

    return fileName
  }
}