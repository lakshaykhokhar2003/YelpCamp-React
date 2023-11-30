import {configureStore, createSlice} from '@reduxjs/toolkit';

const authReducer = createSlice({
    name: 'auth', initialState: {
        isAuthenticated: false, user: null, token: null, expirationTime: null,
    }, reducers: {
        logIn(state, action) {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.expirationTime = action.payload.expiryTime;
        }, logOut(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.expirationTime = null;
        },
    },
});

export const authActions = authReducer.actions;
const autoLogoutMiddleware = store => next => action => {
    if (action.type === 'auth/logIn' && action.payload.expiryTime) {
        const {expiryTime} = action.payload;

        const currentTime = new Date().getTime();
        const timeRemaining = expiryTime - currentTime;

        setTimeout(() => {
            store.dispatch(authActions.logOut());
        }, timeRemaining);
    }

    return next(action);
}

const store = configureStore({
    reducer: {auth: authReducer.reducer},
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(autoLogoutMiddleware),
});

export default store;

