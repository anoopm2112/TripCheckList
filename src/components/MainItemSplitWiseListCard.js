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
// Custom Import
import COLORS from '../common/Colors';
import { convertHeight, convertWidth } from '../common/utils/dimentionUtils';
import { getAddedAmountArray } from '../common/utils/arrayObjectUtils';
import { htmltable } from '../common/pdfView';
import InvoiceModal from './InvoiceModal';
import { deleteNoteList, queryGetNoteList, updateSplitWiseList } from '../database/allSchemas';
import NoteModal from './NoteModal';

export default function MainItemSplitWiseListCard(props) {
    const { item, spliupAmount, navigationToEdit, removeParticularItem } = props;
    const refRBSheet = useRef();
    const swipeableRef = useRef(null);

    const [pdfModalVisible, setPdfModalVisible] = useState(false);
    const [generateBillLocation, setGenerateBillLocation] = useState('');

    // Note Modal States
    const [modalVisible, setModalVisible] = useState(false);
    const [noteArray, setNoteArray] = useState([]);
    const [noteValue, setNoteValue] = useState('');
    const [noteType, setNoteType] = useState(false);

    useEffect(() => {
        const GetParticularSplitWiseNoteList = async () => {
            queryGetNoteList(item.id).then((SplitWiseNoteList) => {
                setNoteArray(JSON.parse(JSON.stringify(SplitWiseNoteList)));
            }).catch((error) => {
                setNoteArray([]);
            });
        }
        GetParticularSplitWiseNoteList(item.id);
    }, [modalVisible]);

    const styles = StyleSheet.create({
        listItemContainer: {
            elevation: 5,
            backgroundColor: COLORS.primary,
            alignItems: 'center',
            height: convertHeight(50),
            borderBottomWidth: 2,
            borderBottomColor: '#e5e5e5'
        },
        editBtnContainer: {
            backgroundColor: 'green',
            height: '100%',
            width: '15%',
            justifyContent: 'center',
            alignItems: 'center'
        },
        deleteBtnContainer: {
            backgroundColor: 'red',
            height: '100%',
            width: '15%',
            justifyContent: 'center',
            alignItems: 'center'
        },
        label: {
            textAlign: 'center',
            fontWeight: 'bold',
            color: COLORS.black,
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
            backgroundColor: COLORS.primary,
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
            color: COLORS.black
        },
        actionBox: {
            justifyContent: 'center',
            alignItems: 'center',
            width: 100,
            height: convertHeight(50),
        },
    });

    const renderItemSplitMembers = ({ item }) => {
        let balance = item.totalAmount;

        return (
            <TouchableOpacity activeOpacity={10} style={styles.subItemContainer}>
                <Text style={styles.bottomScroll}>{item.name} paid a total of</Text>
                <Text style={[styles.bottomScroll, { color: COLORS.black, fontSize: convertHeight(15) }]}>{item.paid} RS</Text>
                <Text style={{
                    fontSize: convertHeight(12), fontWeight: 'bold', padding: convertHeight(3),
                    color: Math.sign(balance) == 1 ? '#3CE911' : Math.sign(balance) == 0 ? COLORS.tertiary : COLORS.validation
                }}>{`${Math.sign(balance) == 1 ? 'Need' : 'Give Back'}`}</Text>
                <Text style={[styles.bottomScroll, { color: Math.sign(balance) == 1 ? '#3CE911' : Math.sign(balance) == 0 ? COLORS.tertiary : COLORS.validation, fontSize: convertHeight(18) }]}>{`${Math.abs(balance.toFixed())} rs`}</Text>
            </TouchableOpacity>
        )
    };

    const tryTodelete = (item) => {
        Alert.alert(
            "Do you want to delete this item?",
            "Please confirm",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => removeParticularItem(item.id) }
            ]
        );
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
                    <MaterialIcons name={props.iconname} size={convertHeight(20)} color="white" />
                    <Animated.Text style={{ transform: [{ scale: props.scale }] }}>
                        {props.name}
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

        updateSplitWiseList(newSplitWise).then().catch((error) => {
            alert(error);
        });
        setModalVisible(false);
    }

    const leftSwipe = (progress, dragX) => {
        const scale = dragX.interpolate({ inputRange: [0, 50, 100, 101], outputRange: [-20, 0, 0, 1], extrapolate: 'clamp' });
        return (
            <View style={{ flexDirection: 'row' }}>
                <ButtonComponent
                    iconname={'remove-red-eye'} onPressHandler={() => refRBSheet.current.open()}
                    backgroundColor={COLORS.secondary} name={'View Split'} scale={scale} />
                <ButtonComponent
                    iconname={'notes'} onPressHandler={() => {
                        setModalVisible(true)
                        setNoteType(false)
                    }}
                    backgroundColor={COLORS.paleGreen} name={'View Note'} scale={scale} />
            </View>
        );
    };

    const rightSwipe = (progress, dragX) => {
        const scale = dragX.interpolate({ inputRange: [0, 100], outputRange: [1, 0], extrapolate: 'clamp' });
        return (
            <View style={{ flexDirection: 'row' }}>
                <ButtonComponent
                    iconname={'add-box'} onPressHandler={() => navigationToEdit()}
                    backgroundColor={COLORS.tertiary} name={'Add Split'} scale={scale} />
                <ButtonComponent
                    iconname={'create'} onPressHandler={() => {
                        setModalVisible(true)
                        setNoteType(true)
                    }}
                    backgroundColor={COLORS.green} name={'Add Note'} scale={scale} />
                <ButtonComponent
                    iconname={'delete'} onPressHandler={() => tryTodelete(item)}
                    backgroundColor={COLORS.validation} name={'Delete'} scale={scale} />
            </View>
        );
    };

    const deleteNote = (id) => {
        deleteNoteList(id).then(() => {
            queryGetNoteList(item.id).then((SplitWiseNoteList) => {
                setNoteArray(JSON.parse(JSON.stringify(SplitWiseNoteList)));
            }).catch((error) => {
                setNoteArray([]);
            });
        }).catch((error) => {
            // Error Handling
        });
    }

    return (
        <Swipeable ref={swipeableRef} renderLeftActions={leftSwipe} renderRightActions={rightSwipe}>
            <View activeOpacity={0.3} style={[styles.listItemContainer, { flexDirection: 'row', }]}>
                <Animatable.View animation="slideInLeft">
                    <MaterialIcons name={'keyboard-arrow-left'} size={convertHeight(20)} color="#b5b5b5" style={{ paddingLeft: convertWidth(5) }} />
                </Animatable.View>
                <View style={styles.labelContainer}>
                    <Text style={{ fontSize: convertHeight(10), color: COLORS.black }}>Grand Total</Text>
                    <Text style={styles.label}>{item.totalAmount}</Text>
                </View>
                <View style={styles.labelContainer}>
                    <Text style={{ fontSize: convertHeight(10), color: COLORS.black }}>Members</Text>
                    <Text style={styles.label}>{item.members.length}</Text>
                </View>
                <View style={styles.labelContainer}>
                    <Text style={{ fontSize: convertHeight(10), color: COLORS.black }}>Added Notes</Text>
                    <Text style={styles.label}>{item.notes.length}</Text>
                </View>
                <Animatable.View animation="slideInRight">
                    <MaterialIcons name={'keyboard-arrow-right'} size={convertHeight(20)} color="#b5b5b5" style={{ paddingRight: convertWidth(5) }} />
                </Animatable.View>
            </View>
            <RBSheet height={convertHeight(220)} ref={refRBSheet} closeOnDragDown={true} closeOnPressMask={false}
                customStyles={{ draggableIcon: { backgroundColor: COLORS.black } }}>
                <List horizontal data={getAddedAmountArray(item?.splitWiseListItems)} renderItem={({ item }) => renderItemSplitMembers({ item, spliupAmount })} />
                <Button disabled={item?.splitWiseListItems.length == 1} style={{ margin: convertHeight(10) }} onPress={() => { createPDF() }}>Generate & View Invoice</Button>
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
                notesItem={noteArray}
                deleteNote={(id) => deleteNote(id)}
            />
        </Swipeable>
    )
}
