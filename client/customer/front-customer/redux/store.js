import { configureStore } from '@reduxjs/toolkit'
import cartsReducer from './cart-slice'

export const store = configureStore({
  reducer: {
    cart: cartsReducer
  }
})

export default store
