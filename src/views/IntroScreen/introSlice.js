import { createSlice } from "@reduxjs/toolkit";
import { registerNewUserIntro } from "./api/IntroScreenAPI";

const initialState = {
    UserData: [],
    status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
};

const introSlice = createSlice({
    name: 'introduction',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            // Register User
            .addCase(registerNewUserIntro.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(registerNewUserIntro.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.UserData.push(action.payload);
            })
            .addCase(registerNewUserIntro.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export const selectAllIntro = (state) => state?.intro;

export default introSlice.reducer;