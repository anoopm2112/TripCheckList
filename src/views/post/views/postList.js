import React, { useEffect } from 'react';
import { View, Text, ScrollView, Button } from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from '@react-navigation/native';
import "react-native-get-random-values";
import { v4 as uuidv4 } from 'uuid';
// Custom Imports
import { selectAllPosts } from "../postSlice";
import { addNewPost, deleteSpliWiseById, fetchPosts, updatePost } from "../api/postApi";

const PostsList = () => {
    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    const { posts, status, error } = useSelector(selectAllPosts);

    useEffect(() => {
        if (isFocused) {
            dispatch(fetchPosts());
        }
    }, [isFocused, dispatch])
    if (status === 'loading') {
        return <Text style={{ color: 'black' }}>"Loading..."</Text>;
    } 
    
    if (status === 'failed') {
        return <Text style={{ color: 'black' }}>SSS{error}</Text>;
    }

    const newSplitWise = {
        id: uuidv4(),
        creationDate: new Date(),
        members: [],
        totalAmount: 258,
        splitWiseListItems: [],
        notes: []
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                {posts?.map((post, index) => {
                    const updateSplitWise = {
                        id: post.id,
                        creationDate: new Date(),
                        members: [],
                        totalAmount: 1 + index,
                        splitWiseListItems: [],
                        notes: [{ id: uuidv4(), note: 'READY ONE BY TWO', creationDate: new Date() }]
                    }
                    return (
                        <View style={{ padding: 10, borderWidth: 1, borderColor: 'red' }}>
                            <Button title='UPDATE' onPress={() => dispatch(updatePost(updateSplitWise))} />
                            <Text style={{ color: 'black' }}>{post.totalAmount}</Text>
                            <Text style={{ color: 'black' }}>{post.id}</Text>
                            <Text style={{ color: 'black' }}>{post.notes[0]?.note}</Text>
                            <Button title='DELETE' onPress={() => dispatch(deleteSpliWiseById({ id: post.id }))} />
                        </View>
                    )
                })}
            </ScrollView>
            <Button title='CREATE' onPress={() => dispatch(addNewPost(newSplitWise))} />
        </View>
    )
}
export default PostsList