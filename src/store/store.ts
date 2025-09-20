import { configureStore } from '@reduxjs/toolkit'
import { helperSlice } from './features/helper/helperSlice.ts'

export const store = configureStore({
  reducer: {
    helper: helperSlice.reducer,
  },
});

store.subscribe(() => {
  localStorage.setItem("helper", JSON.stringify(store.getState().helper));
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch