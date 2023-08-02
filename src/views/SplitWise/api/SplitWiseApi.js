import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import Config from 'react-native-config';
import {
    deleteAllSplitWiseList, deleteNoteList, deleteSplitWiseList, insertNewSplitWise,
    queryAllSplitWiseList, queryGetNoteList, updateSplitWiseList
} from "../../../database/allSchemas";
import {
    ADD_NEW_SPLITWISE_LIST, DELETE_ALL_SPLITWISE_LIST, DELETE_NOTE_BY_ID, DELETE_SPLITWISE_BY_ID,
    FETCH_NOTES_LIST, FETCH_SPLITWISE_LIST, UPDATE_SPLITWISE_LIST
} from "../action";
import { checkNetworkConnectivity } from "../../../common/utils/permissionUtils";

const apiUrl = Config.API_BASE_URL;

export const fetchSplitwises = createAsyncThunk(FETCH_SPLITWISE_LIST, async (userId) => {
    const isConnected = await checkNetworkConnectivity();

    if (!isConnected) {
        const response = await queryAllSplitWiseList()
        return JSON.parse(JSON.stringify(response));
    } else {
        const apiResponse = await axios.get(`${apiUrl}${'/splitwises'}/${userId?.userId}`);
        return apiResponse.data.splitwise;
    }
});

export const addNewSplitwises = createAsyncThunk(ADD_NEW_SPLITWISE_LIST, async (newSplitWise) => {
    const isConnected = await checkNetworkConnectivity();

    if (!isConnected) {
        const response = await insertNewSplitWise(newSplitWise);
        return JSON.parse(JSON.stringify(response));
    } else {
        const apiResponse = await axios.post(`${apiUrl}${'/splitwises'}`, newSplitWise);
        return apiResponse.data;
    }
});

export const updateSplitwise = createAsyncThunk(UPDATE_SPLITWISE_LIST, async (updateSplitWise) => {
    const isConnected = await checkNetworkConnectivity();
    
    if (!isConnected) {
        const response = await updateSplitWiseList(updateSplitWise);
        return JSON.parse(JSON.stringify(response));
    } else {
        const apiResponse = await axios.put(`${apiUrl}${`/splitwises/${updateSplitWise.splitwiseId}`}`, updateSplitWise);
        return apiResponse.data;
    }
});

export const deleteSplitWiseById = createAsyncThunk(DELETE_SPLITWISE_BY_ID, async (initialPost) => {
    const { id, splitwiseId } = initialPost;
    const isConnected = await checkNetworkConnectivity();

    if (!isConnected) {
        await deleteSplitWiseList(id);
        return id;
    } else {
        const apiResponse = await axios.delete(`${apiUrl}${`/splitwises/${splitwiseId}`}`);
        return apiResponse.data;
    }
});

export const deleteAllSplitWise = createAsyncThunk(DELETE_ALL_SPLITWISE_LIST, async () => {
    const isConnected = await checkNetworkConnectivity();

    if (!isConnected) {
        await deleteAllSplitWiseList()
        return [];
    } else {
        await axios.delete(`${apiUrl}/splitwises`);
        return [];
    }
});

// Notes API Calls
export const fetchNotes = createAsyncThunk(FETCH_NOTES_LIST, async (initialPost) => {
    const { id, noteId } = initialPost;
    const isConnected = await checkNetworkConnectivity();

    if (!isConnected) {
        const response = await queryGetNoteList(id);
        return JSON.parse(JSON.stringify(response));
    } else {
        const apiResponse = await axios.get(`${apiUrl}${`/splitwises/notes/${noteId}`}`);
        return apiResponse.data.splitwiseNote;
    }
});

export const deleteNoteById = createAsyncThunk(DELETE_NOTE_BY_ID, async (initialPost) => {
    const { id } = initialPost;
    await deleteNoteList(id)
    return id;
});

// ----------Delay Time--------------------------
// const response = await queryAllSplitWiseList()
// return new Promise(resolve => {
//     setTimeout(() => {
//         resolve(JSON.parse(JSON.stringify(response)));
//     }, 1500);
// });

