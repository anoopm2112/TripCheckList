import React from 'react';
import { View } from 'react-native';
import Lottie from 'lottie-react-native';
import AssetIconsPack from '../assets/IconProvide';
import { convertHeight } from '../common/utils/dimentionUtils';

const AppLoader = () => {
    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Lottie source={AssetIconsPack.icons.app_loader} loop autoPlay style={{ height: convertHeight(70) }} />
        </View>
    );
};

export default AppLoader;
