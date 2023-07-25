import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import Config from 'react-native-config';
import { REGISTER_NEW_USER } from "../actions";

const apiUrl = Config.API_BASE_URL;

export const registerNewUserIntro = createAsyncThunk(REGISTER_NEW_USER, async (newUser) => {
    const apiResponse = await axios.post(`${apiUrl}${'/register'}`, newUser);
    return apiResponse.data;
});
