import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import RBSheet from "react-native-raw-bottom-sheet";
import { useTranslation } from "react-i18next";
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ROUTE_KEYS } from '../../../navigation/constants';
import Colors from '../../../common/Colors';
import { convertHeight, convertWidth } from '../../../common/utils/dimentionUtils';
import { List } from '../../../components';
import { languagesInitialValue } from '../../../common/translation/constant';

export default function SettingsView(props) {
    const { i18n, t } = useTranslation();
    const refRBSheet = useRef();

    const onChangeLanguage = (lang) => {
        refRBSheet.current.close()
        i18n.changeLanguage(lang);
        props.navigation.navigate(ROUTE_KEYS.DASHBOARD_SCREEN);
    }

    const renderItem = (item) => {
        return (
            <TouchableOpacity onPress={() => onChangeLanguage(item.languageCode)} style={styles.button}>
                <Text style={{ color: Colors.black, fontWeight: 'bold' }}>{t(`Languages:${item?.language}`)}</Text>
                {i18n.language === item.languageCode &&
                    <AntDesign name="checkcircle" size={24} color={Colors.green} />
                }
            </TouchableOpacity>
        )
    }

    const styles = StyleSheet.create({
        button: {
            backgroundColor: Colors.primary,
            padding: 20,
            marginVertical: 1,
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center'
        }
    });

    return (
        <View>
            <StatusBar backgroundColor={Colors.primary} barStyle='dark-content' />
            <TouchableOpacity style={styles.button} onPress={() => refRBSheet.current.open()}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FontAwesome name="language" size={24} color="black" />
                    <Text style={{ color: Colors.black, paddingLeft: convertWidth(12) }}>{t('Settings:changelanguage')}</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={24} color={Colors.info} />
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.button} onPress={() => refRBSheet.current.open()}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="color-palette-sharp" size={24} color="black" />
                    <Text style={{ color: Colors.black, paddingLeft: convertWidth(10) }}>{'THEME'}</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={24} color={Colors.info} />
            </TouchableOpacity> */}
            <RBSheet
                height={convertHeight(220)} ref={refRBSheet}
                closeOnDragDown={true} closeOnPressMask={false}
                customStyles={{ draggableIcon: { backgroundColor: Colors.black } }}>
                <List data={languagesInitialValue} renderItem={({ item }) => renderItem(item)} />
            </RBSheet>
        </View>
    )
}