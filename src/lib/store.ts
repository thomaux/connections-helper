import { configureStore } from '@reduxjs/toolkit'
import { helperSlice } from './features/word/helperSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
        helper: helperSlice.reducer
    }
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']