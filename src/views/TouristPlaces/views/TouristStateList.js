import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, Animated, StatusBar, TouchableOpacity, Button } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation, withTranslation } from "react-i18next";
import data from '../../../common/data/MapDetails';
import AssetIconsPack from '../../../assets/IconProvide';
import { ROUTE_KEYS } from '../../../navigation/constants';

const { width, height } = Dimensions.get('window');
const LOGO_WIDTH = 220;
const LOGO_HEIGHT = 40;
const DOT_SIZE = 40;
const TICKER_HEIGHT = 30;
const CIRCLE_SIZE = width * 0.6;

const Circle = ({ scrollX }) => {
    return (
        <View style={[StyleSheet.absoluteFillObject, styles.circleContainer]}>
            {data.map(({ color }, index) => {
                const inputRange = [
                    (index - 0.55) * width,
                    index * width,
                    (index + 0.55) * width,
                ];
                const scale = scrollX.interpolate({
                    inputRange,
                    outputRange: [0, 1, 0],
                    extrapolate: 'clamp',
                });
                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0, 0.2, 0],
                });
                return (
                    <Animated.View
                        key={index}
                        style={[
                            styles.circle,
                            {
                                backgroundColor: color,
                                opacity,
                                transform: [{ scale }],
                            },
                        ]}
                    />
                );
            })}
        </View>
    );
};

const Ticker = ({ scrollX }) => {
    const { i18n } = useTranslation();
    const inputRange = [-width, 0, width];
    const translateY = scrollX.interpolate({
        inputRange,
        outputRange: [TICKER_HEIGHT, 0, -TICKER_HEIGHT],
    });
    return (
        <View style={styles.tickerContainer}>
            <Animated.View style={{ transform: [{ translateY }] }}>
                {data.map(({ type, type_kl, type_hi, type_ta }, index) => {
                    return (
                        <Text key={index} style={[(i18n.language === 'en' || i18n.language === 'hi') ? styles.tickerText : styles.tickerText_ta_ml]}>
                            {
                                i18n.language === 'en' ? type :
                                    i18n.language === 'ml' ? type_kl :
                                        i18n.language === 'hi' ? type_hi : type_ta
                            }
                        </Text>
                    );
                })}
            </Animated.View>
        </View>
    );
};

class Item extends Component {
    shouldComponentUpdate(nextProps) {
        // Perform custom comparison logic
        // Return true if the relevant props have changed, false otherwise
        return (
            this.props.index !== nextProps.index || this.props.scrollX !== nextProps.scrollX
        );
    }

    render() {
        const { 
            imageUri, index, scrollX, navigation, i18n,
            heading, heading_kl, heading_hi, heading_ta,
            description, description_kl, description_hi, description_ta, 
            
        } = this.props;
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
        const inputRangeOpacity = [(index - 0.3) * width, index * width, (index + 0.3) * width];
        const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0, 1, 0],
        });
        const translateXHeading = scrollX.interpolate({
            inputRange,
            outputRange: [width * 0.1, 0, -width * 0.1],
        });
        const translateXDescription = scrollX.interpolate({
            inputRange,
            outputRange: [width * 0.7, 0, -width * 0.7],
        });
        const opacity = scrollX.interpolate({
            inputRange: inputRangeOpacity,
            outputRange: [0, 1, 0],
        });

        return (
            <View style={styles.itemStyle}>
                <Animated.Image source={imageUri} style={[styles.imageStyle, { transform: [{ scale }] }]} />
                <View style={styles.textContainer}>
                    <Animated.Text style={[styles.heading, { opacity, transform: [{ translateX: translateXHeading }] }]}>
                        {/* {heading} */}
                        {
                            i18n.language === 'en' ? heading :
                                i18n.language === 'ml' ? heading_kl :
                                    i18n.language === 'hi' ? heading_hi : heading_ta
                        }
                    </Animated.Text>
                    <Animated.Text style={[styles.description, { opacity, transform: [{ translateX: translateXDescription }] }]}>
                        {/* {description} */}
                        {
                            i18n.language === 'en' ? description :
                                i18n.language === 'ml' ? description_kl :
                                    i18n.language === 'hi' ? description_hi : description_ta
                        }
                    </Animated.Text>

                    <Animated.View
                        style={[styles.navBtn, {
                            opacity,
                            transform: [{ translateX: translateXDescription }],
                            backgroundColor: index === 0 ? '#305aff' : '#818182',
                        }]}>
                        <TouchableOpacity
                            onPress={() => {
                                if (index === 0) {
                                    navigation.navigate(ROUTE_KEYS.TOURIST_PLACE);
                                }
                            }}>
                            <FontAwesome5 name={index === 0 ? 'directions' : 'lock'} size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </View>
        );
    }
}

