//Import Redux's store creator.
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'

//Create the central Redux store.
export const store = configureStore({
    reducer:{
        auth: authReducer
    }
})
//Create a TypeScript type for the entire Redux state.
export type RootState = ReturnType<typeof store.getState>
//Create a TypeScript type for Redux's dispatch.
export type AppDispatch = typeof store.dispatch