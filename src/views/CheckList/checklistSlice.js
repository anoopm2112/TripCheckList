import { createSlice } from "@reduxjs/toolkit";
import {
    addNewChecklists, deleteAllChecklist, deleteChecklistById, fetchChecklists, getAllChecklistHistory, updateChecklist
} from "./api/ChecklistApi";

const initialState = {
    checklists: [],
    status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
}

const checklistsSlice = createSlice({
    name: 'checklists',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            // Fetch All Checklists
            .addCase(fetchChecklists.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchChecklists.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.checklists = action.payload
            })
            .addCase(fetchChecklists.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            // Add New Splitwise list
            .addCase(addNewChecklists.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(addNewChecklists.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.checklists.push(action.payload)
            })
            .addCase(addNewChecklists.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            // Update Splitwise List
            .addCase(updateChecklist.fulfilled, (state, action) => {
                const { id } = action.payload;
                const checklists = state.checklists.filter(checklist => checklist.id !== id);
                state.checklists = [...checklists, action.payload];
            })
            // Delete Splitwise By Id
            .addCase(deleteChecklistById.fulfilled, (state, action) => {
                const checklists = state.checklists.filter(checklist => checklist.id !== action.payload);
                state.checklists = checklists;
            })
            // Delete All Splitwises
            .addCase(deleteAllChecklist.fulfilled, (state, action) => {
                state.checklists = action.payload;
            })
            // Get Checklist History
            .addCase(getAllChecklistHistory.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(getAllChecklistHistory.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.checklists = action.payload
            })
            .addCase(getAllChecklistHistory.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
    }
})

export const selectAllChecklists = (state) => state?.checklist;

export default checklistsSlice.reducer