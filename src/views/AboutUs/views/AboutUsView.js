// import React, { useEffect, useRef } from 'react';
// import { View, ScrollView, Text, Image, StyleSheet, Dimensions } from 'react-native';
// import { useSelector } from 'react-redux';
// import * as Animatable from 'react-native-animatable';
// import AboutUsData from '../../../common/data/AboutUsData';
// import { darkModeColor } from '../../../common/utils/arrayObjectUtils';
// import Colors from '../../../common/Colors';

// const ArticleScreen = () => {
//   const scrollViewRef = useRef(null);
//   const headingRef = useRef(null);
//   const checklistRef = useRef(null);
//   const splitwiseRef = useRef(null);
//   const touristspotRef = useRef(null);
//   const costplannerRef = useRef(null);
//   const additionalRef = useRef(null);

//   const { title, moduleWise } = AboutUsData[0];
//   const { height, width } = Dimensions.get('screen');

//   const isDarkMode = useSelector((state) => state?.settings?.isDarkMode);
//   const { backgroundColor, textColor } = darkModeColor(isDarkMode);

//   useEffect(() => {
//     animateIn();
//   }, []);

//   const animateIn = () => {
//     headingRef.current.fadeInUpBig(800);
//     checklistRef.current.fadeInUpBig(1000);
//     splitwiseRef.current.fadeInUpBig(1200);
//     touristspotRef.current.fadeInUpBig(1400);
//     costplannerRef.current.fadeInUpBig(1400);
//     additionalRef.current.fadeInUpBig(1400);
//   };

//   const styles = StyleSheet.create({
//     container: {
//       flexGrow: 1,
//       padding: 16,
//       backgroundColor: '#FFFFFF',
//     },
//     title: {
//       fontSize: 16,
//       fontWeight: '400',
//       marginBottom: 16,
//       color: textColor,
//       lineHeight: 16 * 1.5,
//     },
//     moduleContainer: {
//       marginBottom: 24,
//     },
//     moduleTitle: {
//       fontSize: 20,
//       fontWeight: 'bold',
//       marginBottom: 8,
//       color: Colors.tertiary,
//       textDecorationLine: 'underline',
//     },
//     moduleDescription: {
//       fontSize: 15,
//       lineHeight: 16 * 1.5,
//       marginBottom: 8,
//       color: textColor,
//     },
//     moduleImage: {
//       width: '100%',
//       height: height * 0.4,
//       marginBottom: 8,
//     },
//     bottomActions: {
//         height: 80,
//         backgroundColor: '#FFF',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         flexDirection: 'row'
//     }
//   });

//   return (
//     <View style={{ flex: 1 }}>
//       <ScrollView
//         ref={scrollViewRef}
//         contentContainerStyle={styles.container}
//         scrollEventThrottle={16}
//       >
//         <Animatable.Text ref={headingRef} style={{ fontSize: 32, fontWeight: '800', color: textColor }}>
//           TRIP CHECKLIST
//         </Animatable.Text>
//         <Animatable.Text
//           ref={headingRef}
//           style={[styles.moduleDescription, { fontStyle: 'italic', marginBottom: 30 }]}
//         >
//           Developed By Anoop M
//         </Animatable.Text>
//         <Animatable.Text ref={headingRef} style={styles.title}>
//           {title}
//         </Animatable.Text>

//         <Animatable.View ref={checklistRef} style={styles.moduleContainer}>
//           <Text style={styles.moduleTitle}>CHECKLIST</Text>
//           <Text style={styles.moduleDescription}>{moduleWise.checklist}</Text>
//           <Image source={{ uri: moduleWise.checklist_img }} style={styles.moduleImage} />
//         </Animatable.View>

//         <Animatable.View ref={splitwiseRef} style={styles.moduleContainer}>
//           <Text style={styles.moduleTitle}>Money Split</Text>
//           <Text style={styles.moduleDescription}>{moduleWise.splitwise}</Text>
//           <Image source={{ uri: moduleWise.splitwise_img }} style={styles.moduleImage} />
//         </Animatable.View>

