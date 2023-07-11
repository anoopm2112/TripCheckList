import React from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import Video from 'react-native-video';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Colors from '../../../common/Colors';

const VideoModal = (props) => {
    const { navigation } = props;

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            alignItems: 'center',
            justifyContent: 'center',
        },
        video: {
            width: '100%',
            height: '100%',
            // backgroundColor: '#000',
        }
    });

    return (
        <>
            <StatusBar backgroundColor={'rgba(0,0,0,0.5)'} barStyle={'dark-content'} />
            <View style={styles.container}>
                <Video
                    source={require('../../../assets/Record_2023-07-04-14-27-38.mp4')}
                    style={styles.video}
                    controls={true}
                    resizeMode='contain'
                />
            </View>
            <TouchableOpacity style={{
                position: 'absolute', top: 10, height: 40, left: 20,
                width: 40, backgroundColor: Colors.primary, borderRadius: 50,
                justifyContent: 'center', alignItems: 'center'
            }} onPress={() => navigation.goBack(null)}>
                <EvilIcons name="close" size={34} color="black" />
            </TouchableOpacity>
        </>
    );
};

export default VideoModal;
