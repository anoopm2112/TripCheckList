import { configureStore, combineReducers } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
// reducers
import splitwiseReducer from '../views/SplitWise/splitwiseSlice';
import postReducer from '../views/post/postSlice';

const rootReducer = combineReducers({
    splitwise: splitwiseReducer,
    post: postReducer,
})

export const store = configureStore({ reducer: rootReducer, middleware: [thunk] });