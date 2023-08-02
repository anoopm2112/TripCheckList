import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Animated } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
// Custom Imports
import { convertHeight } from '../../../common/utils/dimentionUtils';
import Colors from '../../../common/Colors';
// Database
import { deleteCheckList, deleteSplitWiseList, queryAllCheckList, queryAllSplitWiseList } from '../../../database/allSchemas';
import { addNewChecklists } from '../../CheckList/api/ChecklistApi';
import { addNewSplitwises } from '../../SplitWise/api/SplitWiseApi';
import { darkModeColor } from '../../../common/utils/arrayObjectUtils';
import { selectAllChecklists } from '../../CheckList/checklistSlice';

const SyncLocalToServer = () => {
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const syncIconAnimation = useRef(new Animated.Value(0)).current;

    const isDarkMode = useSelector(state => state?.settings?.isDarkMode);
    const { backgroundColor, textColor } = darkModeColor(isDarkMode);
    const { status } = useSelector(selectAllChecklists);

    const [checklistSyncItem, setChecklistSyncItem] = useState([]);
    const [splitwiseSyncItem, setSplitwiseSyncItem] = useState([]);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (isFocused) {
            syncOperation();
        }
    }, [isFocused, dispatch]);

    const syncOperation = async () => {
        // Checklist
        const getChecklistLocalData = await queryAllCheckList();
        const checklistLocalData = JSON.parse(JSON.stringify(getChecklistLocalData));
        setChecklistSyncItem(checklistLocalData);

        // Splitwise
        const getSplitwiseLocalData = await queryAllSplitWiseList();
        const splitwiseLocalData = JSON.parse(JSON.stringify(getSplitwiseLocalData));
        setSplitwiseSyncItem(splitwiseLocalData);
    };

    const onSyncHandler = async () => {
        Animated.loop(
            Animated.timing(syncIconAnimation, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(syncIconAnimation, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }),
        ).start();

        if (checklistSyncItem?.length > 0) {
            for (let i = 0; i < checklistSyncItem?.length; i++) {
                setSending(true);
                const responseItem = checklistSyncItem[i];
                await dispatch(addNewChecklists(responseItem));
                if (status === 'succeeded') {
                    await deleteCheckList(checklistSyncItem[i].id);
                }
                setSending(false);
                Animated.timing(syncIconAnimation).stop();
                syncIconAnimation.setValue(0);
                syncOperation();
            }
        }

        if (splitwiseSyncItem?.length > 0) {
            for (let i = 0; i < splitwiseSyncItem?.length; i++) {
                setSending(true);
                const responseItem = splitwiseSyncItem[i];
                await dispatch(addNewSplitwises(responseItem));
                if (status === 'succeeded') {
                    await deleteSplitWiseList(splitwiseSyncItem[i].id);
                }
                setSending(false);
                Animated.timing(syncIconAnimation).stop();
                syncIconAnimation.setValue(0);
                syncOperation();
            }
        }
    };

    const rotateSyncIconInterpolation = syncIconAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const iconLangStyle = {
        transform: [{ rotate: rotateSyncIconInterpolation }],
    };


    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: convertHeight(10)
        },
        card: {
            backgroundColor: isDarkMode ? '#565051' : Colors.primary,
            borderRadius: 3,
            marginBottom: 20,
            elevation: 2,
            padding: 10
        },
        cardTitle: {
            fontSize: convertHeight(14),
            fontWeight: 'bold',
            color: textColor
        },
        cardSubtitle: {
            fontSize: convertHeight(10),
            color: isDarkMode ? Colors.tertiary : Colors.green,
            textTransform: 'uppercase'
        },
        cardIcon: {
            paddingTop: convertHeight(12),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        button: {
            borderRadius: 3,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'flex-end',
            padding: 10
        },
        buttonTitle: {
            color: 'white',
            fontSize: convertHeight(12),
            fontWeight: '400',
            textTransform: 'uppercase'
        },
        textBasic: {
            color: textColor,
            fontSize: convertHeight(10),
            letterSpacing: 1
        }
    });

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={backgroundColor} barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

            <View style={styles.card}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={styles.cardTitle}>{t('Dashboard:actions:checklist')}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {checklistSyncItem === undefined ?
                            <MaterialCommunityIcons style={{ paddingRight: 5 }} name={`numeric-${0}-box-multiple`} size={convertHeight(18)} color={textColor} /> :
                            <MaterialCommunityIcons style={{ paddingRight: 5 }} name={`numeric-${checklistSyncItem?.length}-box-multiple`} size={convertHeight(18)} color={textColor} />
                        }
                        {checklistSyncItem?.length > 0 ?
                            <Animated.View style={[iconLangStyle]}>
                                <Ionicons name="sync" size={24} color={sending ? Colors.tertiary : Colors.lightRed} />
                            </Animated.View>
                            :
                            <Ionicons name="checkmark-circle" size={24} color={isDarkMode ? Colors.info : Colors.lightGreen} />
                        }
                    </View>
                </View>
                <View style={{ borderWidth: 0.2, borderColor: Colors.info, marginVertical: 5 }} />
                <Text style={styles.cardSubtitle}>
                    {checklistSyncItem?.length > 0 ?
                        `${checklistSyncItem?.length} ${t('Settings:items_to_sync')}` :
                        t('Settings:nothing_to_sync')
                    }
                </Text>
                <View style={styles.cardIcon}>
                    <Text style={styles.textBasic}>
                        {(checklistSyncItem?.length > 0 && !sending) ?
                            t('Settings:waiting_to_sync') :
                            (checklistSyncItem?.length > 0 && sending) ?
                                t('Settings:sync_processing') :
                                t('Settings:no_data_local_database')
                        }
                    </Text>
                </View>
            </View>

            <View style={styles.card}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={styles.cardTitle}>{t('Dashboard:actions:money_splitter')}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {splitwiseSyncItem === undefined ?
                            <MaterialCommunityIcons style={{ paddingRight: 5 }} name={`numeric-${0}-box-multiple`} size={convertHeight(18)} color={textColor} />
                            :
                            <MaterialCommunityIcons style={{ paddingRight: 5 }} name={`numeric-${splitwiseSyncItem?.length}-box-multiple`} size={convertHeight(18)} color={textColor} />}
                        {splitwiseSyncItem?.length > 0 ?
                            <Animated.View style={[iconLangStyle, { opacity: 1 }]}>
                                <Ionicons name="sync" size={24} color={sending ? Colors.tertiary : Colors.lightRed} />
                            </Animated.View>
                            :
                            <Ionicons name="checkmark-circle" size={24} color={isDarkMode ? Colors.info : Colors.lightGreen} />
                        }
                    </View>
                </View>
                <View style={{ borderWidth: 0.2, borderColor: Colors.info, marginVertical: 5 }} />
                <Text style={styles.cardSubtitle}>
                    {splitwiseSyncItem?.length > 0 ?
                        `${splitwiseSyncItem?.length} ${t('Settings:items_to_sync')}` :
                        t('Settings:nothing_to_sync')
                    }

                </Text>
                <View style={styles.cardIcon}>
                    <Text style={styles.textBasic}>
                        {(splitwiseSyncItem?.length > 0 && !sending) ?
                            t('Settings:waiting_to_sync') :
                            (splitwiseSyncItem?.length > 0 && sending) ?
                                t('Settings:sync_processing') :
                                t('Settings:no_data_local_database')
                        }
                    </Text>
                </View>
            </View>

            {(checklistSyncItem?.length > 0 || splitwiseSyncItem?.length > 0) &&
                <TouchableOpacity onPress={() => onSyncHandler()}
                    style={[styles.button, {
                        backgroundColor: sending ? Colors.info : Colors.secondary
                    }]}>
                    <Text style={styles.buttonTitle}>{t('Settings:sync_to_server')}</Text>
                </TouchableOpacity>}
        </View>
    );
};

export default SyncLocalToServer;
