import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Input, Button } from '@ui-kitten/components';
import Lottie from 'lottie-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
// Custom Imports
import { ROUTE_KEYS } from '../../navigation/constants';
import COLORS from '../../common/Colors';
import { convertHeight, convertWidth } from '../../common/utils/dimentionUtils';
import { localTimeConvertion } from '../../common/utils/timeDateUtils';
import EN_IN from '../../common/languages/en_IN';
import AssetIconsPack from '../../assets/IconProvide';

export default function WriteUpAboutTripView(props) {
    const { navigation } = props;

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
            backgroundColor: COLORS.primary
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
            color: COLORS.black,
            fontWeight: 'bold',
            fontSize: convertHeight(12)
        },
        errortxt: {
            color: COLORS.validation,
            fontStyle: 'italic',
            textAlign: 'center'
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
            <View style={styles.subContainer}>
                <Text style={styles.txtStyle}>{EN_IN.pack_your_bag}</Text>
                <Lottie source={AssetIconsPack.icons.write_up_icon} autoPlay loop
                    style={{ height: convertHeight(170), width: convertWidth(170) }} />
                {showTime &&
                    <>
                        <Ionicons name="alarm" size={convertHeight(20)} color={COLORS.black} />
                        <Text style={styles.txtStyle}>{showTime}</Text>
                    </>
                }
            </View>

            <View style={{ flex: 1, paddingHorizontal: convertWidth(18), justifyContent: 'center' }}>
                <Input
                    placeholder={EN_IN.input_placeholder}
                    value={value}
                    onChangeText={nextValue => {
                        setValue(nextValue)
                        setValTextInput(false);
                    }}
                    multiline={true}
                    textStyle={{ minHeight: convertHeight(30) }}
                    accessoryRight={
                        <TouchableOpacity onPress={showDatepicker}>
                            <Ionicons name="alarm" size={convertHeight(20)} color={COLORS.tertiary} />
                        </TouchableOpacity>
                    }
                />
                {valTextInput && <Text style={styles.errortxt}>{EN_IN.input_val}</Text>}
                {valDateTime && <Text style={styles.errortxt}>{EN_IN.return_val}</Text>}

                <Button onPress={() => { onWriteUpSubmit() }} style={[styles.reminderBtn, {
                    backgroundColor: COLORS.secondary, borderColor: COLORS.secondary
                }]}>{EN_IN.submit}</Button>

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