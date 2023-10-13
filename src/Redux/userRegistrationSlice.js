import { createSlice } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';

const initialState = {
    isPending: false,
    status: null,
    message: null
}
const userRegistrationSlice = createSlice({
    name: "userRegistration",
    initialState,
    reducers: {
        registerPending: (state) => {
            state.isPending = true;
        },
        registerSuccess: (state, { payload }) => {
            state.isPending = false;
            state.status = "success";
            state.message = payload;
            toast.success(state.message, {
                autoClose: 2000,
                theme: 'colored'
            });

        },
        registerFail: (state, { payload }) => {
            state.isPending = false;
            state.status = "fail";
            state.message = payload;
            toast.error(state.message, {
                autoClose: 2000,
                theme: 'colored'
            });
        }

    }
})

export const userRegistrationReducer = userRegistrationSlice.reducer;

export const { registerPending, registerSuccess, registerFail } = userRegistrationSlice.actions;