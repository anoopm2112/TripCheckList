import React from 'react';
import { View, StyleSheet, Modal, Text, TouchableOpacity, StatusBar, Dimensions, Animated, Image } from 'react-native';
import { useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useTranslation } from "react-i18next";
// Custom Imports
import { convertHeight } from '../../../common/utils/dimentionUtils';
import { darkModeColor } from '../../../common/utils/arrayObjectUtils';
import Colors from '../../../common/Colors';
import AssetIconsPack from '../../../assets/IconProvide';

const { width } = Dimensions.get('window');
const AnimatedAntDesign = Animated.createAnimatedComponent(AntDesign);
const DURATION = 1000;
const TEXT_DURATION = DURATION * 0.8;

const quotes = [
    {
        quote: 'Quotes:quote_1',
        data: 'Thank you for using our mobile application. This Privacy Policy explains how we collect, use, and protect your personal information while you use our app. We are committed to safeguarding your privacy and ensuring the security of your personal data. Please read this Privacy Policy carefully to understand our practices regarding your information.',
        author: 'Dashboard:app_name',
        icon: AssetIconsPack.icons.checklist_image_about
    },
    {
        quote: 'Quotes:quote_2',
        data: `Collection of Information: \n 
        We collect limited personal information to provide a personalized experience within our app. The types of information we collect include: \n
        • Name: We collect your name to personalize your experience within the app, such as displaying it in the checklist module and other relevant sections. \n
        • Images: We may capture images using your device's camera for the checklist module. These images are solely for the purpose of enhancing your checklist items and are not stored or transmitted outside of your device.`,
        author: 'Dashboard:app_name',
        icon: AssetIconsPack.icons.checklist_image_about
    },
    {
        quote: 'Quotes:quote_3',
        author: 'Dashboard:app_name',
        data: `Use of Information:\nThe personal information we collect is used for the following purposes: \n 
        • Personalization:\nYour name is used to personalize your experience within the app, such as displaying it on the Tourist module and other relevant sections. \n 
        • Checklist Functionality: The images captured by your device's camera are used to enhance the functionality of the checklist module, allowing you to add visual references to your checklist items. \n 
        • Offline Usage: Our app operates fully offline, meaning that no personal information or data is transmitted or stored on any external servers. All data, including checklists and captured images, is stored locally on your device.`,
        icon: AssetIconsPack.icons.money_splitter_aboutus
    },
    {
        quote: "Quotes:quote_4",
        data: `Google Maps Integration: 
        
        For capturing location information and displaying tourist spots. Please note that we do not collect or store any location data from your device. Any location permissions requested by the app are solely for the purpose of displaying maps and providing relevant information within the app.`,
        author: 'Dashboard:app_name',
        icon: AssetIconsPack.icons.money_splitter_aboutus
    },
    {
        quote: "Quotes:quote_5",
        data: `Data Security: \n
        We take appropriate measures to protect your personal information from unauthorized access, disclosure, or alteration. We use industry-standard security practices to ensure the security of your data within the app.
        
        Third-Party Services: \n
        Our app may integrate with third-party services, such as Google Maps, to provide specific functionality. These services may have their own privacy policies and terms of service. We encourage you to review the privacy practices of these third-party services before using them.
        
        Updates to the Privacy Policy: \n
        We reserve the right to update or modify this Privacy Policy at any time. Any changes made to the Privacy Policy will be reflected in the updated version, and we will notify you of any significant changes via app notifications or other means.`,
        author: 'Dashboard:app_name',
        icon: AssetIconsPack.icons.tourist_spot_about
    },
    {
        quote: 'Quotes:quote_6',
        data: `Contact Us:
        If you have any questions, concerns, or requests regarding this Privacy Policy or the handling of your personal information, please contact us at tripchecklistapp@gmail.com.
        
        By using our app, you acknowledge that you have read and understood this Privacy Policy and agree to the collection and use of your personal information as described herein.
        
        Last updated: 04-08-2023`,
        author: 'Dashboard:app_name',
        icon: AssetIconsPack.icons.tourist_spot_about
    },
];

const Circle = ({ onPress, index, quotes, animatedValue, animatedValue2 }) => {
    const { initialBgColor, nextBgColor, bgColor } = colors[index];
    const inputRange = [0, 0.001, 0.5, 0.501, 1];
    const backgroundColor = animatedValue2.interpolate({
        inputRange,
        outputRange: [
            initialBgColor,
            initialBgColor,
            initialBgColor,
            bgColor,
            bgColor,
        ],
    });
    const dotBgColor = animatedValue2.interpolate({
        inputRange: [0, 0.001, 0.5, 0.501, 0.9, 1],
        outputRange: [
            bgColor,
            bgColor,
            bgColor,
            initialBgColor,
            initialBgColor,
            nextBgColor,
        ],
    });

    return (
        <Animated.View
            style={[StyleSheet.absoluteFillObject, styles.container, { backgroundColor }]}>
            <StatusBar backgroundColor={bgColor} barStyle={'dark-content'} />
            <Animated.View
                style={[
                    styles.circle,
                    {
                        backgroundColor: dotBgColor,
                        transform: [
                            { perspective: 200 },
                            {
                                rotateY: animatedValue2.interpolate({
                                    inputRange: [0, 0.5, 1],
                                    outputRange: ['0deg', '-90deg', '-180deg'],
                                }),
                            },

                            {
                                scale: animatedValue2.interpolate({
                                    inputRange: [0, 0.5, 1],
                                    outputRange: [1, 6, 1],
                                }),
                            },

                            {
                                translateX: animatedValue2.interpolate({
                                    inputRange: [0, 0.5, 1],
                                    outputRange: [0, 0.5, 0]
                                }),
                            },
                        ],
                    },
                ]}
            >
                <TouchableOpacity onPress={onPress}>
                    <Animated.View
                        style={[
                            styles.button,
                            {
                                transform: [
                                    {
                                        scale: animatedValue.interpolate({
                                            inputRange: [0, 0.05, 0.5, 1],
                                            outputRange: [1, 0, 0, 1],
                                            // extrapolate: "clamp"
                                        }),
                                    },
                                    {
                                        rotateY: animatedValue.interpolate({
                                            inputRange: [0, 0.5, 0.9, 1],
                                            outputRange: ['0deg', '180deg', '180deg', '180deg'],
                                        }),
                                    },
                                ],
                                opacity: animatedValue.interpolate({
                                    inputRange: [0, 0.05, 0.9, 1],
                                    outputRange: [1, 0, 0, 1],
                                }),
                            },
                        ]}
                    >
                        <AnimatedAntDesign name='arrowright' size={28} color={'white'} />
                    </Animated.View>
                </TouchableOpacity>
            </Animated.View>
        </Animated.View>
    );
};

