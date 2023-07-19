import 'react-native-gesture-handler';
import './common/translation/LangTranslationManager';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigation from './navigation/rootNavigation';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import { Provider as AuthProvider } from './context/AuthContext';

export default function App() {
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