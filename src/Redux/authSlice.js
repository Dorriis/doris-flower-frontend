import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: "auth",
    initialState: {
        login: {
            currentUser: null,
            isFetching: false,
            error: false,
        },
        register: {
            isFetching: false,
            error: false,
            succsess: false,
        },
        cart: {
            products: [],
            quantity: 0,
            total: 0,
        }


    },
    reducers: {
        loginStart: (state) => {
            state.login.isFetching = true;
        },
        loginSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
            state.login.error = false;

        },
        loginFail: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },
        registerStart: (state) => {
            state.register.isFetching = true;
        },
        registerSuccess: (state) => {
            state.register.isFetching = false;
            state.register.error = false;
            state.register.succsess = true;

        },
        registerFail: (state) => {
            state.register.isFetching = false;
            state.register.error = true;
            state.register.succsess = false;
        },

        logOutSuccess: (state) => {
            state.login.currentUser = null;
            state.login.isFetching = false;
            state.login.error = false;
        },

        logOutFail: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },

        logOutStart: (state) => {
            state.login.isFetching = true;
        },
        clearCart: (state) => {
            state.cart.products = [];
            state.cart.quantity = 0;
            state.cart.total = 0;
        }
    }


});


export const { loginStart, loginFail, loginSuccess, registerStart, registerFail, registerSuccess, logOutFail, logOutStart, logOutSuccess, clearCart } = authSlice.actions;
export default authSlice.reducer;  