const colors = [
    {
        initialBgColor: 'goldenrod',
        bgColor: '#222',
        nextBgColor: '#222',
    },
    {
        initialBgColor: 'goldenrod',
        bgColor: '#222',
        nextBgColor: 'yellowgreen',
    },
    {
        initialBgColor: '#222',
        bgColor: 'yellowgreen',
        nextBgColor: 'midnightblue',
    },
    {
        initialBgColor: 'yellowgreen',
        bgColor: 'midnightblue',
        nextBgColor: 'turquoise',
    },
    {
        initialBgColor: 'midnightblue',
        bgColor: 'turquoise',
        nextBgColor: 'goldenrod',
    },
    {
        initialBgColor: 'turquoise',
        bgColor: 'goldenrod',
        nextBgColor: '#222',
    },
];

const PrivacyPolicyModal = ({ visible, onClose }) => {
    const isDarkMode = useSelector(state => state?.settings?.isDarkMode);
    const { backgroundFlipColor, textColor } = darkModeColor(isDarkMode);

    const animatedValue = React.useRef(new Animated.Value(0)).current;
    const animatedValue2 = React.useRef(new Animated.Value(0)).current;
    const sliderAnimatedValue = React.useRef(new Animated.Value(0)).current;
    const inputRange = [...Array(quotes.length).keys()];
    const [index, setIndex] = React.useState(0);
    const { t } = useTranslation();

    const animate = (i) => Animated.parallel([
        Animated.timing(sliderAnimatedValue, {
            toValue: i,
            duration: TEXT_DURATION,
            useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
            toValue: 1,
            duration: DURATION,
            useNativeDriver: true,
        }),
        Animated.timing(animatedValue2, {
            toValue: 1,
            duration: DURATION,
            useNativeDriver: false,
        }),
    ]);

    const onPress = () => {
        animatedValue.setValue(0);
        animatedValue2.setValue(0);
        animate((index + 1) % colors.length).start();
        setIndex((index + 1) % colors.length);
    };

    return (
        <Modal animationType="slide" transparent={true} visible={visible}>
            <View style={{ flex: 1, justifyContent: 'flex-start', paddingTop: 100 }}>
                <Circle
                    index={index}
                    onPress={onPress}
                    quotes={quotes}
                    animatedValue={animatedValue}
                    animatedValue2={animatedValue2}
                />
                <TouchableOpacity style={styles.closeBtnContainer} onPress={() => onClose()}>
                    <AntDesign name="close" size={25} color={Colors.primary} />
                </TouchableOpacity>
                <Animated.View
                    style={{
                        flexDirection: 'row',
                        transform: [
                            {
                                translateX: sliderAnimatedValue.interpolate({
                                    inputRange,
                                    outputRange: quotes.map((_, i) => -i * width * 2),
                                }),
                            },
                        ],
                        opacity: sliderAnimatedValue.interpolate({
                            inputRange: [...Array(quotes.length * 2 + 1).keys()].map(
                                (i) => i / 2
                            ),
                            outputRange: [...Array(quotes.length * 2 + 1).keys()].map((i) =>
                                i % 2 === 0 ? 1 : 0
                            ),
                        }),
                    }}
                >
                    {quotes.slice(0, colors.length).map(({ quote, data, author, icon }, i) => {
                        return (
                            <View style={{ paddingRight: width, width: width * 2 }} key={i}>
                                {/* <Image source={icon} style={styles.posterImage} /> */}
                                <Text style={[styles.paragraph, { color: colors[i].nextBgColor === '#222' ? '#FFF' : colors[i].nextBgColor }]}>{data}</Text>
                                <Text
                                    style={[
                                        styles.paragraph,
                                        {
                                            color: colors[i].nextBgColor === '#222' ? '#FFF' : colors[i].nextBgColor,
                                            fontSize: 10,
                                            fontWeight: 'normal',
                                            textAlign: 'right',
                                            opacity: 0.8,
                                        },
                                    ]}
                                >
                                    ______ {t(author)}
                                </Text>
                            </View>
                        );
                    })}
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    Maincontainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingTop: 7,
        padding: 8,
        paddingBottom: 50,
    },
    paragraph: {
        margin: 12,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'Menlo',
        color: 'white',
        textTransform: 'uppercase'
    },
    button: {
        height: 100,
        width: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circle: {
        backgroundColor: 'turquoise',
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    closeBtnContainer: {
        position: 'absolute',
        top: 20,
        right: 20,
        // height: 30, width: 30, backgroundColor: Colors.primary, borderRadius: 30,
        // justifyContent: 'center', alignItems: 'center'
    },
    posterImage: {
        width: convertHeight(150),
        height: convertHeight(150),
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    }
});

export default PrivacyPolicyModal;
