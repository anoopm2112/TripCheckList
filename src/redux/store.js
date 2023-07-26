import { configureStore, combineReducers } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
// reducers
import checklistReducer from '../views/CheckList/checklistSlice';
import splitwiseReducer from '../views/SplitWise/splitwiseSlice';
import settingsReducer from '../views/Settings/settingsSlice';
import postReducer from '../views/post/postSlice';
import introReducer from '../views/IntroScreen/introSlice';
import touristPlaceReducer from '../views/TouristPlaces/placeSlice';

const rootReducer = combineReducers({
    checklist: checklistReducer,
    splitwise: splitwiseReducer,
    settings: settingsReducer,
    post: postReducer,
    intro: introReducer,
    touristPlaces: touristPlaceReducer
})

export const store = configureStore({ reducer: rootReducer, middleware: [thunk] });