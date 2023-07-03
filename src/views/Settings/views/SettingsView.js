import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import RBSheet from "react-native-raw-bottom-sheet";
import { useTranslation } from "react-i18next";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
import { ROUTE_KEYS } from '../../../navigation/constants';
import Colors from '../../../common/Colors';
import { convertHeight, convertWidth } from '../../../common/utils/dimentionUtils';
import { EraseModal, List } from '../../../components';
import { languagesInitialValue } from '../../../common/translation/constant';
import { toggleDarkMode } from '../settingsSlice';
import { darkModeColor } from '../../../common/utils/arrayObjectUtils';
import { deleteAllSplitWise } from '../../SplitWise/api/SplitWiseApi';
import { deleteAllChecklist } from '../../CheckList/api/ChecklistApi';

export default function SettingsView(props) {
    const { i18n, t } = useTranslation();
    const refRBSheet = useRef();
    const refRBThemeSheet = useRef();
    const refRBClearAllSheet = useRef();
    const dispatch = useDispatch();
    const isDarkMode = useSelector(state => state?.settings?.isDarkMode);
    const { backgroundColor, textColor } = darkModeColor(isDarkMode);
    const [eraseModalVisible, setEraseModalVisible] = useState(false);

    const onChangeLanguage = (lang) => {
        refRBSheet.current.close();
        i18n.changeLanguage(lang);
        // props.navigation.navigate(ROUTE_KEYS.DASHBOARD_SCREEN);
    };

    const settingsArray = [
        {
            id: 1,
            name: 'Settings:changelanguage',
            icon_name: 'language',
            onPress: () => refRBSheet.current.open()
        },
        {
            id: 2,
            name: 'Settings:theme',
            icon_name: 'theme-light-dark',
            onPress: () => refRBThemeSheet.current.open()
        },
        {
            id: 3,
            name: 'Settings:clear_all_data',
            icon_name: 'broom',
            onPress: () => refRBClearAllSheet.current.open()
        },
        {
            id: 4,
            name: 'ABOUT US',
            icon_name: 'information',
            onPress: () => props.navigation.navigate(ROUTE_KEYS.ABOUT_US)
        },
        {
            id: 5,
            name: 'LOGOUT AND EXIT',
            icon_name: 'exit-to-app',
            onPress: () => props.navigation.navigate(ROUTE_KEYS.WELCOME_SCREEN)
        }
    ];

    const renderItem = (item) => {
        return (
            <TouchableOpacity activeOpacity={0.9} onPress={() => onChangeLanguage(item.languageCode)} style={[styles.button, { backgroundColor: isDarkMode ? '#2c2c2e' : Colors.primary }]}>
                <Text style={{ color: textColor, fontWeight: 'bold' }}>{t(`Languages:${item?.language}`)}</Text>
                {i18n.language === item.languageCode &&
                    <AntDesign name="checkcircle" size={24} color={isDarkMode ? Colors.primary : Colors.green} />
                }
            </TouchableOpacity>
        );
    };

    const handleToggleDarkMode = () => {
        dispatch(toggleDarkMode());
        refRBThemeSheet.current.close();
    };

    const handleEraseAllData = () => {
        refRBClearAllSheet.current.close();
        setEraseModalVisible(true);
        dispatch(deleteAllSplitWise());
        dispatch(deleteAllChecklist());
    };

    const styles = StyleSheet.create({
        mainContainer: {
            backgroundColor: backgroundColor,
            flex: 1
        },
        button: {
            backgroundColor: backgroundColor,
            padding: convertHeight(17),
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center'
        },
        buttonErase: {
            backgroundColor: isDarkMode ? '#2c2c2e' : Colors.primary,
            marginTop: 25,
            width: 150,
            height: 50,
            justifyContent: 'space-around',
            flexDirection: 'row',
            alignItems: 'center',
            elevation: 3,
            borderRadius: 3,
            borderColor: Colors.primary,
            borderWidth: isDarkMode ? 1 : 0
        }
    });

    return (
        <View style={styles.mainContainer}>
            <StatusBar backgroundColor={backgroundColor} barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

            {settingsArray.map((item) => {
                return (
                    <TouchableOpacity key={item.id} style={styles.button} onPress={item.onPress}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {item.id == 1 ?
                                <FontAwesome name={item.icon_name} size={24} color={textColor} />
                                :
                                <MaterialCommunityIcons name={item.icon_name} size={24} color={textColor} />
                            }
                            <Text style={{ color: textColor, paddingLeft: convertWidth(12), fontWeight: '500' }}>{t(item.name)}</Text>
                        </View>
                        <Ionicons name="md-chevron-forward-sharp" size={24} color={textColor} />
                    </TouchableOpacity>
                );
            })}

            <RBSheet
                height={convertHeight(223)} ref={refRBSheet}
                closeOnDragDown={true}
                customStyles={{
                    draggableIcon: { backgroundColor: textColor },
                    container: {
                        backgroundColor: isDarkMode ? '#2c2c2e' : Colors.primary
                    }
                }}>
                <List data={languagesInitialValue} renderItem={({ item }) => renderItem(item)} />
            </RBSheet>

            <RBSheet height={convertHeight(127)} ref={refRBThemeSheet} closeOnDragDown={true}
                customStyles={{
                    draggableIcon: { backgroundColor: textColor },
                    container: { backgroundColor: isDarkMode ? '#2c2c2e' : Colors.primary }
                }}>
                <View>

                    <TouchableOpacity disabled={isDarkMode} onPress={() => handleToggleDarkMode()} style={[styles.button, { backgroundColor: isDarkMode ? '#2c2c2e' : Colors.primary }]}>
                        <Text style={{ color: textColor, fontWeight: 'bold' }}>{t('Settings:dark')}</Text>
                        {isDarkMode && <AntDesign name="checkcircle" size={24} color={Colors.primary} />}
                    </TouchableOpacity>

                    <TouchableOpacity disabled={!isDarkMode} onPress={() => handleToggleDarkMode()} style={[styles.button, { backgroundColor: isDarkMode ? '#2c2c2e' : Colors.primary }]}>
                        <Text style={{ color: textColor, fontWeight: 'bold' }}>{t('Settings:light')}</Text>
                        {!isDarkMode && <AntDesign name="checkcircle" size={24} color={Colors.green} />}
                    </TouchableOpacity>

                </View>
            </RBSheet>

            <RBSheet
                height={convertHeight(127)} ref={refRBClearAllSheet} closeOnDragDown={true}
                customStyles={{
                    draggableIcon: { backgroundColor: textColor },
                    container: { backgroundColor: isDarkMode ? '#2c2c2e' : Colors.primary }
                }}>
                <View>
                    <Text style={{ color: textColor, fontWeight: 'bold', textAlign: 'center' }}>{t('Settings:clear_all_val')}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 32 }}>
                        <TouchableOpacity activeOpacity={0.5} onPress={() => handleEraseAllData()} style={styles.buttonErase}>
                            <Text style={{ color: textColor, fontWeight: 'bold' }}>{t('Common:yes')}</Text>
                            <AntDesign name="checkcircle" size={24} color={Colors.green} />
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.5} onPress={() => refRBClearAllSheet.current.close()} style={styles.buttonErase}>
                            <Text style={{ color: textColor, fontWeight: 'bold' }}>{t('Common:no')}</Text>
                            <AntDesign name="closecircle" size={24} color={Colors.validation} />
                        </TouchableOpacity>
                    </View>
                </View>
            </RBSheet>

            <EraseModal
                visible={eraseModalVisible}
                onClose={() => { setEraseModalVisible(false); }}
                onConfirm={() => { }} />

        </View>
    );
}