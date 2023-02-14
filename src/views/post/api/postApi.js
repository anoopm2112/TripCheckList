import { createAsyncThunk } from "@reduxjs/toolkit";
import { deleteSplitWiseList, insertNewSplitWise, queryAllSplitWiseList, updateSplitWiseList } from "../../../database/allSchemas";
import { ADD_NEW_POST, DELETE_SPLITWISE_BY_ID, FETCH_POST, UPDATE_POST } from "../action";

export const fetchPosts = createAsyncThunk(FETCH_POST, async () => {
    const response = await queryAllSplitWiseList()
    return JSON.parse(JSON.stringify(response));
});

export const addNewPost = createAsyncThunk(ADD_NEW_POST, async (newSplitWise) => {
    const response = await insertNewSplitWise(newSplitWise);
    return JSON.parse(JSON.stringify(response));
});

export const updatePost = createAsyncThunk(UPDATE_POST, async (updateSplitWise) => {
    const response = await updateSplitWiseList(updateSplitWise);
    return JSON.parse(JSON.stringify(response));
});

export const deleteSpliWiseById = createAsyncThunk(DELETE_SPLITWISE_BY_ID, async (initialPost) => {
    const { id } = initialPost;
    await deleteSplitWiseList(id)
    return id;
});