//         <Animatable.View ref={touristspotRef} style={styles.moduleContainer}>
//           <Text style={styles.moduleTitle}>Tourist Spots</Text>
//           <Text style={styles.moduleDescription}>{moduleWise.touristSpot}</Text>
//           <Image source={{ uri: moduleWise.touristSpot_img }} style={styles.moduleImage} />
//         </Animatable.View>

//         <Animatable.View ref={costplannerRef} style={styles.moduleContainer}>
//           <Text style={styles.moduleTitle}>Cost Planner</Text>
//           <Text style={styles.moduleDescription}>{moduleWise.costPlanner}</Text>
//           <Image source={{ uri: moduleWise.costPlanner_img }} style={styles.moduleImage} />
//         </Animatable.View>

//         <Animatable.View ref={additionalRef} style={styles.moduleContainer}>
//           <Text style={styles.moduleTitle}>Additional Details</Text>
//           <Text style={styles.moduleDescription}>{moduleWise.additionalInfo}</Text>
//           <Text style={styles.moduleDescription}>{moduleWise.notes}</Text>
//         </Animatable.View>
//       </ScrollView>
//     </View>
//   );
// };

// export default ArticleScreen;

import React from "react";
import { Animated, Dimensions, StyleSheet, Text, View, StatusBar, TouchableOpacity, Image } from "react-native";
import { Svg, Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { withTranslation } from "react-i18next";
import { connect } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AssetIconsPack from "../../../assets/IconProvide";
import AboutUsData from '../../../common/data/AboutUsData';
import { convertHeight, convertWidth } from "../../../common/utils/dimentionUtils";
import Colors from '../../../common/Colors';

const { width, height } = Dimensions.get("window");
const { title, moduleWise } = AboutUsData[0];

class App extends React.Component {
    // _scrollX = new Animated.Value(0);
    // scrollViewRef = React.createRef();
    constructor(props) {
        super(props);
        this._scrollX = new Animated.Value(0);
        this.scrollViewRef = React.createRef();
        this.state = {
            currentIndex: 0,
        };
    }

    handleNextPress = () => {
        const { currentIndex } = this.state;
        const nextIndex = currentIndex + 1;
        const offsetX = nextIndex * width;
        this.scrollViewRef.current.scrollTo({ x: offsetX, y: 0, animated: true });
        this.setState({ currentIndex: nextIndex });
    };

    handleBackPress = () => {
        const { currentIndex } = this.state;
        const nextIndex = currentIndex - 1;
        const offsetX = nextIndex * width;
        this.scrollViewRef.current.scrollTo({ x: offsetX, y: 0, animated: true });
        this.setState({ currentIndex: nextIndex });
    };

    render() {

        const { i18n, isDarkMode } = this.props;

        const PRODUCT_LIST = [
            {
                id: "s02h02e02c02",
                title: i18n.t('Dashboard:actions:checklist'),
                subHeading_1: 
                    i18n.language === 'en' ? moduleWise.checklist_Sub_heading_1.en :  
                    i18n.language === 'ml' ? moduleWise.checklist_Sub_heading_1.ml : 
                    i18n.language === 'hi' ? moduleWise.checklist_Sub_heading_1.hi : moduleWise.checklist_Sub_heading_1.ta,
                subHeading_2: 
                    i18n.language === 'en' ? moduleWise.checklist_Sub_heading_2.en :  
                    i18n.language === 'ml' ? moduleWise.checklist_Sub_heading_2.ml : 
                    i18n.language === 'hi' ? moduleWise.checklist_Sub_heading_2.hi : moduleWise.checklist_Sub_heading_2.ta,
                subHeading_3: 
                    i18n.language === 'en' ? moduleWise.checklist_Sub_heading_3.en :  
                    i18n.language === 'ml' ? moduleWise.checklist_Sub_heading_3.ml : 
                    i18n.language === 'hi' ? moduleWise.checklist_Sub_heading_3.hi : moduleWise.checklist_Sub_heading_3.ta,
                side_Icon_1: 'check-circle-outline',
                side_Icon_2: 'alarm',
                side_Icon_3: 'history',
                description: 
                    i18n.language === 'en' ? moduleWise.checklist_1.en :  
                    i18n.language === 'ml' ? moduleWise.checklist_1.ml : 
                    i18n.language === 'hi' ? moduleWise.checklist_1.hi : moduleWise.checklist_1.ta,
                desc_section_2: 
                    i18n.language === 'en' ? moduleWise.checklist_2.en :  
                    i18n.language === 'ml' ? moduleWise.checklist_2.ml : 
                    i18n.language === 'hi' ? moduleWise.checklist_2.hi : moduleWise.checklist_2.ta,
                desc_section_3: 
                    i18n.language === 'en' ? moduleWise.checklist_3.en :  
                    i18n.language === 'ml' ? moduleWise.checklist_3.ml : 
                    i18n.language === 'hi' ? moduleWise.checklist_3.hi : moduleWise.checklist_3.ta,
                bg: isDarkMode ? "#486e6b" : "#16CDC1",
                lottieIcon: AssetIconsPack.icons.checklist_image_about
            },
            {
                id: "s74h02e02c74",
                title: i18n.t('Dashboard:actions:money_splitter'),
                subHeading_1: 
                    i18n.language === 'en' ? moduleWise.splitwise_Sub_heading_1.en :  
                    i18n.language === 'ml' ? moduleWise.splitwise_Sub_heading_1.ml : 
                    i18n.language === 'hi' ? moduleWise.splitwise_Sub_heading_1.hi : moduleWise.splitwise_Sub_heading_1.ta,
                subHeading_2: 
                    i18n.language === 'en' ? moduleWise.splitwise_Sub_heading_2.en :  
                    i18n.language === 'ml' ? moduleWise.splitwise_Sub_heading_2.ml : 
                    i18n.language === 'hi' ? moduleWise.splitwise_Sub_heading_2.hi : moduleWise.splitwise_Sub_heading_2.ta,
                subHeading_3: 
                    i18n.language === 'en' ? moduleWise.splitwise_Sub_heading_3.en :  
                    i18n.language === 'ml' ? moduleWise.splitwise_Sub_heading_3.ml : 
                    i18n.language === 'hi' ? moduleWise.splitwise_Sub_heading_3.hi : moduleWise.splitwise_Sub_heading_3.ta,
                side_Icon_1: 'cash-multiple',
                side_Icon_2: 'calculator-variant',
                side_Icon_3: 'file-table-box-multiple',
                description: 
                    i18n.language === 'en' ? moduleWise.splitwise_1.en :  
                    i18n.language === 'ml' ? moduleWise.splitwise_1.ml : 
                    i18n.language === 'hi' ? moduleWise.splitwise_1.hi : moduleWise.splitwise_1.ta,
                desc_section_2: 
                    i18n.language === 'en' ? moduleWise.splitwise_2.en :  
                    i18n.language === 'ml' ? moduleWise.splitwise_2.ml : 
                    i18n.language === 'hi' ? moduleWise.splitwise_2.hi : moduleWise.splitwise_2.ta,
                desc_section_3: 
                    i18n.language === 'en' ? moduleWise.splitwise_3.en :  
                    i18n.language === 'ml' ? moduleWise.splitwise_3.ml : 
                    i18n.language === 'hi' ? moduleWise.splitwise_3.hi : moduleWise.splitwise_3.ta,
                bg: isDarkMode ? "#4b6354" : "#6dbf8b",
                lottieIcon: AssetIconsPack.icons.money_splitter_aboutus
            },
            {
                id: "s04h71e05c71",
                title: i18n.t('Dashboard:actions:tourist_places'),
                subHeading_1: 
                    i18n.language === 'en' ? moduleWise.touristSpot_Sub_heading_1.en :  
                    i18n.language === 'ml' ? moduleWise.touristSpot_Sub_heading_1.ml : 
                    i18n.language === 'hi' ? moduleWise.touristSpot_Sub_heading_1.hi : moduleWise.touristSpot_Sub_heading_1.ta,
                subHeading_2: 
                    i18n.language === 'en' ? moduleWise.touristSpot_Sub_heading_2.en :  
                    i18n.language === 'ml' ? moduleWise.touristSpot_Sub_heading_2.ml : 
                    i18n.language === 'hi' ? moduleWise.touristSpot_Sub_heading_2.hi : moduleWise.touristSpot_Sub_heading_2.ta,
                subHeading_3: 
                    i18n.language === 'en' ? moduleWise.touristSpot_Sub_heading_3.en :  
                    i18n.language === 'ml' ? moduleWise.touristSpot_Sub_heading_3.ml : 
                    i18n.language === 'hi' ? moduleWise.touristSpot_Sub_heading_3.hi : moduleWise.touristSpot_Sub_heading_3.ta,
                side_Icon_1: 'globe-model',
                side_Icon_2: 'directions',
                side_Icon_3: 'google-maps',
                description: 
                    i18n.language === 'en' ? moduleWise.touristSpot_1.en :  
                    i18n.language === 'ml' ? moduleWise.touristSpot_1.ml : 
                    i18n.language === 'hi' ? moduleWise.touristSpot_1.hi : moduleWise.touristSpot_1.ta,
                desc_section_2: 
                    i18n.language === 'en' ? moduleWise.touristSpot_2.en :  
                    i18n.language === 'ml' ? moduleWise.touristSpot_2.ml : 
                    i18n.language === 'hi' ? moduleWise.touristSpot_2.hi : moduleWise.touristSpot_2.ta,
                desc_section_3: 
                    i18n.language === 'en' ? moduleWise.touristSpot_3.en :  
                    i18n.language === 'ml' ? moduleWise.touristSpot_3.ml : 
                    i18n.language === 'hi' ? moduleWise.touristSpot_3.hi : moduleWise.touristSpot_3.ta,
                bg: isDarkMode ? "#4b5a70" : "#629BF0",
                lottieIcon: AssetIconsPack.icons.tourist_spot_about
            },
            {
                id: "s03h03e04c02",
                title: i18n.t('Dashboard:actions:costPlanner'),
                subHeading_1: 
                    i18n.language === 'en' ? moduleWise.costPlanner_Sub_heading_1.en :  
                    i18n.language === 'ml' ? moduleWise.costPlanner_Sub_heading_1.ml : 
                    i18n.language === 'hi' ? moduleWise.costPlanner_Sub_heading_1.hi : moduleWise.costPlanner_Sub_heading_1.ta,
                subHeading_2: 
                    i18n.language === 'en' ? moduleWise.costPlanner_Sub_heading_2.en :  
                    i18n.language === 'ml' ? moduleWise.costPlanner_Sub_heading_2.ml : 
                    i18n.language === 'hi' ? moduleWise.costPlanner_Sub_heading_2.hi : moduleWise.costPlanner_Sub_heading_2.ta,
                subHeading_3: 
                    i18n.language === 'en' ? moduleWise.costPlanner_Sub_heading_3.en :  
                    i18n.language === 'ml' ? moduleWise.costPlanner_Sub_heading_3.ml : 
                    i18n.language === 'hi' ? moduleWise.costPlanner_Sub_heading_3.hi : moduleWise.costPlanner_Sub_heading_3.ta,
                side_Icon_1: 'calculator-variant',
                side_Icon_2: 'gas-station',
                side_Icon_3: 'tools',
                description: 
                    i18n.language === 'en' ? moduleWise.costPlanner_1.en :  
                    i18n.language === 'ml' ? moduleWise.costPlanner_1.ml : 
                    i18n.language === 'hi' ? moduleWise.costPlanner_1.hi : moduleWise.costPlanner_1.ta,
                desc_section_2: 
                    i18n.language === 'en' ? moduleWise.costPlanner_2.en :  
                    i18n.language === 'ml' ? moduleWise.costPlanner_2.ml : 
                    i18n.language === 'hi' ? moduleWise.costPlanner_2.hi : moduleWise.costPlanner_2.ta,
                desc_section_3: 
                    i18n.language === 'en' ? moduleWise.costPlanner_3.en :  
                    i18n.language === 'ml' ? moduleWise.costPlanner_3.ml : 
                    i18n.language === 'hi' ? moduleWise.costPlanner_3.hi : moduleWise.costPlanner_3.ta,
                bg: isDarkMode ? "#6e704c" : "palevioletred",
                lottieIcon: AssetIconsPack.icons.cost_planner_about
            },
            {
                id: "s03h03e04c03",
                title: i18n.t('Dashboard:actions:additional_info'),
                subHeading_1: 
                    i18n.language === 'en' ? moduleWise.additionalInfo_Sub_heading_1.en :  
                    i18n.language === 'ml' ? moduleWise.additionalInfo_Sub_heading_1.ml : 
                    i18n.language === 'hi' ? moduleWise.additionalInfo_Sub_heading_1.hi : moduleWise.additionalInfo_Sub_heading_1.ta,
                subHeading_2: 
                    i18n.language === 'en' ? moduleWise.additionalInfo_Sub_heading_2.en :  
                    i18n.language === 'ml' ? moduleWise.additionalInfo_Sub_heading_2.ml : 
                    i18n.language === 'hi' ? moduleWise.additionalInfo_Sub_heading_2.hi : moduleWise.additionalInfo_Sub_heading_2.ta,
                side_Icon_1: 'information-variant',
                side_Icon_2: 'exclamation-thick',
                description: 
                    i18n.language === 'en' ? moduleWise.additionalInfo.en :  
                    i18n.language === 'ml' ? moduleWise.additionalInfo.ml : 
                    i18n.language === 'hi' ? moduleWise.additionalInfo.hi : moduleWise.additionalInfo.ta,
                desc_section_2: 
                    i18n.language === 'en' ? moduleWise.notes.en :  
                    i18n.language === 'ml' ? moduleWise.notes.ml : 
                    i18n.language === 'hi' ? moduleWise.notes.hi : moduleWise.notes.ta,
                bg: isDarkMode ? "#6e704c" : "#ccd444",
                lottieIcon: AssetIconsPack.icons.more_Info_about
            }
        ];

        return (
            <View style={styles.container}>
                <StatusBar backgroundColor={PRODUCT_LIST[this.state.currentIndex].bg} barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                <Animated.ScrollView
                    ref={this.scrollViewRef}
                    pagingEnabled
                    scrollEventThrottle={16}
                    horizontal
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: this._scrollX } } }],
                        {
                            useNativeDriver: true,
                            listener: (event) => {
                                const offsetX = event.nativeEvent.contentOffset.x;
                                const currentIndex = Math.round(offsetX / width);
                                this.setState({ currentIndex });
                                StatusBar.setBackgroundColor(PRODUCT_LIST[currentIndex].bg);
                            },
                        }
                    )}
                    contentContainerStyle={styles.scrollViewContainer}
                >
                    {PRODUCT_LIST.map((item, i) => this._renderItem(item, i, i18n))}
                </Animated.ScrollView>
            </View>
        );
    }

    _renderItem = (item, i, i18n) => {
        const inputRange = [
            (i - 2) * width,
            (i - 1) * width,
            i * width,
            (i + 1) * width
        ];
        const imageScale = this._scrollX.interpolate({
            inputRange,
            outputRange: [1, 0.4, 1, 0.4]
        });
        const imageOpacity = this._scrollX.interpolate({
            inputRange,
            outputRange: [1, 0.2, 1, 0.2]
        });

        return (
            <View key={item.id} style={[styles.container, styles.item]}>
                <View style={[styles.HeaderContainer, { backgroundColor: item.bg }]}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack(null)} style={styles.HeaderBackButton}>
                            <MaterialCommunityIcons name="arrow-left" size={24} color={this.props.isDarkMode ? Colors.primary : Colors.black} />
                        </TouchableOpacity>
                        <Text style={[styles.HeaderTitle, { color: this.props.isDarkMode ? Colors.primary : Colors.black }]}>{item.title}</Text>
                    </View>
                    <TouchableOpacity style={styles.HeaderIconContainer}>
                        <Image style={{ height: convertHeight(30), width: convertWidth(35), borderRadius: convertWidth(35), backgroundColor: item.bg }} source={AssetIconsPack.icons.app_logo_side_image} />
                    </TouchableOpacity>
                </View>
                <Animated.View style={[styles.image, { transform: [{ scale: imageScale }], opacity: imageOpacity }]}>
                    {(i18n.language === 'en' || i18n.language === 'hi') && <Image source={item.lottieIcon} style={{ height: convertHeight(120), resizeMode: 'contain' }} />}
                </Animated.View>
                <Animated.View style={{ opacity: imageOpacity, marginHorizontal: 45, transform: [{ scale: imageScale }] }}>
                    {/* <Text style={[styles.title, { paddingVertical: 20, color: this.props.isDarkMode ? Colors.primary : Colors.black, }]}>{item.title}</Text> */}

                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: (i18n.language === 'en' || i18n.language === 'hi') ? 20 : 0 }}>
                        <View style={[styles.iconContainer, { backgroundColor: item.bg }]}>
                            <MaterialCommunityIcons name={item.side_Icon_1} size={24} color={Colors.primary} />
                        </View>
                        <View>
                            <Text style={{ marginHorizontal: 20, fontSize: 16, color: this.props.isDarkMode ? Colors.primary : Colors.black, fontWeight: 'bold' }}>{item.subHeading_1}</Text>
                            <Text style={{ marginHorizontal: 20, fontSize: 14, lineHeight: 16 * 1.3, color: this.props.isDarkMode ? Colors.primary : Colors.black, }}>{item.description}</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 15 }}>
                        <View style={[styles.iconContainer, { backgroundColor: item.bg }]}>
                            <MaterialCommunityIcons name={item.side_Icon_2} size={24} color={Colors.primary} />
                        </View>
                        <View>
                            <Text style={{ marginHorizontal: 20, fontSize: 16, color: this.props.isDarkMode ? Colors.primary : Colors.black, fontWeight: 'bold' }}>{item.subHeading_2}</Text>
                            <Text style={{ marginHorizontal: 20, fontSize: 14, lineHeight: 16 * 1.3, color: this.props.isDarkMode ? Colors.primary : Colors.black, }}>{item.desc_section_2}</Text>
                        </View>
                    </View>

                    {item.side_Icon_3 && <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={[styles.iconContainer, { backgroundColor: item.bg }]}>
                            <MaterialCommunityIcons name={item.side_Icon_3} size={24} color={Colors.primary} />
                        </View>
                        <View>
                            <Text style={{ marginHorizontal: 20, fontSize: 16, color: this.props.isDarkMode ? Colors.primary : Colors.black, fontWeight: 'bold' }}>{item.subHeading_3}</Text>
                            <Text style={{ marginHorizontal: 20, fontSize: 14, lineHeight: 16 * 1.3, color: this.props.isDarkMode ? Colors.primary : Colors.black, }}>{item.desc_section_3}</Text>
                        </View>
                    </View>}
                </Animated.View>
                <View style={styles.arrowBtn}>
                    {this.state.currentIndex > 0 && <TouchableOpacity onPress={this.handleBackPress} style={styles.logoImage}>
                        <AntDesign name="arrowleft" size={24} color="#FFF" />
                    </TouchableOpacity>}
                    {item.id !== "s03h03e04c03" && <TouchableOpacity onPress={this.handleNextPress} style={styles.logoImage}>
                        <AntDesign name="arrowright" size={24} color="#FFF" />
                    </TouchableOpacity>}
                </View>
                {this._renderRadialGradient(item.bg, inputRange)}
            </View>
        );
    };

    _renderRadialGradient = (color, inputRange) => {
        const rotate = this._scrollX.interpolate({
            inputRange,
            outputRange: ["0deg", "-15deg", "0deg", "15deg"]
        });
        const translateX = this._scrollX.interpolate({
            inputRange,
            outputRange: [0, width, 0, -width]
        });
        const opacity = this._scrollX.interpolate({
            inputRange,
            outputRange: [1, 0.5, 1, 0.5]
        });

        return (
            <Animated.View
                style={[
                    styles.svgContainer,
                    {
                        transform: [
                            {
                                rotate
                            },
                            {
                                translateX
                            },
                            {
                                scale: 1.3
                            }
                        ],
                        opacity
                    }
                ]}
            >
                <Svg height={height} width={width}>
                    <Defs>
                        <RadialGradient
                            id="grad"
                            cx="50%"
                            cy="35%"
                            r="60%"
                            gradientUnits="userSpaceOnUse"
                        >
                            <Stop offset="0%" stopColor={this.props.isDarkMode ? Colors.black : Colors.primary} stopOpacity="1" />
                            <Stop offset="100%" stopColor={color} stopOpacity="1" />
                        </RadialGradient>
                    </Defs>
                    <Rect
                        x="0"
                        y="0"
                        width={width}
                        height={height}
                        fill={`url(#grad)`}
                        fillOpacity="0.9"
                    />
                </Svg>
            </Animated.View>
        );
    };
}