const Pagination = ({ scrollX }) => {
    const inputRange = [-width, 0, width];
    const translateX = scrollX.interpolate({
        inputRange,
        outputRange: [-DOT_SIZE, 0, DOT_SIZE],
    });
    return (
        <View style={[styles.pagination]}>
            <Animated.View
                style={[
                    styles.paginationIndicator,
                    {
                        position: 'absolute',
                        // backgroundColor: 'red',
                        transform: [{ translateX }],
                    },
                ]}
            />
            {data.map((item) => {
                return (
                    <View key={item.key} style={styles.paginationDotContainer}>
                        <View style={[styles.paginationDot, { backgroundColor: item.color }]} />
                    </View>
                );
            })}
        </View>
    );
};

export default function App(props) {
    const { navigation } = props;
    const flatListRef = React.useRef(null);
    const scrollX = React.useRef(new Animated.Value(0)).current;

    const scrollToFirstItem = () => {
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({ index: 0, animated: true });
        }
    };

    const scrollToLastItem = () => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    };

    const ItemWithTranslation = withTranslation()(Item);

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={'#FFF'} barStyle={'dark-content'} />
            <Circle scrollX={scrollX} />
            <Animated.FlatList
                ref={flatListRef}
                keyExtractor={(item) => item.key}
                data={data}
                renderItem={({ item, index }) => (
                    <ItemWithTranslation {...item} index={index} scrollX={scrollX} navigation={navigation} />
                )}
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                horizontal
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
            />
            {/* <Button title="Scroll to Last Item" onPress={scrollToLastItem} /> */}
            <Image style={styles.logo} source={AssetIconsPack.icons.app_logo_side_image} />
            <TouchableOpacity onPress={() => scrollToFirstItem()}
                style={[styles.fastForward, { backgroundColor: 'red', left: 20, bottom: 240 }]}>
                <MaterialCommunityIcons name="rewind-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => scrollToLastItem()}
                style={[styles.fastForward, { backgroundColor: 'green', left: 80, bottom: 240 }]}>
                <MaterialCommunityIcons name="fast-forward-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            {/* <Pagination scrollX={scrollX} /> */}
            <Ticker scrollX={scrollX} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    itemStyle: {
        width,
        height,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageStyle: {
        width: width * 0.75,
        height: width * 0.75,
        resizeMode: 'contain',
        flex: 1,
    },
    textContainer: {
        alignItems: 'flex-start',
        alignSelf: 'flex-end',
        flex: 0.5,
    },
    heading: {
        color: '#444',
        textTransform: 'uppercase',
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: 2,
        marginBottom: 5,
        width: 280
    },
    description: {
        color: '#ccc',
        fontWeight: '600',
        textAlign: 'left',
        width: width * 0.80,
        paddingRight: 2,
        marginRight: 10,
        fontSize: 16,
        lineHeight: 16 * 1.5,
    },
    logo: {
        opacity: 0.9,
        height: LOGO_HEIGHT,
        width: LOGO_WIDTH,
        resizeMode: 'contain',
        position: 'absolute',
        left: 10,
        bottom: 10,
        transform: [
            { translateX: -LOGO_WIDTH / 2 },
            { translateY: -LOGO_HEIGHT / 2 },
            { rotateZ: '-90deg' },
            { translateX: LOGO_WIDTH / 2 },
            { translateY: LOGO_HEIGHT / 2 },
        ],
    },
    navBtn: {
        opacity: 0.9,
        resizeMode: 'contain',
        position: 'absolute',
        right: 25,
        bottom: 295,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        transform: [
            { translateX: -LOGO_WIDTH / 2 },
            { translateY: -LOGO_HEIGHT / 2 },
            { translateX: LOGO_WIDTH / 2 },
            { translateY: LOGO_HEIGHT / 2 },
        ],
    },
    fastForward: {
        opacity: 0.9,
        resizeMode: 'contain',
        position: 'absolute',
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    pagination: {
        position: 'absolute',
        right: 20,
        bottom: 40,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        height: DOT_SIZE,
    },
    paginationDot: {
        width: DOT_SIZE * 0.3,
        height: DOT_SIZE * 0.3,
        borderRadius: DOT_SIZE * 0.15,
    },
    paginationDotContainer: {
        width: DOT_SIZE,
        alignItems: 'center',
        justifyContent: 'center'
    },
    paginationIndicator: {
        width: DOT_SIZE,
        height: DOT_SIZE,
        borderRadius: DOT_SIZE / 2,
        borderWidth: 2,
        borderColor: '#ddd',
    },
    tickerContainer: {
        position: 'absolute',
        top: 30,
        left: 20,
        overflow: 'hidden',
        height: TICKER_HEIGHT
    },
    tickerText: {
        fontSize: TICKER_HEIGHT,
        lineHeight: TICKER_HEIGHT,
        textTransform: 'uppercase',
        fontWeight: '800',
        color: '#444'
    },
    tickerText_ta_ml: {
        fontSize: 25,
        lineHeight: TICKER_HEIGHT,
        textTransform: 'uppercase',
        fontWeight: '800',
        color: '#444'
    },
    circleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    circle: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: CIRCLE_SIZE / 2,
        position: 'absolute',
        top: '19%',
    },
});