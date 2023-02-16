import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Image, TouchableOpacity } from 'react-native';
// Custom Imports
import { convertHeight, convertWidth } from '../common/utils/dimentionUtils';
import AssetIconsPack from '../assets/IconProvide';
import Lottie from 'lottie-react-native';

export default FlipCard = (props) => {
    const { item } = props;
    const [isFlipped, setIsFlipped] = useState(false);
    const animatedValue = useRef(new Animated.Value(0)).current;

    const size = useRef(new Animated.Value(30)).current;
    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.timing(size, {
            toValue: 70,
            duration: 1000,
            useNativeDriver: false,
        }).start();
        Animated.timing(opacity, {
            toValue: 10,
            duration: 1000,
            useNativeDriver: false,
        }).start();
    }, [props]);

    const flipCard = () => {
        setIsFlipped(!isFlipped);

        Animated.timing(animatedValue, {
            toValue: isFlipped ? 0 : 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }

    const animatedStyle = {
        width: size,
        height: size,
        borderRadius: size.interpolate({
            inputRange: [50, 100],
            outputRange: [25, 50],
        }),
        opacity,
    };

    const frontInterpolate = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const backInterpolate = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '360deg'],
    });

    const frontAnimatedStyle = {
        transform: [{ rotateY: frontInterpolate }],
    };

    const backAnimatedStyle = {
        transform: [{ rotateY: backInterpolate }],
    };

    return (
        <TouchableOpacity activeOpacity={1} onPress={() => flipCard()}>
            <View style={Styles.card}>
                <Animated.View style={[Styles.cardFace, frontAnimatedStyle]}>
                    <Animated.View style={[Styles.circle, animatedStyle]}>
                        <Text style={Styles.text}>{item.counter}</Text>
                    </Animated.View>
                </Animated.View>
                <Animated.View style={[Styles.cardFace, Styles.cardBack, backAnimatedStyle]}>
                    {!item.image ?
                        <Lottie source={AssetIconsPack.icons.no_image_icon} autoPlay loop style={{ height: convertHeight(120) }} />
                        :
                        <Image style={Styles.thumbnail} source={{ uri: item.image }} />
                    }

                </Animated.View>
            </View>
        </TouchableOpacity>
    );
};

const Styles = StyleSheet.create({
    thumbnail: {
        height: convertHeight(130),
        width: convertWidth(160),
        borderRadius: 2
    },
    card: {
        width: convertWidth(160),
        height: convertHeight(130),
        backgroundColor: '#FFF',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backfaceVisibility: 'hidden',
    },
    cardFace: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backfaceVisibility: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardBack: {
        transform: [{ rotateY: '180deg' }],
    },
    circle: {
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#446073'
    },
    text: {
        color: '#446073',
        fontSize: 30,
        fontWeight: 'bold'
    },
});