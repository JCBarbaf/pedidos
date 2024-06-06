import { createSlice } from '@reduxjs/toolkit'

export const imagesSlice = createSlice({
  name: 'images',
  initialState: {
    imageGallery: null,
    showedImages: [],
    selectedImages: []
  },
  reducers: {
    setImageGallery: (state, action) => {
      state.imageGallery = action.payload
    },
    showImage: (state, action) => {
      if (!state.showedImages.some(image =>
        image.name === action.payload.name &&
        // image.languageAlias === action.payload.languageAlias &&
        image.filename === action.payload.filename)) {
        state.showedImages.push(action.payload)
      }
    },
    showImages: (state, action) => {
      // {name: 'avatar', title: '', alt: '', filename: '360-F-678376151-osW7O1VqMI6ly9wOBJ2vIVRgBLhCYSa8.webp'}
      // lg: {banner: {{originalFilename: '1583254719-1711015431497.webp', filename: '1583254719-1711015431497-300x300.webp', title: '', alt: '', widthPx: '300'}}}
      const data = Object.values(action.payload)[0]
      if (data) {
        state.showedImages = Object.entries(data).map(([key, value]) => ({
          name: key,
          filename: value.originalFilename,
          title: value.title,
          alt: value.alt
        }))
      }
      console.log(state.showedImages)
    },
    addImage: (state, action) => {
      if (!state.selectedImages.some(image =>
        image.name === action.payload.name &&
        // image.languageAlias === action.payload.languageAlias &&
        image.filename === action.payload.filename)) {
        state.selectedImages.push(action.payload)
      }
    },
    removeImage: (state, action) => {
      const selectedImage = state.selectedImages.findIndex(image =>
        image.filename === action.payload.filename &&
        // image.languageAlias === action.payload.languageAlias &&
        image.name === action.payload.name
      )
      if (selectedImage !== -1) {
        state.selectedImages.splice(selectedImage, 1)
      }
      const showedImage = state.showedImages.findIndex(image =>
        image.filename === action.payload.filename &&
        // image.languageAlias === action.payload.languageAlias &&
        image.name === action.payload.name
      )
      if (showedImage !== -1) {
        state.showedImages.splice(showedImage, 1)
      }
    },
    removeImages: (state, action) => {
      state.showedImages = []
      state.selectedImages = []
    }
  }
})

export const { setImageGallery, showImage, showImages, addImage, removeImage, removeImages } = imagesSlice.actions

export default imagesSlice.reducer
