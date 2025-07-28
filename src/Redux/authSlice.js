import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: "auth",
    initialState: {
        login: {
            currentUser: null,
            isFetching: false,
            error: false,
            errorMessage: null,
        },
        register: {
            isFetching: false,
            error: false,
            success: false,
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
            state.login.error = false;
            state.login.errorMessage = null;
        },
        loginSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
            state.login.error = false;
            state.login.errorMessage = null;

        },
        loginFail: (state, action) => {
            state.login.isFetching = false;
            state.login.error = true;
            state.login.errorMessage = action.payload || 'Login failed';
        },
        registerStart: (state) => {
            state.register.isFetching = true;
            state.register.error = false;
            state.register.success = false;
        },
        registerSuccess: (state) => {
            state.register.isFetching = false;
            state.register.error = false;
            state.register.success = true;

        },
        registerFail: (state) => {
            state.register.isFetching = false;
            state.register.error = true;
            state.register.success = false;
        },

        logOutSuccess: (state) => {
            state.login.currentUser = null;
            state.login.isFetching = false;
            state.login.error = false;
            state.login.errorMessage = null;
        },

        logOutFail: (state, action) => {
            state.login.isFetching = false;
            state.login.error = true;
            state.login.errorMessage = action.payload || 'Logout failed';
        },

        logOutStart: (state) => {
            state.login.isFetching = true;
            state.login.error = false;
            state.login.errorMessage = null;
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
