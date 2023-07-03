import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useSelector } from 'react-redux';
import Colors from '../common/Colors';
import { darkModeColor } from '../common/utils/arrayObjectUtils';

const DropdownComponent = (props) => {

    const { data, setSelectedIndex, setValSelectFoodType } = props;
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    
    const isDarkMode = useSelector(state => state?.settings?.isDarkMode);
    const { backgroundColor, textColor } = darkModeColor(isDarkMode);

    const renderLabel = () => {
        if (value || isFocus) {
            return (
                <Text style={[styles.label, isFocus && { color: 'blue' }]}>
                    Food Category
                </Text>
            );
        }
        return null;
    };

    
    const styles = StyleSheet.create({
        container: {
            backgroundColor: backgroundColor
        },
        dropdown: {
            height: 50,
            borderColor: 'gray',
            borderWidth: 0.5,
            borderRadius: 8,
            paddingHorizontal: 8,
            backgroundColor: backgroundColor
        },
        icon: {
            marginRight: 5
        },
        label: {
            position: 'absolute',
            backgroundColor: textColor,
            left: 22,
            top: 8,
            zIndex: 999,
            paddingHorizontal: 8,
            fontSize: 14,
            backgroundColor: backgroundColor
        },
        placeholderStyle: {
            fontSize: 16,
            color: textColor
        },
        selectedTextStyle: {
            fontSize: 16,
            color: textColor
        },
        iconStyle: {
            width: 20,
            height: 20
        },
        inputSearchStyle: {
            height: 40,
            fontSize: 16
        },
    });

    return (
        <View style={styles.container}>
            {renderLabel()}
            <Dropdown
                // style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                // placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                containerStyle={{ backgroundColor: backgroundColor }}
                // itemContainerStyle={{ backgroundColor: backgroundColor }}
                data={data}
                search
                maxHeight={300}
                itemTextStyle={{ color: textColor }}
                labelField="label"
                valueField="value"
                // placeholder={!isFocus ? 'Select Food Category' : '...'}
                searchPlaceholder="Search..."
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                    setValue(item.value);
                    setIsFocus(false);
                    setSelectedIndex(item.value);
                    setValSelectFoodType('');
                }}
                renderLeftIcon={() => (
                    <AntDesign
                        style={styles.icon}
                        color={isFocus ? 'blue' : 'black'}
                        name="Safety"
                        size={20}
                    />
                )}
            />
        </View>
    );
};

export default DropdownComponent;