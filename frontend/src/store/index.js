import { configureStore } from '@reduxjs/toolkit'
import auth from "./Slice/authSlice"
import activate from "./Slice/activateSlice"

export const store= configureStore({
    reducer:{
        auth,
        activate
    }
})