import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import Config from 'react-native-config';
import { CREATE_PLACES, DELETE_PLACES, FETCH_PLACES, UPDATE_PLACES } from "../action";

const apiUrl = Config.API_BASE_URL;

export const fetchPlaces = createAsyncThunk(FETCH_PLACES, async (district) => {
    const apiResponse = await axios.get(`${apiUrl}${'/places'}/${district}`);
    return apiResponse.data;
});

export const createPlaces = createAsyncThunk(CREATE_PLACES, async (placedata) => {
    const apiResponse = await axios.post(`${apiUrl}${`/places`}`, placedata);
    return apiResponse.data;
});

export const updatePlaces = createAsyncThunk(UPDATE_PLACES, async (updatePlacedata) => {
    const apiResponse = await axios.put(`${apiUrl}${`/places/${updatePlacedata.id}`}`, updatePlacedata);
    return apiResponse.data;
});

export const deletePlaceById = createAsyncThunk(DELETE_PLACES, async (initialPost) => {
    const { id } = initialPost;
    const apiResponse = await axios.delete(`${apiUrl}${`/places/${id}`}`);
    return apiResponse.data;
});