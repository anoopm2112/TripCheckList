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
            webClientId: '961469081993-6sf354d9chcl26v989hu9or625a7a5cf.apps.googleusercontent.com',
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