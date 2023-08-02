import * as React from 'react';
import {
    StatusBar, Text, View, StyleSheet, FlatList, Image, Dimensions, Animated, TouchableOpacity, Platform,
} from 'react-native';
import Lottie from 'lottie-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
// Custom Imports
import Colors from '../../../common/Colors';
import AssetIconsPack from '../../../assets/IconProvide';
import { convertHeight } from '../../../common/utils/dimentionUtils';
import { ROUTE_KEYS } from '../../../navigation/constants';
import { darkModeColor } from '../../../common/utils/arrayObjectUtils';

const { width, height } = Dimensions.get('window');
const SPACING = 10;
const ITEM_SIZE = Platform.OS === 'ios' ? width * 0.72 : width * 0.74;
const EMPTY_ITEM_SIZE = (width - ITEM_SIZE) / 2;
const BACKDROP_HEIGHT = height;

const Backdrop = ({ movies, scrollX }) => {
    return (
        <View style={{ height: BACKDROP_HEIGHT, width, position: 'absolute' }}>
            <FlatList
                data={movies.reverse()}
                keyExtractor={(item) => item.key + '-backdrop'}
                removeClippedSubviews={false}
                contentContainerStyle={{ width, height: BACKDROP_HEIGHT }}
                renderItem={({ item, index }) => {
                    if (!item.backdrop) {
                        return null;
                    }
                    const translateX = scrollX.interpolate({
                        inputRange: [(index - 2) * ITEM_SIZE, (index - 1) * ITEM_SIZE],
                        outputRange: [0, width],
                        // extrapolate:'clamp'
                    });
                    return (
                        <Animated.View
                            removeClippedSubviews={false}
                            style={{ position: 'absolute', width: translateX, height, overflow: 'hidden' }}>
                            <Image
                                source={item.backdrop}
                                style={{ width, height: BACKDROP_HEIGHT, position: 'absolute', backgroundColor: item.backdrop_color }}
                                resizeMode='repeat'
                            />
                        </Animated.View>
                    );
                }}
            />
        </View>
    );
};

