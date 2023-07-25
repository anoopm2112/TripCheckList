import React, { useEffect, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';
// Custom Imports
import { Context as AuthContext } from '../../../context/AuthContext';
import { ROUTE_KEYS } from '../../../navigation/constants';

export default function SplashDataScreen(props) {
    const { navigation } = props;
    const { signin } = useContext(AuthContext);

    useEffect(() => {
        async function fetchUserAuth() {
            var value = await AsyncStorage.getItem('userAuth');
            if (value !== null) {
                signin({ userToken: value?.userToken });
            } else {
                navigation.navigate(ROUTE_KEYS.WELCOME_SCREEN);
            }
        }
        fetchUserAuth();
        SplashScreen.hide();
    }, []);

    const styles = StyleSheet.create({
        mainContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#515452'
        }
    });
    return (
        <View style={styles.mainContainer} />
    );
}