import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RootNavigation from './navigation/rootNavigation';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import SplashScreen from 'react-native-splash-screen';

export default function App() {

    const [auth, setAuth] = useState();

    useEffect(() => {
        async function fetchUserAuth() {
            var value = await AsyncStorage.getItem('userAuth');
            setAuth(value);
        }

        fetchUserAuth();

        SplashScreen.hide();
    }, [])

    return (
        <ApplicationProvider {...eva} theme={eva.light}>
            <SafeAreaProvider>
                <NavigationContainer>
                    <RootNavigation props={auth}/>
                </NavigationContainer>
            </SafeAreaProvider>
        </ApplicationProvider>
    );
}