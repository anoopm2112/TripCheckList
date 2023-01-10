import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text, SafeAreaView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';

export default function Header({ title }) {

    const style = StyleSheet.create({
        header: {
            paddingVertical: 15,
            paddingHorizontal: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'white'
        },
    });

    return (
        <SafeAreaView>
            <View style={style.header}>
                <TouchableOpacity onPress={() => { }}>
                    <IoniconsIcon name="chevron-back" style={{ fontSize: 28, color: '#000000' }} />
                </TouchableOpacity>
                <Text style={{ color: '#000000', fontSize: 24 }}>{title}</Text>
                <View />
            </View>
        </SafeAreaView>
    )
}