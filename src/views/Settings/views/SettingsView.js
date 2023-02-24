import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import RBSheet from "react-native-raw-bottom-sheet";
import { useTranslation } from "react-i18next";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import { ROUTE_KEYS } from '../../../navigation/constants';
import Colors from '../../../common/Colors';
import { convertHeight, convertWidth } from '../../../common/utils/dimentionUtils';
import { List } from '../../../components';
import { languagesInitialValue } from '../../../common/translation/constant';
import { toggleDarkMode } from '../settingsSlice';
// import DarkTheme from '../../../common/styles/darkTheme';
// import LightTheme from '../../../common/styles/lightTheme';

export default function SettingsView(props) {
    const { i18n, t } = useTranslation();
    const refRBSheet = useRef();
    const refRBThemeSheet = useRef();
    const dispatch = useDispatch();
    const isDarkMode = useSelector(state => state?.settings?.isDarkMode);

    // const colorTheme = isDarkMode ? DarkTheme : LightTheme;

    const backgroundColor = isDarkMode ? Colors.black : Colors.primary;
    const textColor = isDarkMode ? Colors.primary : Colors.black;

    const onChangeLanguage = (lang) => {
        refRBSheet.current.close()
        i18n.changeLanguage(lang);
        props.navigation.navigate(ROUTE_KEYS.DASHBOARD_SCREEN);
    }

    const renderItem = (item) => {
        return (
            <TouchableOpacity activeOpacity={0.9} onPress={() => onChangeLanguage(item.languageCode)} style={[styles.button, { backgroundColor: isDarkMode ? '#2c2c2e' : Colors.primary }]}>
                <Text style={{ color: textColor, fontWeight: 'bold' }}>{t(`Languages:${item?.language}`)}</Text>
                {i18n.language === item.languageCode &&
                    <AntDesign name="checkcircle" size={24} color={isDarkMode ? Colors.primary : Colors.green} />
                }
            </TouchableOpacity>
        )
    }

    const handleToggleDarkMode = () => {
        dispatch(toggleDarkMode());
        refRBThemeSheet.current.close()
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
        }
    });

    return (
        <View style={styles.mainContainer}>
            <StatusBar backgroundColor={backgroundColor} barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            
            <TouchableOpacity style={styles.button} onPress={() => refRBSheet.current.open()}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FontAwesome name="language" size={24} color={textColor} />
                    <Text style={{ color: textColor, paddingLeft: convertWidth(12) }}>{t('Settings:changelanguage')}</Text>
                </View>
                <Ionicons name="md-chevron-forward-sharp" size={24} color={textColor} />
            </TouchableOpacity>

            {/* <TouchableOpacity style={styles.button} onPress={() => refRBThemeSheet.current.open()}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="color-palette-sharp" size={24} color={textColor} />
                    <Text style={{ color: textColor, paddingLeft: convertWidth(10) }}>{t('Settings:theme')}</Text>
                </View>
                <Ionicons name="md-chevron-forward-sharp" size={24} color={textColor} />
            </TouchableOpacity> */}

            <RBSheet
                height={convertHeight(223)} ref={refRBSheet}
                closeOnDragDown={true} closeOnPressMask={false}
                customStyles={{ 
                    draggableIcon: { backgroundColor: textColor }, 
                    container: { 
                        backgroundColor: isDarkMode ? '#2c2c2e' : Colors.primary
                    } 
                }}>
                <List data={languagesInitialValue} renderItem={({ item }) => renderItem(item)} />
            </RBSheet>

            <RBSheet
                height={convertHeight(127)} ref={refRBThemeSheet}
                closeOnDragDown={true} closeOnPressMask={false}
                customStyles={{ 
                    draggableIcon: { backgroundColor: textColor }, 
                    container: { 
                        backgroundColor: isDarkMode ? '#2c2c2e' : Colors.primary
                        // backgroundColor: colorTheme['primary']
                    } 
                }}>
                <View>

                    <TouchableOpacity disabled={isDarkMode} onPress={() => handleToggleDarkMode()} style={[styles.button, { backgroundColor: isDarkMode ? '#2c2c2e' : Colors.primary }]}>
                        <Text style={{ color: textColor, fontWeight: 'bold' }}>{'Dark'}</Text>
                        {isDarkMode && <AntDesign name="checkcircle" size={24} color={Colors.primary} />}
                    </TouchableOpacity>

                    <TouchableOpacity disabled={!isDarkMode} onPress={() => handleToggleDarkMode()} style={[styles.button, { backgroundColor: isDarkMode ? '#2c2c2e' : Colors.primary }]}>
                        <Text style={{ color: textColor, fontWeight: 'bold' }}>{'Light'}</Text>
                        {!isDarkMode && <AntDesign name="checkcircle" size={24} color={Colors.green} />}
                    </TouchableOpacity>
                    
                </View>
            </RBSheet>
        </View>
    )
}