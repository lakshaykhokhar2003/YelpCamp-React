import {createSlice} from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name: 'message', initialState: {
        success: false, error: false, message: null,
    }, reducers: {
        success(state, action) {
            state.success = true;
            state.error = false;
            state.message = action.payload;
        }, error(state, action) {
            state.success = false;
            state.error = true;
            state.message = action.payload;
        }, clear(state) {
            state.success = false;
            state.error = false;
            state.message = null;
        }
    },
});
export const msgActions = messageSlice.actions;

export default messageSlice.reducer;