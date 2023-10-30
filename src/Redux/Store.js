import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";
import { cartReducer } from "./cartSlice";
import { wishlistReducer } from "./wishlistSlice"

const store = configureStore({
    reducer: {
        authReducer,
        cartReducer,
        wishlistReducer
    }
})

export default store