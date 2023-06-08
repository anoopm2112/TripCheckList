import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, Modal, StyleSheet, TouchableOpacity, Animated, Dimensions, Alert, StatusBar
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from "react-i18next";
import Colors from '../common/Colors';

const ICON_SIZE = 42;
const ITEM_HEIGHT = ICON_SIZE * 2;
const { width, height } = Dimensions.get('window');

const Icon = React.memo(({ icon, color }) => {
    return <MaterialCommunityIcons name={icon} color={color} size={ICON_SIZE} />;
});

const Item = React.memo(({ icon, color, name, showText }) => {
    return (
        <View style={styles.itemWrapper}>
            {showText ? (
                <Text style={[styles.itemText, { color }]}>{name}</Text>
            ) : (
                // for spacing purposes
                <View />
            )}
            <Icon icon={icon} color={color} />
        </View>
    );
});

const ConnectWithText = React.memo(() => {
    const { t } = useTranslation();
    return (
        <View style={styles.connectionWithTextContainer}>
            <Text style={styles.connectionWithTextStyle}>{t('PaidBy:payer')}</Text>
        </View>
    );
});

const ConnectButton = React.memo(({ onPress }) => {
    const { t } = useTranslation();
    return (
        <View style={{ position: 'absolute', top: height / 2 + ITEM_HEIGHT / 2, paddingHorizontal: 14 }}>
            <View style={{ height: ITEM_HEIGHT * 2, width: 4, backgroundColor: Colors.black }} />
            <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.connectBtnStyle}>
                <Text style={{ fontSize: 32, fontWeight: '800', color: '#FFF' }}>{t('PaidBy:paidBy')}</Text>
            </TouchableOpacity>
        </View>
    );
});

const ConnectCloseButton = React.memo(({ onPress }) => {
    return (
        <View style={{ position: 'absolute', top: 20, left: 20 }}>
            <TouchableOpacity onPress={onPress}>
                <MaterialCommunityIcons name="close-circle-outline" size={34} color="black" />
            </TouchableOpacity>
        </View>
    );
});

const List = React.memo(
    React.forwardRef(
        ({ color, showText, style, onScroll, onItemIndexChange, valueData }, ref) => {
            return (
                <Animated.FlatList
                    ref={ref}
                    data={valueData}
                    style={style}
                    keyExtractor={(item) => `${item.name}-${item.icon}`}
                    bounces={false}
                    scrollEnabled={!showText}
                    scrollEventThrottle={16}
                    onScroll={onScroll}
                    decelerationRate='fast'
                    snapToInterval={ITEM_HEIGHT}
                    showsVerticalScrollIndicator={false}
                    renderToHardwareTextureAndroid
                    contentContainerStyle={{
                        paddingTop: showText ? 0 : height / 2 - ITEM_HEIGHT / 2,
                        paddingBottom: showText ? 0 : height / 2 - ITEM_HEIGHT / 2,
                        paddingHorizontal: 20,
                    }}
                    renderItem={({ item }) => {
                        return <Item {...item} color={color} showText={showText} />;
                    }}
                    onMomentumScrollEnd={(ev) => {
                        const newIndex = Math.round(
                            ev.nativeEvent.contentOffset.y / ITEM_HEIGHT
                        );

                        if (onItemIndexChange) {
                            onItemIndexChange(newIndex);
                        }
                    }}
                />
            );
        }
    )
);


export default function NoteModal(props) {
    const { visible, onClose, value, onSubmitCheckList } = props;

    const newData = value.map((obj) => {
        return {
            ...obj,
            icon: `alpha-${obj.name.charAt(0).toLowerCase()}-box-outline`
        };
    });

    const visibleItem = visible || false;
    const [showView, setShowView] = useState(visibleItem);
    const viewAnimation = useRef(null);

    useEffect(() => {
        const Animation = async () => {
            if (visibleItem) {
                setShowView(true);
                if (viewAnimation.current)
                    await viewAnimation.current.fadeInLeft(2000);
            } else {
                if (viewAnimation.current)
                    await viewAnimation.current.fadeOutRightBig(1000);
                setShowView(false);
            }
        };
        Animation();
    }, [visibleItem, viewAnimation]);

    const [index, setIndex] = React.useState(0);

    const onConnectPress = React.useCallback(() => {
        onSubmitCheckList(newData[index].name, index);
        onClose();
    }, [index]);

    const yellowRef = React.useRef();
    const darkRef = React.useRef();
    const scrollY = React.useRef(new Animated.Value(0)).current;
    const onScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
    );
    const onItemIndexChange = React.useCallback(setIndex, []);

    React.useEffect(() => {
        scrollY.addListener((v) => {
            if (darkRef?.current) {
                darkRef.current.scrollToOffset({
                    offset: v.value,
                    animated: false,
                });
            }
        });
    });


    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={showView}
                onRequestClose={() => { onClose(); }}>
                <>
                    <View style={styles.container}>

                        <ConnectWithText />
                        <List
                            ref={yellowRef}
                            color={Colors.black}
                            style={StyleSheet.absoluteFillObject}
                            onScroll={onScroll}
                            onItemIndexChange={onItemIndexChange}
                            valueData={newData}
                        />
                        <List
                            ref={darkRef}
                            valueData={newData}
                            color={'#FFF'}
                            showText
                            style={styles.connectionListStyle}
                        />
                        <ConnectButton onPress={onConnectPress} />
                        <ConnectCloseButton onPress={() => { onClose(); }} />
                        <Item />
                    </View>
                </>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: StatusBar.currentHeight,
        backgroundColor: '#FFF',
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    itemWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: ITEM_HEIGHT,
    },
    itemText: {
        fontSize: 26,
        fontWeight: '800',
        textTransform: 'capitalize',
    },
    connectionWithTextContainer: {
        position: 'absolute',
        top: height / 2 - ITEM_HEIGHT * 1.2,
        width: width * 0.7,
        paddingHorizontal: 14
    },
    connectionWithTextStyle: {
        color: Colors.black,
        fontSize: 20,
        fontWeight: '700'
    },
    connectBtnStyle: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: Colors.black,
        alignItems: 'center',
        justifyContent: 'center'
    },
    connectionListStyle: {
        position: 'absolute',
        backgroundColor: Colors.black,
        width,
        height: ITEM_HEIGHT,
        top: height / 2 - ITEM_HEIGHT / 2,
    }
});