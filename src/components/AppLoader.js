import React, { useState, useEffect } from 'react';
import { View, Animated } from 'react-native';
import AssetIconsPack from '../assets/IconProvide';
import { convertHeight } from '../common/utils/dimentionUtils';

const AppLoader = () => {
    const [rotateValue] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotateValue, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const rotate = rotateValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Animated.Image
                source={AssetIconsPack.icons.app_logo_side_image}
                style={{ width: convertHeight(50), height: convertHeight(50), transform: [{ rotate }] }} />
        </View>
    );
};

export default AppLoader;
