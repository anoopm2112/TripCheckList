import React from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import Video from 'react-native-video';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Colors from '../../../common/Colors';
import AssetIconsPack from '../../../assets/IconProvide';

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
        },
        backButton: {
            position: 'absolute', 
            top: 40, height: 40, 
            left: 20,
            width: 40, 
            backgroundColor: Colors.primary, 
            borderRadius: 50,
            justifyContent: 'center', 
            alignItems: 'center'
        }
    });

    return (
        <>
            <StatusBar backgroundColor={'rgba(0,0,0,0.5)'} barStyle={'dark-content'} />
            <View style={styles.container}>
                <Video
                    source={AssetIconsPack.icons.toursit_video}
                    style={styles.video}
                    controls={true}
                    resizeMode='contain'
                />
            </View>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack(null)}>
                <EvilIcons name="close" size={34} color="black" />
            </TouchableOpacity>
        </>
    );
};

export default VideoModal;
