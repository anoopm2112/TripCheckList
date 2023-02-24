import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isDarkMode: false //'light' | 'dark'
}

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        toggleDarkMode(state) {
            state.isDarkMode = !state.isDarkMode;
        },
    }
})

export const { toggleDarkMode }  = settingsSlice.actions
export default settingsSlice.reducer