export default function App(props) {
    const { navigation } = props;
    const [movies, setMovies] = React.useState([]);
    const scrollX = React.useRef(new Animated.Value(0)).current;
    const isDarkMode = useSelector(state => state?.settings?.isDarkMode);
    const { backgroundColor, textColor } = darkModeColor(isDarkMode);
    const { i18n, t } = useTranslation();

    React.useEffect(() => {
        const fetchData = async () => {
            const movies = [
                {
                    key: '1',
                    id: 1,
                    poster: AssetIconsPack.icons.cost_planner_about,
                    poster_color: isDarkMode ? Colors.black : '#fcedcc',
                    title: 'Dashboard:actions:costPlanner',
                    description: 'CostPlanner:cost_help_inof',
                    backdrop: AssetIconsPack.icons.background_help,
                    backdrop_color: isDarkMode ? '#454545' : '#FFD580',
                    videoId: AssetIconsPack.icons.cost_planner_video
                },
                {
                    key: '2',
                    id: 2,
                    poster: AssetIconsPack.icons.tourist_spot_about,
                    poster_color: isDarkMode ? Colors.black : '#ededeb',
                    title: 'Dashboard:actions:tourist_places',
                    description: 'Touristplace:tourist_help_info',
                    backdrop: AssetIconsPack.icons.background_help,
                    backdrop_color: isDarkMode ? Colors.black : '#D3D3D3',
                    videoId: AssetIconsPack.icons.toursit_video
                },
                {
                    key: '3',
                    id: 3,
                    poster: AssetIconsPack.icons.money_splitter_aboutus,
                    poster_color: isDarkMode ? '#3D3C3A' : '#fafae3',
                    title: 'Dashboard:actions:money_splitter',
                    description: 'Splitwise:money_help_info',
                    backdrop: AssetIconsPack.icons.background_help,
                    backdrop_color: isDarkMode ? '#3D3C3A' : '#FFFFE0',
                    videoId: AssetIconsPack.icons.money_splitter_video
                },
                {
                    key: '4',
                    id: 4,
                    poster: AssetIconsPack.icons.checklist_image_about,
                    poster_color: isDarkMode ? Colors.black : '#ebf8fc',
                    title: 'Dashboard:actions:checklist',
                    description: 'checklist:checklist_help_info',
                    backdrop: AssetIconsPack.icons.background_help,
                    backdrop_color: isDarkMode ? Colors.black : '#ADD8E6',
                    videoId: AssetIconsPack.icons.checklist_video
                }
            ];
            setMovies([{ key: 'empty-left' }, ...movies, { key: 'empty-right' }]);
        };

        if (movies.length === 0) {
            fetchData(movies);
        }
    }, [movies]);

    return (
        <View style={styles.container}>
            <Backdrop movies={movies} scrollX={scrollX} />
            <StatusBar backgroundColor={backgroundColor} barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <Animated.FlatList
                showsHorizontalScrollIndicator={false}
                data={movies}
                keyExtractor={(item) => item.key}
                horizontal
                bounces={false}
                decelerationRate={Platform.OS === 'ios' ? 0 : 0.96}
                renderToHardwareTextureAndroid
                contentContainerStyle={{ alignItems: 'center' }}
                snapToInterval={ITEM_SIZE}
                snapToAlignment='start'
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
                renderItem={({ item, index }) => {
                    if (!item.poster) {
                        return <View style={{ width: EMPTY_ITEM_SIZE }} />;
                    }

                    const inputRange = [
                        (index - 2) * ITEM_SIZE,
                        (index - 1) * ITEM_SIZE,
                        index * ITEM_SIZE,
                    ];

                    const translateY = scrollX.interpolate({
                        inputRange,
                        outputRange: [50, 2, 50],
                        extrapolate: 'clamp',
                    });

                    return (
                        <View key={item.id} style={{ width: ITEM_SIZE }}>
                            <Animated.Text
                                style={{
                                    transform: [{ translateY }], fontSize: 20, fontWeight: 'bold', color: textColor,
                                    textTransform: 'uppercase', alignSelf: 'center', paddingBottom: 10
                                }} numberOfLines={1}>
                                {t(item.title)}
                            </Animated.Text>
                            <Animated.View
                                style={{
                                    marginHorizontal: SPACING,
                                    padding: SPACING * 2,
                                    alignItems: 'center',
                                    transform: [{ translateY }],
                                    backgroundColor: item.poster_color,
                                    borderRadius: 30,
                                    elevation: 5,
                                }}
                            >
                                <View style={styles.posterImage}>
                                    <Image source={item.poster} style={[styles.posterImage, { backgroundColor: item.backdrop_color }]} />
                                    {/* <Lottie source={item.poster} loop={true} autoPlay style={{ height: item.id === 1 ? convertHeight(120) : convertHeight(170) }} /> */}
                                </View>

                                {/* <Text style={{ fontSize: 20, fontWeight: '500', color: textColor, textTransform: 'uppercase', paddingBottom: 8 }} numberOfLines={1}>
                                    {t(item.title)}
                                </Text> */}
                                <Text style={{ fontSize: 12, color: textColor, textAlign: 'center', paddingTop: convertHeight(15) }} numberOfLines={3}>
                                    {t(item.description)}
                                </Text>
                                <TouchableOpacity onPress={() => navigation.navigate(ROUTE_KEYS.VIDEO_VIEW, { videoId: item.videoId })}
                                    style={{
                                        padding: 7, backgroundColor: item.poster_color, elevation: 1, marginTop: 10,
                                        borderRadius: 5, flexDirection: 'row', justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                    <Text style={{
                                        fontSize: 12, color: textColor, textAlign: 'center', textTransform: 'uppercase', fontWeight: 'bold',
                                        paddingRight: 5
                                    }}>{t('Common:play_video')}</Text>
                                    <Ionicons name="play-circle" size={24} color={textColor} />
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    posterImage: {
        width: convertHeight(150),
        height: convertHeight(150),
        resizeMode: 'contain',
        borderRadius: convertHeight(150),
        margin: 0,
        // marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
});