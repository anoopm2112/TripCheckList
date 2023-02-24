import { configureStore, combineReducers } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
// reducers
import checklistReducer from '../views/CheckList/checklistSlice';
import splitwiseReducer from '../views/SplitWise/splitwiseSlice';
import settingsReducer from '../views/Settings/settingsSlice';
import postReducer from '../views/post/postSlice';

const rootReducer = combineReducers({
    checklist: checklistReducer,
    splitwise: splitwiseReducer,
    settings: settingsReducer,
    post: postReducer,
})

export const store = configureStore({ reducer: rootReducer, middleware: [thunk] });