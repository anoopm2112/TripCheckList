import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import Config from 'react-native-config';
import {
    deleteAllCheckList, deleteCheckList, insertNewChecList, queryAllCheckList, queryHistoryCompletedCheckList, updateCheckList
} from "../../../database/allSchemas";
import {
    FETCH_CHECKLIST_LIST, DELETE_CHECKLIST_BY_ID, DELETE_ALL_CHECKLIST_LIST, ADD_NEW_CHECKLIST_LIST, UPDATE_CHECKLIST_LIST, GET_ALL_CHECKLIST_LIST_HISTORY
} from "../action";

const apiUrl = Config.API_BASE_URL;

export async function checkNetworkConnectivity() {
    const netInfoState = await NetInfo.fetch();
    const isConnected = netInfoState.isConnected;
    return isConnected;
}

export const fetchChecklists = createAsyncThunk(FETCH_CHECKLIST_LIST, async (userId) => {
    const isConnected = await checkNetworkConnectivity();

    if (!isConnected) {
        const response = await queryAllCheckList()
        return JSON.parse(JSON.stringify(response));
    } else {
        const apiResponse = await axios.get(`${apiUrl}${'/checklists'}/${userId?.userId}`);
        return apiResponse.data.checklist
    } 
});

export const addNewChecklists = createAsyncThunk(ADD_NEW_CHECKLIST_LIST, async (newChecklist) => {
    const isConnected = await checkNetworkConnectivity();

    if (!isConnected) {
        const response = await insertNewChecList(newChecklist);
        return JSON.parse(JSON.stringify(response));
    } else {
        const apiResponse = await axios.post(`${apiUrl}${'/checklists'}`, newChecklist);
        await deleteCheckList(newChecklist.id);
        return apiResponse.data;
    }
});

export const updateChecklist = createAsyncThunk(UPDATE_CHECKLIST_LIST, async (updateChecklistdata) => {
    const isConnected = await checkNetworkConnectivity();

    if (!isConnected) {
        const response = await updateCheckList(updateChecklistdata);
        return JSON.parse(JSON.stringify(response));
    } else {
        const apiResponse = await axios.put(`${apiUrl}${`/checklists/${updateChecklistdata.checklistId}`}`, updateChecklistdata);
        return apiResponse.data;
    }

});

export const deleteChecklistById = createAsyncThunk(DELETE_CHECKLIST_BY_ID, async (initialPost) => {
    const { id, checklistId } = initialPost;
    const isConnected = await checkNetworkConnectivity();

    if (!isConnected) {
        await deleteCheckList(id)
        return id;
    } else {
        const apiResponse = await axios.delete(`${apiUrl}${`/checklists/${checklistId}`}`);
        return apiResponse.data
    }
});

export const deleteAllChecklist = createAsyncThunk(DELETE_ALL_CHECKLIST_LIST, async () => {
    const isConnected = await checkNetworkConnectivity();

    if (!isConnected) {
        await deleteAllCheckList()
        return [];
    } else {
        await axios.delete(`${apiUrl}/checklists`);
        return [];
    }
});

export const getAllChecklistHistory = createAsyncThunk(GET_ALL_CHECKLIST_LIST_HISTORY, async () => {
    const isConnected = await checkNetworkConnectivity();

    if (!isConnected) {
        const response = await queryHistoryCompletedCheckList();
        return JSON.parse(JSON.stringify(response));
    } else {
        const apiResponse = await axios.get(`${apiUrl}${'/checklistHistory'}`);
        return apiResponse.data.checklist
    } 
});