const styles = StyleSheet.create({
    item: {
        width,
        height,
        alignItems: "center"
    },
    scrollViewContainer: {
        alignItems: "center",
        justifyContent: "center"
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        // justifyContent: "center"
    },
    metaContainer: {
        alignItems: "center",
        justifyContent: "flex-end",
        backgroundColor: "transparent",
        padding: 15
    },
    title: {
        fontSize: convertHeight(18),
        fontWeight: '700',
        marginBottom: convertHeight(10),
        textDecorationLine: 'underline',
        textAlign: 'center'
    },
    subtitle: {
        fontSize: 10,
        fontWeight: "900"
    },
    description: {
        marginVertical: 4,
        marginHorizontal: 10,
        textAlign: "center",
        fontSize: 15,
        lineHeight: 16 * 1.3,
        color: Colors.black,
    },
    price: {
        fontSize: 15,
        fontWeight: "400"
    },
    svgContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: -1
    },
    logoImage: {
        width: width / 7,
        height: width / 7,
        borderRadius: 60,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center'
    },
    arrowBtn: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: convertWidth(150),
        position: 'absolute',
        bottom: 70
    },
    image: {
        paddingTop: convertHeight(40)
    },
    iconContainer: {
        height: 40,
        width: 40,
        borderRadius: 40,
        backgroundColor: Colors.secondary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    HeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: convertHeight(3),
        height: convertHeight(50),
        width: '100%'
    },
    HeaderBackButton: {
        paddingRight: 16,
    },
    HeaderTitle: {
        fontSize: 20,
        fontWeight: '500',
        paddingLeft: 13,
    },
    HeaderIconContainer: {
        paddingLeft: 26,
    },
});

const mapStateToProps = (state) => ({
    isDarkMode: state?.settings?.isDarkMode,
});

const ConnectedComponent = connect(mapStateToProps)(App);
export default withTranslation()(ConnectedComponent);