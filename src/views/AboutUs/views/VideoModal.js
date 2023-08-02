import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// Custom Imports
import AssetIconsPack from '../../../assets/IconProvide';
import Colors from '../../../common/Colors';

const VideoModal = (props) => {
    const { navigation } = props;
    const { videoId } = props.route.params;
    const [clicked, setClicked] = useState(false);
    const [paused, setPaused] = useState(false);
    const [progress, setProgress] = useState(null);
    const ref = useRef();

    const format = seconds => {
        let mins = parseInt(seconds / 60).toString().padStart(2, '0');
        let secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    const handleEnd = () => {
        ref.current.seek(0); // Seek to time 0 when the video ends
        setPaused(true); // Pause the video
    };

    useEffect(() => {
        setClicked(true);
    }, []);

    const styles = StyleSheet.create({
        video: {
            width: '100%',
            height: '100%',
        },
        backButton: {
            position: 'absolute',
            top: 20,
            left: 20,
            backgroundColor: clicked ? Colors.primary : Colors.black,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            padding: 7,
        },
        controlBtnContainer: {
            width: '100%',
            height: '100%',
            position: 'absolute',
            backgroundColor: 'rgba(0,0,0,.5)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        seekContainer: {
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            position: 'absolute',
            bottom: 0,
            paddingLeft: 20,
            paddingRight: 20,
            alignItems: 'center'
        }
    });

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity style={styles.video} onPress={() => setClicked(true)}>
                <Video
                    paused={paused}
                    source={videoId}
                    ref={ref}
                    onProgress={x => setProgress(x)}
                    onEnd={handleEnd}
                    muted
                    style={styles.video}
                    resizeMode="contain"
                />
                {clicked && (
                    <TouchableOpacity onPress={() => setClicked(false)} style={styles.controlBtnContainer}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', width: '100%' }}>
                            <TouchableOpacity onPress={() => ref.current.seek(parseInt(progress?.currentTime) - 10)}>
                                <MaterialIcons name="replay-10" size={40} color={Colors.info} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setPaused(!paused)}>
                                <AntDesign name={paused ? "play" : "pausecircle"} size={40} color={Colors.info} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => ref.current.seek(parseInt(progress?.currentTime) + 10)}>
                                <MaterialIcons name="forward-10" size={40} color={Colors.info} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.seekContainer}>
                            <Text style={{ color: 'white' }}>{format(progress?.currentTime)}</Text>
                            <Slider
                                style={{ width: '80%', height: 40 }}
                                minimumValue={0}
                                maximumValue={progress?.seekableDuration || 0}
                                minimumTrackTintColor="#FFFFFF"
                                maximumTrackTintColor="#fff"
                                onValueChange={(x) => {
                                    setProgress((prevProgress) => ({
                                        ...prevProgress,
                                        currentTime: x,
                                    }));
                                }}
                                onSlidingComplete={(x) => {
                                    setPaused(true); // Pause the video
                                    ref.current.seek(x); // Seek to the selected time
                                    setPaused(false); // Resume video playback
                                }}
                                value={progress?.currentTime || 0}
                            />
                            <Text style={{ color: 'white' }}>{format(progress?.seekableDuration)}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack(null)}>
                <AntDesign name="closecircle" size={14} color={clicked ? Colors.black : Colors.primary} />
                <Text style={{ color: clicked ? Colors.black : Colors.primary, paddingLeft: 5, fontWeight: '500', fontSize: 11 }}>EXIT VIDEO</Text>
            </TouchableOpacity>
        </View>
    );
};

export default VideoModal;