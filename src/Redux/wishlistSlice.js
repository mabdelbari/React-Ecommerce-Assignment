import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";


const initialState = {
    isPending: false,
    numOfWishItems: localStorage.getItem('numOfWishItems') || 0,
    wishData: null,
    wishAdded: [],
    error: null,
}

const successToastSettings = {
    autoClose: 2000,
    position: 'top-center',
    style: {
        textAlign: 'center'
    }
}
const errorToastSettings = {
    autoClose: 2000,
    theme: 'colored'
}

export const addProductToWishlist = createAsyncThunk('wishlist/addProductToWishlist',
    async ({ id, userToken }, { rejectWithValue }) => {

        const headers = {
            token: userToken
        }

        try {
            const { data } = await axios.post('https://ecommerce.routemisr.com/api/v1/wishlist', {
                productId: id
            }, {
                headers
            })
            return data;
        } catch (error) {
            if (error.response) return rejectWithValue(error.response.data.message)
            else if (error.request) return rejectWithValue(error.request)
            else return rejectWithValue(error.message)
        }
    }
)

export const getLoggedUserWishlist = createAsyncThunk('wishlist/getLoggedUserWishlist',
    async (userToken, { rejectWithValue }) => {

        const headers = {
            token: userToken
        }
        try {
            const { data } = await axios.get('https://ecommerce.routemisr.com/api/v1/wishlist', {
                headers
            })
            return data;
        } catch (error) {
            if (error?.response) return rejectWithValue(error?.response.data.message)
            else if (error?.request) return rejectWithValue(error?.request)
            else return rejectWithValue(error?.message)
        }

    }
)

export const removeProductFromWishlist = createAsyncThunk('wishlist/removeProductFromWishlist',
    async ({ id, userToken }, { rejectWithValue }) => {

        const headers = {
            token: userToken
        }

        try {
            const { data } = await axios.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${id}`, {
                headers
            })
            return data;
        } catch (error) {
            if (error.response) return rejectWithValue(error.response.data.message)
            else if (error.request) return rejectWithValue(error.request)
            else return rejectWithValue(error.message)
        }
    }
)


const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        setNumOfWishItems: (state, { payload }) => {
            state.numOfWishItems = payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addProductToWishlist.pending, (state) => {
                state.isPending = true;
            })
            .addCase(addProductToWishlist.fulfilled, (state, { payload }) => {
                state.isPending = false;
                if (payload?.status === 'success') {
                    localStorage.setItem('numOfWishItems', payload?.data.length);
                    state.wishAdded = payload?.data;
                    state.numOfWishItems = payload?.data.length;
                    toast.success(payload?.message, successToastSettings);
                }

            })
            .addCase(addProductToWishlist.rejected, (state, { payload }) => {
                state.isPending = false;
                state.error = payload
                toast.error(payload, errorToastSettings);
            })
            .addCase(getLoggedUserWishlist.pending, (state) => {
                state.isPending = true;
            })
            .addCase(getLoggedUserWishlist.fulfilled, (state, { payload }) => {
                state.isPending = false;
                state.wishData = payload;
                state.wishAdded = [...payload?.data.map((item) => item._id)]
                state.error = null;
                localStorage.setItem('numOfWishItems', payload?.count);
                state.numOfWishItems = payload?.count;
            })
            .addCase(getLoggedUserWishlist.rejected, (state, { payload }) => {
                state.isPending = false;
                state.error = payload;
            })
            .addCase(removeProductFromWishlist.pending, (state) => {
                state.isPending = true;
            })
            .addCase(removeProductFromWishlist.fulfilled, (state, { payload }) => {
                state.isPending = false;
                if (payload?.status === 'success') {
                    localStorage.setItem('numOfWishItems', payload?.data.length);
                    state.wishAdded = payload?.data;
                    state.numOfWishItems = payload?.data.length;
                    toast.success(payload?.message, successToastSettings);
                }
            })
            .addCase(removeProductFromWishlist.rejected, (state, { payload }) => {
                state.isPending = false;
                state.error = payload;
                toast.error(payload, errorToastSettings);
            })
    }
})

export const wishlistReducer = wishlistSlice.reducer;

export const { setNumOfWishItems } = wishlistSlice.actions;