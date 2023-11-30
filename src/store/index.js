import {configureStore, createSlice} from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth', initialState: {
        isAuthenticated: false, user: null, token: localStorage.getItem('token') || null,
    }, reducers: {
        login(state, action) {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem('token', action.payload.token);
        }, logout(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
        }, registerSuccess(state, action) {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem('token', action.payload.token);
        },
    },
});
export const authActions = authSlice.actions;

const store = configureStore({
    reducer: {auth: authSlice.reducer},
});

export default store;
