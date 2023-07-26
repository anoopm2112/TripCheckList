import { createSlice } from "@reduxjs/toolkit";
import { createPlaces, deletePlaceById, fetchPlaces, updatePlaces } from "./api/TouristPlacesApi";

const initialState = {
    touristPlaces: [],
    status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
};

const placeSlice = createSlice({
    name: 'touristPlaces',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
        // Fetch All places
        .addCase(fetchPlaces.pending, (state, action) => {
            state.status = 'loading'
        })
        .addCase(fetchPlaces.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.touristPlaces = action.payload
        })
        .addCase(fetchPlaces.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        })
        // Add New place to list
        .addCase(createPlaces.fulfilled, (state, action) => {
            state.touristPlaces.push(action.payload)
        })
        // Update place
        .addCase(updatePlaces.fulfilled, (state, action) => {
            const { _id } = action.payload;
            const places = state.touristPlaces.filter(place => place.id !== _id);
            state.touristPlaces = [...places, action.payload];
        })
        // Delete Place By Id
        .addCase(deletePlaceById.fulfilled, (state, action) => {
            const places = state.touristPlaces.filter(place => place.id !== action.payload);
            state.touristPlaces = places;
        })
    }
});

export const selectAllTouristPlace = (state) => state?.touristPlaces;

export default placeSlice.reducer;