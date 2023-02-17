import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    deleteAllCheckList, deleteCheckList, insertNewChecList, queryAllCheckList, updateCheckList
} from "../../../database/allSchemas";
import {
    FETCH_CHECKLIST_LIST, DELETE_CHECKLIST_BY_ID, DELETE_ALL_CHECKLIST_LIST, ADD_NEW_CHECKLIST_LIST, UPDATE_CHECKLIST_LIST
} from "../action";

export const fetchChecklists = createAsyncThunk(FETCH_CHECKLIST_LIST, async () => {
    const response = await queryAllCheckList()
    return JSON.parse(JSON.stringify(response));
});

export const addNewChecklists = createAsyncThunk(ADD_NEW_CHECKLIST_LIST, async (newChecklist) => {
    const response = await insertNewChecList(newChecklist);
    return JSON.parse(JSON.stringify(response));
});

export const updateChecklist = createAsyncThunk(UPDATE_CHECKLIST_LIST, async (updateChecklistdata) => {
    const response = await updateCheckList(updateChecklistdata);
    return JSON.parse(JSON.stringify(response));
});

export const deleteChecklistById = createAsyncThunk(DELETE_CHECKLIST_BY_ID, async (initialPost) => {
    const { id } = initialPost;
    await deleteCheckList(id)
    return id;
});

export const deleteAllChecklist = createAsyncThunk(DELETE_ALL_CHECKLIST_LIST, async () => {
    await deleteAllCheckList()
    return [];
});
