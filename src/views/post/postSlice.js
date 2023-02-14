import { createSlice } from "@reduxjs/toolkit";
import { addNewPost, deleteSpliWiseById, fetchPosts, updatePost } from "./api/postApi";

const initialState = {
    posts: [],
    status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
}

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.posts = action.payload

            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            // Add New list
            .addCase(addNewPost.fulfilled, (state, action) => {
                state.posts.push(action.payload)
            })
            // Update List
            .addCase(updatePost.fulfilled, (state, action) => {
                // const posts = state.posts.filter(post => post.id !== action.payload.id);
                // state.posts = [...posts, action.payload];

                const { id } = action.payload;
                console.log(id);
                const posts = state.posts.filter(post => post.id !== id);
                state.posts = [...posts, action.payload];
            })
            // Delete By Id
            .addCase(deleteSpliWiseById.fulfilled, (state, action) => {
                const posts = state.posts.filter(post => post.id !== action.payload);
                state.posts = posts;
            })
    }
})

export const selectAllPosts = (state) => state?.post;

export default postsSlice.reducer