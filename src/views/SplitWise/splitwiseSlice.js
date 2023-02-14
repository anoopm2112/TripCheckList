import { createSlice } from "@reduxjs/toolkit";
import { 
    addNewSplitwises, deleteAllSplitWise, deleteNoteById, deleteSplitWiseById, fetchNotes, 
    fetchSplitwises, updateSplitwise 
} from "./api/SplitWiseApi";

const initialState = {
    splitwises: [],
    notes: [],
    status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
}

const splitwisesSlice = createSlice({
    name: 'splitwises',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            // Fetch All Splitwises
            .addCase(fetchSplitwises.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchSplitwises.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.splitwises = action.payload
            })
            .addCase(fetchSplitwises.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            // Add New Splitwise list
            .addCase(addNewSplitwises.fulfilled, (state, action) => {
                state.splitwises.push(action.payload)
            })
            // Update Splitwise List
            .addCase(updateSplitwise.fulfilled, (state, action) => {
                const { id } = action.payload;
                const splitwises = state.splitwises.filter(splitwise => splitwise.id !== id);
                state.splitwises = [...splitwises, action.payload];
            })
            // Delete Splitwise By Id
            .addCase(deleteSplitWiseById.fulfilled, (state, action) => {
                const splitwises = state.splitwises.filter(splitwise => splitwise.id !== action.payload);
                state.splitwises = splitwises;
            })
            // Delete All Splitwises
            .addCase(deleteAllSplitWise.fulfilled, (state, action) => {
                state.splitwises = action.payload;
            })
            // Fetch All Notes
            .addCase(fetchNotes.fulfilled, (state, action) => {
                state.notes = action.payload;
            })
            // Delete Note By Id
            .addCase(deleteNoteById.fulfilled, (state, action) => {
                const notes = state.notes.filter(note => note.id !== action.payload);
                state.notes = notes;
            }) 
    }
})

export const selectAllSplitwises = (state) => state?.splitwise;

export default splitwisesSlice.reducer