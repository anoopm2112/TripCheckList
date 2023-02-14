import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    deleteAllSplitWiseList, deleteNoteList, deleteSplitWiseList, insertNewSplitWise,
    queryAllSplitWiseList, queryGetNoteList, updateSplitWiseList
} from "../../../database/allSchemas";
import {
    ADD_NEW_SPLITWISE_LIST, DELETE_ALL_SPLITWISE_LIST, DELETE_NOTE_BY_ID, DELETE_SPLITWISE_BY_ID,
    FETCH_NOTES_LIST, FETCH_SPLITWISE_LIST, UPDATE_SPLITWISE_LIST
} from "../action";

export const fetchSplitwises = createAsyncThunk(FETCH_SPLITWISE_LIST, async () => {
    const response = await queryAllSplitWiseList()
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(JSON.parse(JSON.stringify(response)));
        }, 1500);
    });
});

export const addNewSplitwises = createAsyncThunk(ADD_NEW_SPLITWISE_LIST, async (newSplitWise) => {
    const response = await insertNewSplitWise(newSplitWise);
    return JSON.parse(JSON.stringify(response));
});

export const updateSplitwise = createAsyncThunk(UPDATE_SPLITWISE_LIST, async (updateSplitWise) => {
    const response = await updateSplitWiseList(updateSplitWise);
    return JSON.parse(JSON.stringify(response));
});

export const deleteSplitWiseById = createAsyncThunk(DELETE_SPLITWISE_BY_ID, async (initialPost) => {
    const { id } = initialPost;
    await deleteSplitWiseList(id)
    return id;
});

export const deleteAllSplitWise = createAsyncThunk(DELETE_ALL_SPLITWISE_LIST, async () => {
    await deleteAllSplitWiseList()
    return [];
});

// Notes API Calls
export const fetchNotes = createAsyncThunk(FETCH_NOTES_LIST, async (initialPost) => {
    const { id } = initialPost;
    const response = await queryGetNoteList(id)
    return JSON.parse(JSON.stringify(response));
});

export const deleteNoteById = createAsyncThunk(DELETE_NOTE_BY_ID, async (initialPost) => {
    const { id } = initialPost;
    await deleteNoteList(id)
    return id;
});

