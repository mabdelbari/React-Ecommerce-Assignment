import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";




const initialState = {
    isPending: false,
    userData: JSON.parse(localStorage.getItem('userData')),
    userToken: localStorage.getItem('userToken'),
    error: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUserToken: (state, { payload }) => {
            state.userToken = payload
        },
        setUserData: (state, { payload }) => {
            state.userData = payload
            localStorage.setItem('userData', JSON.stringify(payload))
        },
        authPending: (state) => {
            state.isPending = true;
        },
        authSuccess: (state, { payload }) => {
            state.isPending = false;
            state.userData = payload?.user;
            state.userToken = payload?.token;
            localStorage.setItem('userData', JSON.stringify(payload?.user))
            localStorage.setItem('userToken', payload?.token);
        },
        authFail: (state, { payload }) => {
            state.isPending = false;
            state.error = payload;
            toast.error(payload, {
                autoClose: 2000,
                theme: 'colored'
            });
        }
    }
})



export const authReducer = authSlice.reducer;

export const { authPending, authSuccess, authFail, setUserToken, setUserData } = authSlice.actions;
