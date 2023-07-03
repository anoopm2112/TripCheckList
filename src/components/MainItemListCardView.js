import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux';
// Custom Imports
import COLORS from '../common/Colors';
import { localTimeConvertion } from '../common/utils/timeDateUtils';
import { convertHeight, convertWidth } from '../common/utils/dimentionUtils';
import AssetIconsPack from '../assets/IconProvide';
import CustomPopup from './CustomPopup';
import { darkModeColor } from '../common/utils/arrayObjectUtils';

export default function MainItemListCardView(props) {
    const { item, removeParticularItem, navigationToNext, navigationToEdit, history } = props;

    const [randomImage, setRandomImage] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const { t } = useTranslation();

    const isDarkMode = useSelector(state => state?.settings?.isDarkMode);
    const { backgroundColor, textColor } = darkModeColor(isDarkMode);

    const renderImage = () => {
        const myImages = [
            { image: AssetIconsPack.icons.checklist_clothes_image },
            { image: AssetIconsPack.icons.checklist_clothes_two_image },
            { image: AssetIconsPack.icons.checklist_item_no_image },
        ];
        const randomImageIndex = Math.floor(Math.random() * Math.floor(3));
        return myImages[randomImageIndex].image;
    };

    useEffect(() => {
        setRandomImage(renderImage);
    })

    const Styles = StyleSheet.create({
        mainContainer: {
            marginHorizontal: convertHeight(10),
            marginVertical: convertHeight(5),
            elevation: 5,
            backgroundColor: backgroundColor,
            borderRadius: 3,
            borderWidth: 0.5,
            borderColor: COLORS.primary
        },
        deleteBtnContainer: {
            backgroundColor: 'red',
            height: convertHeight(35),
            width: convertWidth(40),
            justifyContent: 'center',
            alignItems: 'center',
            borderTopRightRadius: 8,
            borderBottomLeftRadius: 3
        },
        editBtnContainer: {
            backgroundColor: 'green',
            height: convertHeight(35),
            width: convertWidth(40),
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomRightRadius: 3,
            borderTopLeftRadius: 8
        },
        titleTxt: {
            color: textColor,
            fontWeight: 'bold',
            width: convertWidth(290),
            paddingLeft: convertWidth(7)
        },
        itemsContainer: {
            width: convertWidth(40),
            justifyContent: 'center',
            alignItems: 'center',
            padding: 3,
        }
    });

    const deleteItem = () => {
        setAlertVisible(true)
    }

    return (
        <>
        <TouchableOpacity style={Styles.mainContainer} onPress={() => navigationToNext()}>
            <ImageBackground imageStyle={{ opacity: 0.2 }} source={renderImage()}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={Styles.titleTxt}>{item.title}</Text>
                    <View style={Styles.itemsContainer}>
                        <Text style={{ color: textColor, fontSize: convertHeight(8) }}>{t('Common:items')}</Text>
                        <Text style={{ color: textColor, fontWeight: 'bold', fontSize: convertHeight(20) }}>{item.checkListItems.length}</Text>
                    </View>
                </View>

                {!history &&
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity style={Styles.deleteBtnContainer} onPress={() => deleteItem(item)}>
                            <MaterialIcons name="delete" size={convertHeight(20)} color="white" />
                        </TouchableOpacity>
                        <View style={{ alignItems: 'center' }}>
                            <Ionicons name="alarm" size={convertHeight(15)} color={COLORS.tertiary} />
                            <Text style={{ color: textColor, fontSize: convertHeight(10), fontWeight: 'bold' }}>
                                {localTimeConvertion(item.ReminderTime)}
                            </Text>
                        </View>
                        <TouchableOpacity style={Styles.editBtnContainer} onPress={() => navigationToEdit(item)}>
                            <AntDesign name="edit" size={convertHeight(20)} color="white" />
                        </TouchableOpacity>
                    </View>
                }
            </ImageBackground>
        </TouchableOpacity>
            <CustomPopup
                title={'Common:deleteItem'} message={'Common:please_confirm'}
                visible={alertVisible} onClose={() => setAlertVisible(false)}
                onConfirm={() => removeParticularItem(item.id)} />
        </>
    )
}