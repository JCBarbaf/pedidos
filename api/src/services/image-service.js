const fs = require('fs/promises')
const path = require('path')
const sharp = require('sharp')

module.exports = class ImageService {
  uploadImage = async images => {
    const result = []
    for (const image of images.file) {
      try{
        let filename = image.originalname.replace(/[_\s]/g,"-")
        let filePath = path.join(__dirname, `../storage/images/gallery/original`, path.parse(filename).name + '.webp')
        const newFilename = await fs.access(filePath).then(async () => {
          return `${path.parse(filename).name}-${new Date().getTime()}.webp`
        }).catch(async () => {
          return `${path.parse(filename).name}.webp`
        })
        await sharp(image.buffer)
          .webp({ lossless: true })
          .toFile(path.join(__dirname, `../storage/images/gallery/original/${newFilename}`))
  
        await sharp(image.buffer)
          .resize(135, 135)
          .webp({ quality: 80 })
          .toFile(path.join(__dirname, `../storage/images/gallery/thumbnail/${newFilename}`))

        result.push(newFilename)
      }catch(error){
        console.log(error)
      }  
    }
    return result
  }

  resizeImages = async (images) => {
    let resizedImages = {}
    for (const image of images) {
      for (const size in image.imageConfiguration) {
        try {
          let newFilename = image.filename.split('.')
          newFilename.pop()
          newFilename = newFilename.join('.') + `-${image.imageConfiguration[size].widthPx}x${image.imageConfiguration[size].heightPx}.webp`
          await fs.access(path.join(__dirname, `../storage/images/resize/${newFilename}`)).then(async () => {
            console.log('this file already exists')
          }).catch(async () => {
            await sharp(path.join(__dirname, `../storage/images/gallery/original`, image.filename))
              .resize(parseInt(image.imageConfiguration[size].widthPx),parseInt(image.imageConfiguration[size].heightPx))
              .webp({ quality: 80 })
              .toFile(path.join(__dirname, `../storage/images/resize/${newFilename}`))
            resizedImages[size] = resizedImages[size] || {}
            resizedImages[size][image.name] = {
              originalFilename: image.filename,
              filename: newFilename,
              title: image.title,
              alt: image.alt,
              widthPx: image.imageConfiguration[size].widthPx,
              heightPx: image.imageConfiguration[size].heightPx
            }
          })
        } catch (error) {
          console.log(error)
        }
      }
    }
    return resizedImages
  }

  deleteImages = async filename => {
    try {
      await fs.unlink(path.join(__dirname, `../storage/images/gallery/original/${filename}`))
      await fs.unlink(path.join(__dirname, `../storage/images/gallery/thumbnail/${filename}`))

      return 1
    } catch {
      return 0
    }
  }
}