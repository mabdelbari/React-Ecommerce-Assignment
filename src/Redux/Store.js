import { configureStore } from "@reduxjs/toolkit";
import { userRegistrationReducer } from "./userRegistrationSlice";
import { authReducer } from "./authSlice";
import { cartReducer } from "./cartSlice";
import { wishlistReducer } from "./wishlistSlice"

const store = configureStore({
    reducer: {
        userRegistrationReducer,
        authReducer,
        cartReducer,
        wishlistReducer
    }
})

export default store