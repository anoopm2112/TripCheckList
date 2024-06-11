import 'react-native-gesture-handler';
import './common/translation/LangTranslationManager';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigation from './navigation/rootNavigation';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import { Provider as AuthProvider } from './context/AuthContext';

export default function App() {

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '1010111969332-322g83d0imq8ji2hns985jn736lmq03s.apps.googleusercontent.com',
        });
    }, []);

    return (
        <AuthProvider>
            <Provider store={store}>
                <ApplicationProvider {...eva} theme={eva.light}>
                    <SafeAreaProvider>
                        <RootNavigation />
                    </SafeAreaProvider>
                </ApplicationProvider>
            </Provider>
        </AuthProvider>
    );
}