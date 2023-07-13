import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated, Alert } from 'react-native';
import { List, Button } from '@ui-kitten/components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RBSheet from "react-native-raw-bottom-sheet";
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import "react-native-get-random-values";
import { v4 as uuidv4 } from 'uuid';
import * as Animatable from 'react-native-animatable';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
// Custom Import
import COLORS from '../common/Colors';
import { convertHeight, convertWidth } from '../common/utils/dimentionUtils';
import { darkModeColor, getAddedAmountArray } from '../common/utils/arrayObjectUtils';
import { htmltable } from '../common/pdfView';
import InvoiceModal from './InvoiceModal';
import { deleteNoteById, fetchNotes, updateSplitwise } from '../views/SplitWise/api/SplitWiseApi';
import NoteModal from './NoteModal';
import { selectAllSplitwises } from '../views/SplitWise/splitwiseSlice';
import CustomPopup from './CustomPopup';
import Colors from '../common/Colors';

export default function MainItemSplitWiseListCard(props) {
    const { item, spliupAmount, navigationToEdit, removeParticularItem } = props;
    const { notes, status, error } = useSelector(selectAllSplitwises);
    const refRBSheet = useRef();
    const swipeableRef = useRef(null);
    const isFocuesd = useIsFocused();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const isDarkMode = useSelector(state => state?.settings?.isDarkMode);

    const { backgroundColor, textColor } = darkModeColor(isDarkMode);

    const [pdfModalVisible, setPdfModalVisible] = useState(false);
    const [generateBillLocation, setGenerateBillLocation] = useState('');
    const [alertVisible, setAlertVisible] = useState(false)

    // Note Modal States
    const [modalVisible, setModalVisible] = useState(false);
    const [noteValue, setNoteValue] = useState('');
    const [noteType, setNoteType] = useState(false);

    useEffect(() => {
        const GetParticularSplitWiseNoteList = async () => {
            dispatch(fetchNotes({ id: item.id }));
        }
        GetParticularSplitWiseNoteList(item.id);
    }, [isFocuesd, modalVisible, dispatch]);

    const styles = StyleSheet.create({
        listItemContainer: {
            elevation: 5,
            backgroundColor: backgroundColor,
            alignItems: 'center',
            height: convertHeight(80),
            borderBottomWidth: 2,
            borderBottomColor: isDarkMode ? '#2E2E2E' : '#e5e5e5'
        },
        editBtnContainer: {
            backgroundColor: COLORS.lightGreen,
            height: '100%',
            width: '15%',
            justifyContent: 'center',
            alignItems: 'center'
        },
        deleteBtnContainer: {
            backgroundColor: COLORS.lightRed,
            height: '100%',
            width: '15%',
            justifyContent: 'center',
            alignItems: 'center'
        },
        label: {
            textAlign: 'center',
            fontWeight: 'bold',
            color: textColor,
            fontSize: convertHeight(20)
        },
        labelContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1
        },
        subItemContainer: {
            padding: convertHeight(5),
            margin: convertWidth(10),
            backgroundColor: isDarkMode ? '#2E2E2E' : COLORS.primary,
            elevation: 5,
            width: convertWidth(160),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5
        },
        bottomScroll: {
            fontSize: convertHeight(12),
            fontWeight: 'bold',
            padding: convertHeight(3),
            color: textColor
        },
        actionBox: {
            justifyContent: 'center',
            alignItems: 'center',
            width: 100,
            height: convertHeight(80),
        },
        splitTile: { 
            color: textColor, 
            textAlign: 'center',
            fontWeight: '800',
            textTransform: 'uppercase'
        }
    });

    const renderItemSplitMembers = ({ item }) => {
        let balance = item.totalAmount;

        return (
            <TouchableOpacity activeOpacity={10} style={styles.subItemContainer}>
                <Text style={styles.bottomScroll}>{item.name} {t('Splitwise:paid_total')}</Text>
                <Text style={[styles.bottomScroll, { color: textColor, fontSize: convertHeight(15) }]}>{item.paid} RS</Text>
                <Text style={{
                    fontSize: convertHeight(12), fontWeight: 'bold', padding: convertHeight(3),
                    color: Math.sign(balance) == 1 ? '#3CE911' : Math.sign(balance) == 0 ? COLORS.tertiary : COLORS.validation
                }}>{`${Math.sign(balance) == 1 ? t('Splitwise:need') : t('Splitwise:give_back')}`}</Text>
                <Text style={[styles.bottomScroll, { color: Math.sign(balance) == 1 ? '#3CE911' : Math.sign(balance) == 0 ? COLORS.tertiary : COLORS.validation, fontSize: convertHeight(18) }]}>{`${Math.abs(balance.toFixed())} rs`}</Text>
            </TouchableOpacity>
        )
    };

    const tryTodelete = (item) => {
        setAlertVisible(true);
    }

    const createPDF = async () => {
        const resultData = await htmltable(item?.splitWiseListItems);

        let options = {
            html: resultData,
            fileName: 'test',
            // directory: 'Documents',
            base64: true
        };

        let file = await RNHTMLtoPDF.convert(options);
        setGenerateBillLocation(file.filePath);
        setPdfModalVisible(true);
    }

    const ButtonComponent = (props) => {
        return (
            <TouchableOpacity onPress={() => {
                props.onPressHandler();
                swipeableRef.current.close();
            }} activeOpacity={0.6}>
                <View style={[styles.actionBox, { backgroundColor: props.backgroundColor }]}>
                    <MaterialIcons name={props.iconname} size={convertHeight(20)} color={props.iconColor} />
                    <Animated.Text style={{ fontWeight: '500', textTransform: 'uppercase', fontSize: 12, paddingTop: 5, textAlign: 'center', color: props.iconColor, transform: [{ scale: props.scale }] }}>
                        {t(props.name)}
                    </Animated.Text>
                </View>
            </TouchableOpacity>
        );
    }

    const handleNotes = () => {
        setNoteValue('');
        let noteClonedArray = JSON.parse(JSON.stringify(item.notes))
        let noteData = { id: uuidv4(), note: noteValue, creationDate: new Date() }
        noteClonedArray.push(noteData);
        const newSplitWise = {
            id: item.id,
            creationDate: item.creationDate,
            totalAmount: item.totalAmount,
            members: item.members,
            splitWiseListItems: item.splitWiseListItems,
            notes: noteClonedArray
        }

        dispatch(updateSplitwise(newSplitWise));
        setModalVisible(false);
    }

    const leftSwipe = (progress, dragX) => {
        const scale = dragX.interpolate({ inputRange: [0, 50, 100, 101], outputRange: [-20, 0, 0, 1], extrapolate: 'clamp' });
        return (
            <View style={{ flexDirection: 'row' }}>
                <ButtonComponent iconColor={Colors.primary}
                    iconname={'remove-red-eye'} onPressHandler={() => refRBSheet.current.open()}
                    backgroundColor={COLORS.secondary} name={'Splitwise:view_split'} scale={scale} />
                <ButtonComponent iconColor={Colors.primary}
                    iconname={'notes'} onPressHandler={() => {
                        setModalVisible(true)
                        setNoteType(false)
                    }}
                    backgroundColor={COLORS.paleGreen} name={'Splitwise:view_notes'} scale={scale} />
            </View>
        );
    };

    const rightSwipe = (progress, dragX) => {
        const scale = dragX.interpolate({ inputRange: [0, 100], outputRange: [1, 0], extrapolate: 'clamp' });
        return (
            <View style={{ flexDirection: 'row' }}>
                <ButtonComponent iconColor={Colors.primary}
                    iconname={'add-box'} onPressHandler={() => navigationToEdit()}
                    backgroundColor={COLORS.tertiary} name={'Splitwise:add_split'} scale={scale} />
                <ButtonComponent iconColor={Colors.primary}
                    iconname={'create'} onPressHandler={() => {
                        setModalVisible(true)
                        setNoteType(true)
                    }}
                    backgroundColor={'#90EE90'} name={'Splitwise:add_notes'} scale={scale} />
                <ButtonComponent
                    iconname={'delete'} iconColor={Colors.validation} onPressHandler={() => tryTodelete(item)}
                    backgroundColor={'#FFCCCB'} name={'Common:delete'} scale={scale} />
                <CustomPopup
                    title={'Common:deleteItem'} message={'Common:please_confirm'}
                    visible={alertVisible} onClose={() => setAlertVisible(false)}
                    onConfirm={() => removeParticularItem(item.id)} />
            </View>
        );
    };

    const deleteNote = (id) => {
        dispatch(deleteNoteById({ id: id }));
    }

    return (
        <Swipeable ref={swipeableRef} renderLeftActions={leftSwipe} renderRightActions={rightSwipe}>
            <View activeOpacity={0.3} style={[styles.listItemContainer]}>
                <View style={{ paddingVertical: convertHeight(7) }}>
                    <Text numberOfLines={1} style={styles.splitTile}>{item.splitTitle}</Text>
                </View>
                <View style={{ flexDirection: 'row', }}>
                    <Animatable.View animation="slideInLeft">
                        <MaterialIcons name={'keyboard-arrow-left'} size={convertHeight(20)} color="#b5b5b5" style={{ paddingLeft: convertWidth(5) }} />
                    </Animatable.View>
                    <View style={styles.labelContainer}>
                        <Text style={{ fontSize: convertHeight(10), color: textColor }}>{t('Splitwise:grand_total')}</Text>
                        <Text style={styles.label}>{item.totalAmount}</Text>
                    </View>
                    <View style={styles.labelContainer}>
                        <Text style={{ fontSize: convertHeight(10), color: textColor }}>{t('Splitwise:members')}</Text>
                        <Text style={styles.label}>{item.members.length}</Text>
                    </View>
                    <View style={styles.labelContainer}>
                        <Text style={{ fontSize: convertHeight(10), color: textColor, textAlign: 'center' }}>{t('Splitwise:added_notes')}</Text>
                        <Text style={styles.label}>{item.notes.length}</Text>
                    </View>
                    <Animatable.View animation="slideInRight">
                        <MaterialIcons name={'keyboard-arrow-right'} size={convertHeight(20)} color="#b5b5b5" style={{ paddingRight: convertWidth(5) }} />
                    </Animatable.View>
                </View>
            </View>
            <RBSheet height={convertHeight(220)} ref={refRBSheet} 
                closeOnDragDown={true}
                customStyles={{ draggableIcon: { backgroundColor: textColor }, container: { backgroundColor: isDarkMode ? '#2E2E2E' : COLORS.primary } }}>
                <List style={{ backgroundColor: backgroundColor }} horizontal data={getAddedAmountArray(item?.splitWiseListItems)} renderItem={({ item }) => renderItemSplitMembers({ item, spliupAmount })} />
                <Button disabled={item?.splitWiseListItems.length == 1} style={{ margin: convertHeight(10) }} onPress={() => { createPDF() }}>{t('Splitwise:generate_view_nvoice')}</Button>
            </RBSheet>
            <InvoiceModal
                pdfModalVisible={pdfModalVisible}
                onClose={() => setPdfModalVisible(false)}
                generateBillLocation={generateBillLocation}
            />
            <NoteModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                value={noteValue}
                setNoteValue={(value) => setNoteValue(value)}
                submitFun={() => handleNotes()}
                viewType={noteType}
                notesItem={notes}
                deleteNote={(id) => deleteNote(id)}
            />
        </Swipeable>
    )
}
