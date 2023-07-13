import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, StatusBar } from 'react-native';
import { Input, Button } from '@ui-kitten/components';
import Lottie from 'lottie-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux';
import * as Animatable from 'react-native-animatable';
// Custom Imports
import { ROUTE_KEYS } from '../../../navigation/constants';
import COLORS from '../../../common/Colors';
import { convertHeight, convertWidth } from '../../../common/utils/dimentionUtils';
import { localTimeConvertion } from '../../../common/utils/timeDateUtils';
import AssetIconsPack from '../../../assets/IconProvide';
import { darkModeColor } from '../../../common/utils/arrayObjectUtils';

export default function WriteUpAboutTripView(props) {
    const { navigation } = props;
    const { t } = useTranslation();
    const isDarkMode = useSelector(state => state?.settings?.isDarkMode);
    const { backgroundColor, textColor } = darkModeColor(isDarkMode);

    // Input State
    const [value, setValue] = useState('');

    // date & time Picker State
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [showTime, setShowTime] = useState(false);

    // Validation State
    const [valTextInput, setValTextInput] = useState(false);
    const [valDateTime, setValDateTime] = useState(false);

    useEffect(() => {
        return () => {
            setTime(new Date())
        }
    }, []);

    const onChange = (event, selectedValue) => {
        setShowTime(localTimeConvertion(selectedValue));
        setShow(Platform.OS === 'ios');
        if (mode == 'date') {
            const currentDate = selectedValue || new Date();
            setDate(currentDate);
            setMode('time');
            setShow(Platform.OS !== 'ios');
        } else {
            const selectedTime = selectedValue || new Date();
            setTime(selectedTime);
            setShow(Platform.OS === 'ios');
            setMode('date');
        }
        setValDateTime(false);
    };

    const showMode = currentMode => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };


    const styles = StyleSheet.create({
        mainContainer: {
            flex: 1,
            backgroundColor: backgroundColor
        },
        reminderBtn: {
            width: '100%',
            marginVertical: convertHeight(20)
        },
        subContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        },
        txtStyle: {
            color: textColor,
            fontWeight: 'bold',
            fontSize: convertHeight(12)
        },
        errortxt: {
            color: COLORS.validation,
            fontStyle: 'italic',
            textAlign: 'center'
        },
        buttonViewContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            borderRadius: 50,
            width: '48%',
            borderWidth: 0.5,
            borderColor: COLORS.info,
            marginTop: 25,
            elevation: 3
        },
        textBtnSplit: {
            flex: 1,
            textAlign: 'center',
            fontWeight: '500',
            textTransform: 'uppercase',
            fontSize: convertHeight(9),
            paddingHorizontal: 1
        },
        reminderIconContainer: {
            height: convertHeight(35), 
            width: convertHeight(35), 
            borderRadius: convertHeight(45), 
            justifyContent: 'center',
            alignItems: 'center', 
            backgroundColor: COLORS.tertiary
        }
    });

    onWriteUpSubmit = () => {
        if (value == '') {
            setValTextInput(true);
        } else if (showTime == "") {
            setValDateTime(true);
        } else {
            navigation.navigate(ROUTE_KEYS.CHECK_ITEM_ADD, { textData: value, ReminderTime: time });
        }
    }

    return (
        <View style={styles.mainContainer}>
            <StatusBar backgroundColor={backgroundColor} barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <View style={styles.subContainer}>
                <Text style={styles.txtStyle}>{t('checklist:pack_your_bag')}</Text>
                <Lottie source={AssetIconsPack.icons.write_up_icon} autoPlay loop
                    style={{ height: convertHeight(170), width: convertWidth(170) }} />
                <>
                    <Ionicons name="alarm" size={convertHeight(20)} color={showTime ? COLORS.tertiary : valDateTime ? COLORS.validation : textColor} />
                    {
                        showTime ?
                            <Text style={[styles.txtStyle, { color: COLORS.tertiary }]}>{showTime}</Text> :
                            valDateTime ?
                                <Animatable.Text animation="tada" style={styles.errortxt}>{t('checklist:return_val')}</Animatable.Text> :
                                <Text style={[styles.errortxt, { color: textColor, textTransform: 'uppercase', fontWeight: '500' }]}>{t('checklist:return_val')}</Text>
                    }
                </>
            </View>

            <View style={{ flex: 1, paddingHorizontal: convertWidth(18), paddingTop: convertHeight(25) }}>
                <Input
                    placeholder={t('checklist:input_placeholder')}
                    value={value}
                    onChangeText={nextValue => {
                        setValue(nextValue)
                        setValTextInput(false);
                    }}
                    style={{ backgroundColor: isDarkMode ? '#333333' : '#f5f5f5' }}
                    multiline={true}
                    textStyle={{ minHeight: convertHeight(30), color: textColor }}
                    accessoryRight={
                        <TouchableOpacity onPress={showDatepicker}>
                            <AntDesign name="edit" size={convertHeight(20)} color={'#b3afa8'} />
                        </TouchableOpacity>
                    }
                />
                {valTextInput && <Text style={styles.errortxt}>{t('checklist:input_val')}</Text>}

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={showDatepicker} activeOpacity={0.8}
                        style={[styles.buttonViewContainer, { backgroundColor: '#69c1ff' }]}>
                        <Text style={[styles.textBtnSplit, { color: COLORS.primary }]}>{t('checklist:checklist_reminder')}</Text>
                        <View style={styles.reminderIconContainer}>
                            <Ionicons name="alarm" size={convertHeight(20)} color={COLORS.primary} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { onWriteUpSubmit() }} activeOpacity={0.8}
                        style={[styles.buttonViewContainer, { backgroundColor: COLORS.secondary }]}>
                        <Text style={[styles.textBtnSplit, { color: COLORS.primary }]}>{t('Common:submit')}</Text>
                        <View style={[styles.reminderIconContainer, { backgroundColor: '#fa4e28' }]}>
                            <Ionicons name="checkmark-sharp" size={convertHeight(20)} color={COLORS.primary} />
                        </View>
                    </TouchableOpacity>

                </View>

                {/* <Button onPress={() => { onWriteUpSubmit() }} style={[styles.reminderBtn, {
                    backgroundColor: COLORS.secondary, borderColor: COLORS.secondary
                }]}>{t('Common:submit')}</Button> */}

                {show && (
                    <DateTimePicker
                        testID='dateTimePicker'
                        timeZoneOffsetInMinutes={0}
                        value={date}
                        mode={mode}
                        is24Hour={false}
                        display='spinner'
                        onChange={onChange}
                    />
                )}
            </View>
        </View>
    )
}