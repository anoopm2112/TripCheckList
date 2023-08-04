import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { Input, List } from '@ui-kitten/components';
import { useSelector } from 'react-redux';
import COLORS from '../common/Colors';
import { convertHeight, convertWidth } from '../common/utils/dimentionUtils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as Animatable from 'react-native-animatable';
import { useTranslation } from "react-i18next";
import { darkModeColor } from '../common/utils/arrayObjectUtils';

export default function NoteModal(props) {
    const { visible, onClose, value, setNoteValue, submitFun, viewType, notesItem, deleteNote } = props;

    const visibleItem = visible || false;
    const [showView, setShowView] = useState(visibleItem);
    const viewAnimation = useRef(null);
    const { t } = useTranslation();

    const isDarkMode = useSelector(state => state?.settings?.isDarkMode);
    const { backgroundLiteColor, backgroundColor, textColor } = darkModeColor(isDarkMode);

    useEffect(() => {
        const Animation = async () => {
            if (visibleItem) {
                setShowView(true);
                if (viewAnimation.current)
                    await viewAnimation.current.fadeInLeft(2000);
            } else {
                if (viewAnimation.current)
                    await viewAnimation.current.fadeOutRightBig(1000);
                setShowView(false)
            }
        }
        Animation();
    }, [visibleItem, viewAnimation]);

    const renderItem = ({ item, index }) => {
        return (
            <View style={styles.listItemContainer}>
                <Text style={{ color: textColor, width: '85%', textAlign: 'justify' }}>{item.note}</Text>
                {/* <TouchableOpacity onPress={() => { deleteNote(item.id) }}>
                    <Ionicons name="remove-circle-sharp" size={convertHeight(24)} color={COLORS.lightRed} />
                </TouchableOpacity> */}
            </View>
        )
    };

    const styles = StyleSheet.create({
        centeredView: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.7)'
        },
        modalView: {
            margin: convertHeight(20),
            backgroundColor: backgroundColor,
            borderRadius: 5,
            padding: convertHeight(5),
            alignItems: 'center',
            elevation: 5,
        },
        modalText: {
            textAlign: 'center',
            fontWeight: 'bold',
            paddingTop: convertHeight(10),
            color: textColor
        },
        noteSubmitBtn: {
            backgroundColor: COLORS.tertiary,
            elevation: 5,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
            padding: convertWidth(9),
            marginBottom: convertHeight(10)
        },
        listItemContainer: {
            elevation: 5,
            backgroundColor: backgroundLiteColor,
            borderRadius: 2,
            margin: convertHeight(5),
            padding: convertWidth(5),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        headerContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: convertWidth(25),
            paddingHorizontal: convertWidth(25),
            alignItems: 'center'
        }
    });

    return (
        <View>
            <Modal
                animationType={!viewType ? "slide" : "none"}
                transparent={true}
                visible={showView}
                onRequestClose={() => { onClose() }}>
                <>
                    {viewType ?
                        <View style={styles.centeredView}>
                            <Animatable.View animation={'fadeInLeftBig'} ref={viewAnimation} style={styles.modalView}>
                                {showView &&
                                    <View>
                                        <Text style={styles.modalText}>{t('Splitwise:trip_writeup')}</Text>
                                        <Input
                                            placeholder={t('Splitwise:input_writeTrip')}
                                            style={{ padding: convertHeight(15), backgroundColor: isDarkMode ? '#333333' : '#f5f5f5' }}
                                            value={value}
                                            onChangeText={nextValue => {
                                                setNoteValue(nextValue)
                                            }}
                                            multiline={true}
                                            textStyle={{ minHeight: convertHeight(100), color: textColor }} />
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                            <TouchableOpacity style={[styles.noteSubmitBtn, { backgroundColor: COLORS.secondary }]} onPress={() => { onClose() }}>
                                                <Text style={{ color: COLORS.primary }}>{t('Common:cancel')}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.noteSubmitBtn} onPress={() => { submitFun() }}>
                                                <Text style={{ color: COLORS.primary }}>{t('Common:submit')}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>}
                            </Animatable.View>
                        </View>
                        :
                        <View style={{ backgroundColor: backgroundColor, flex: 1 }}>
                            {notesItem?.length > 0 ?
                                <>
                                    <View style={styles.headerContainer}>
                                        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: textColor }}>{t('Splitwise:notes')}</Text>
                                        <TouchableOpacity onPress={() => onClose()}>
                                            <AntDesign name="closecircle" size={24} color={textColor} />
                                        </TouchableOpacity>
                                    </View>
                                    <List data={notesItem} renderItem={renderItem} style={{ padding: convertHeight(10), backgroundColor: backgroundColor }} />
                                </>
                                :
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', color: textColor }}>{t('Splitwise:no_notes')}</Text>
                                    <TouchableOpacity style={{ paddingTop: convertHeight(8) }} onPress={() => onClose()}>
                                        <AntDesign name="closecircle" size={24} color={textColor} />
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>
                    }
                </>
            </Modal>
        </View>
    )
}