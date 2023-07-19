import React, { useEffect, useRef } from 'react';
import { Animated, Easing, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const UpDownIconAnimation = (props) => {
    const { colorValue, onPress, onPurpose } = props;
    const animationValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        animateIcon();
    }, []);

    const animateIcon = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animationValue, {
                    toValue: 1,
                    duration: 600,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(animationValue, {
                    toValue: 0,
                    duration: 600,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const iconStyle = {
        transform: [
            {
                translateY: animationValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 2], // Adjust the desired animation distance
                }),
            },
        ],
    };

    return (
        <TouchableOpacity onPress={() => {
            onPress(),
            animateIcon
        }}>
            <Animated.View style={iconStyle}>
                <MaterialIcons name={onPurpose ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={24} color={colorValue} />
            </Animated.View>
        </TouchableOpacity>
    );
};

export default UpDownIconAnimation;

