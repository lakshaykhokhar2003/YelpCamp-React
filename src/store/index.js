import {configureStore} from '@reduxjs/toolkit';
import authReducer from "./auth.js";
import messageReducer from "./message.js";

const loadState = () => {
    try {
        const serializedState = localStorage.getItem('reduxState');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('reduxState', serializedState);
    } catch (err) {
        console.log("Error: ", err.message)
    }
};
const persistedState = loadState();

const store = configureStore({
    reducer: {auth: authReducer, msg: messageReducer}, preloadedState: persistedState,
});

store.subscribe(() => {
    saveState(store.getState());
});
export default store;
