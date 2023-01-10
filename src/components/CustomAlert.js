import React from 'react';
import {
    StyleSheet,
    Modal,
    View,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native';
// import PropTypes from 'prop-types';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Foundation from 'react-native-vector-icons/Foundation';
// import Colors from './AppColors';

export default function CustomAlert(props) {
    const {
        onNegativeButtonPress,
        onPositiveButtonPress,
        alertMessageText, visible
    } = props;

    // const onNegativeButtonPress = () => {
    //     props.onPressNegativeButton();
    // };

    // const onPositiveButtonPress = () => {
    //     props.onPressPositiveButton();
    // };

    const styles = StyleSheet.create({
        mainOuterComponent: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#00000088',
        },
        mainContainer: {
            flexDirection: 'column',
            height: '25%',
            width: '80%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 5,
            padding: 4,
        },
        topPart: {
            flex: 1,
            width: '100%',
            flexDirection: 'row',
            paddingVertical: 4,
            // backgroundColor:'red',
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
        },
        middlePart: {
            flex: 1,
            width: '100%',
            padding: 4,
            color: '#FFFFFF',
            fontSize: 16,
            marginVertical: 2,
        },
        bottomPart: {
            flex: 0.5,
            width: '100%',
            flexDirection: 'row',
            padding: 4,
            justifyContent: 'space-evenly',
        },
        alertIconStyle: {
            height: 35,
            width: 35,
        },
        alertTitleTextStyle: {
            flex: 1,
            color: '#FFF',
            textAlign: 'justify',
            fontSize: 18,
            fontWeight: 'bold',
            marginHorizontal: 2,
            paddingHorizontal: 5,
            paddingVertical: 2,
        },
        alertMessageTextStyle: {
            color: '#626567',
            textAlign: 'center',
            fontSize: 16,
            paddingHorizontal: 6,
            paddingVertical: 2
        },
        alertMessageButtonStyle: {
            width: '30%',
            paddingHorizontal: 6,
            marginVertical: 4,
            borderRadius: 10,
            // backgroundColor: 'red',
            justifyContent: 'center',
            alignItems: 'center',
        },
        alertMessageButtonTextStyle: {
            fontSize: 14,
            fontWeight: 'bold',
            color: '#000',
        },
    });

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType={'fade'}>
            <View style={styles.mainOuterComponent}>
                <View style={styles.mainContainer}>
                    {/* First ROw - Alert Icon and Title */}
                    <View
                        style={[
                            styles.topPart,
                            {
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 10,
                            },
                        ]}>
                        {/* <AntDesign
                            name={'stepforward'}
                            size={54}
                            color={'white'}
                            style={{ paddingRight: 5 }}
                        /> */}
                        <Foundation name="alert" size={54} color="orange" />
                    </View>

                    {/* Second Row - Alert Message Text */}
                    <View
                        style={[
                            styles.middlePart,
                            { justifyContent: 'center', alignItems: 'center' },
                        ]}>
                        <Text style={styles.alertMessageTextStyle}>
                            {`${alertMessageText}`}
                        </Text>
                    </View>

                    {/* Third Row - Positive and Negative Button */}
                    <View
                        style={[
                            styles.bottomPart,
                            { justifyContent: 'center', paddingBottom: 20, justifyContent: 'space-evenly' },
                        ]}>
                        <TouchableOpacity
                            onPress={onNegativeButtonPress}
                            style={[
                                styles.alertMessageButtonStyle,
                                {
                                    // backgroundColor: 'skyblue',
                                    height: 30,
                                },
                            ]}>
                            <Text style={styles.alertMessageButtonTextStyle}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onPositiveButtonPress}
                            style={[
                                styles.alertMessageButtonStyle,
                                {
                                    // backgroundColor: 'skyblue',
                                    height: 30,
                                },
                            ]}>
                            <Text style={styles.alertMessageButtonTextStyle}>
                                Ok
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
