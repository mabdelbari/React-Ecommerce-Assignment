import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
    isPending: false,
    data: null,
    numOfItems: localStorage.getItem('numOfItems') || 0,
    error: null
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setNumOfItems: (state, { payload }) => {
            state.numOfItems = payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addProductToCart.pending, (state) => {
                state.isPending = true;

            })
            .addCase(addProductToCart.fulfilled, (state, { payload }) => {
                state.isPending = false;
                state.data = payload;
                if (payload.status === 'success') {
                    localStorage.setItem('numOfItems', payload.numOfCartItems);
                    state.numOfItems = payload.numOfCartItems;
                    toast.success(payload.message, {
                        autoClose: 2000,
                        position: 'top-center',
                        style: {
                            textAlign: 'center'
                        }
                    });
                }

            })
            .addCase(addProductToCart.rejected, (state, { payload }) => {
                state.isPending = false;
                state.error = payload
            })
            .addCase(getLoggedUserCart.pending, (state) => {
                state.isPending = true;
            })
            .addCase(getLoggedUserCart.fulfilled, (state, { payload }) => {
                state.isPending = false;
                state.data = payload;
                state.error = null;
                localStorage.setItem('numOfItems', payload?.numOfCartItems);
                state.numOfItems = payload?.numOfCartItems;
            })
            .addCase(getLoggedUserCart.rejected, (state, { payload }) => {
                state.isPending = false;
                state.numOfItems = 0;
                state.data = null;
                state.error = payload;
            })
            .addCase(deleteSpecificProduct.pending, (state) => {
                state.isPending = true;
            })
            .addCase(deleteSpecificProduct.fulfilled, (state, { payload }) => {
                state.isPending = false;
                state.data = payload;
                localStorage.setItem('numOfItems', payload.numOfCartItems);
                state.numOfItems = payload.numOfCartItems;
            })
            .addCase(deleteSpecificProduct.rejected, (state, { payload }) => {
                state.isPending = false;
                state.error = payload;
            })
            .addCase(updateProductQuantity.pending, (state) => {
                state.isPending = true;
            })
            .addCase(updateProductQuantity.fulfilled, (state, { payload }) => {
                state.isPending = false;
                state.data = payload;
            })
            .addCase(updateProductQuantity.rejected, (state, { payload }) => {
                state.isPending = false;
                state.error = payload;
            })
            .addCase(checkoutCart.pending, (state) => {
                state.isPending = true;
            })
            .addCase(checkoutCart.fulfilled, (state, { payload }) => {
                state.isPending = false;
                window.location.href = payload.session.url;
            })
            .addCase(checkoutCart.rejected, (state, { payload }) => {
                state.isPending = false;
                state.error = payload;
            })

    }
})

export const addProductToCart = createAsyncThunk('cart/addProductToCart',
    async ({ id, userToken }, { rejectWithValue }) => {
        const headers = {
            token: userToken
        }
        try {
            const { data } = await axios.post('https://ecommerce.routemisr.com/api/v1/cart', {
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

export const getLoggedUserCart = createAsyncThunk('cart/getLoggedUserCart',
    async (userToken, { rejectWithValue }) => {

        const headers = {
            token: userToken
        }
        try {
            const { data } = await axios.get('https://ecommerce.routemisr.com/api/v1/cart', {
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

export const deleteSpecificProduct = createAsyncThunk('cart/deleteSpecificProduct',
    async ({ id, userToken }, { rejectWithValue }) => {

        const headers = {
            token: userToken
        }

        try {
            const { data } = await axios.delete(`https://ecommerce.routemisr.com/api/v1/cart/${id}`, {
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

export const updateProductQuantity = createAsyncThunk('cart/updateProductQuantity',
    async ({ id, quantity, userToken }, { rejectWithValue }) => {
        const headers = {
            token: userToken
        }

        if (quantity > 0) {
            try {
                const { data } = await axios.put(`https://ecommerce.routemisr.com/api/v1/cart/${id}`, {
                    count: quantity
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

    }
)

export const checkoutCart = createAsyncThunk('cart/checkoutCart',
    async ({ values, cartId, url, userToken }, { rejectWithValue }) => {

        const headers = {
            token: userToken
        }

        try {
            const { data } = await axios.post(`https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${url}`,
                {
                    shippingAddress: values
                },
                {
                    headers
                })

            console.log(data);
            return data;
        } catch (error) {
            if (error?.response) return rejectWithValue(error?.response.data.message)
            else if (error?.request) return rejectWithValue(error?.request)
            else return rejectWithValue(error?.message)
        }
    }
)

export const cartReducer = cartSlice.reducer;
export const { setNumOfItems, setCartItems } = cartSlice.actions;