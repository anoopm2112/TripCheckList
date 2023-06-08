import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from "react-i18next";
import { Transition, Transitioning } from 'react-native-reanimated';
// Custom Imports
import TouristPlaces from '../../../common/data/TouristPlaces.json';
import { convertHeight, convertWidth } from '../../../common/utils/dimentionUtils';
import Colors from '../../../common/Colors';

const transition = (
    <Transition.Together>
        <Transition.In type='fade' durationMs={200} />
        <Transition.Change />
        <Transition.Out type='fade' durationMs={200} />
    </Transition.Together>
);

export default function TouristDistrict(props) {
    const { districtName } = props.route.params;

    const [currentIndex, setCurrentIndex] = useState(null);
    const ref = useRef();
    const { i18n, t } = useTranslation();

    function selectItemBgColor(index) {
        const items = [
            { bg: '#A8DDE9', color: '#3F5B98' },
            { bg: '#086E4B', color: '#FCBE4A' },
            { bg: '#FECBCA', color: '#FD5963' },
            { bg: '#193B8C', color: '#FECBCD' },
            { bg: '#FDBD50', color: '#F5F5EB' },
            { bg: '#A8DDE9', color: '#3F5B98' },
            { bg: '#086E4B', color: '#FCBE4A' },
            { bg: '#FECBCA', color: '#FD5963' },
            { bg: '#193B8C', color: '#FECBCD' },
            { bg: '#FA6055', color: '#F5F5EB' }
        ];

        // Check if the index is within the valid range
        if (index >= 0 && index < items.length) {
            return items[index];
        } else {
            return null; // Return null if index is out of range
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
            justifyContent: 'center',
        },
        cardContainer: {
            flexGrow: 1,
        },
        card: {
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        heading: {
            fontSize: 18,
            fontWeight: '900',
            textTransform: 'uppercase',
            textAlign: 'center',
            letterSpacing: -1,
        },
        body: {
            fontSize: 16,
            lineHeight: 20 * 1.4,
            textAlign: 'center',
            padding: 5
        },
        noteList: {
            marginTop: 10,
        },
        districtHeader: {
            color: Colors.black,
            fontSize: 22,
            textAlign: 'center',
            fontWeight: 'bold',
            paddingBottom: convertHeight(15),
            textDecorationLine: 'underline',
            textTransform: 'uppercase'
        }
    });

    return (
        <Transitioning.View
            ref={ref}
            transition={transition}
            style={styles.container}>
            <Text style={styles.districtHeader}>{t(`Districts:${districtName}`)}</Text>

            {TouristPlaces[districtName].map(({ name, name_ML, name_HI, name_TA, note, note_ML, note_TA, note_HI }, index) => {
                return (
                    <TouchableOpacity
                        key={name}
                        onPress={() => {
                            ref.current.animateNextTransition();
                            setCurrentIndex(index === currentIndex ? null : index);
                        }}
                        style={styles.cardContainer}
                        activeOpacity={0.9}
                    >
                        <View style={[styles.card, { backgroundColor: selectItemBgColor(index).bg }]}>
                            <Text style={[styles.heading, { color: selectItemBgColor(index).color, textDecorationLine: index === currentIndex ? 'underline' : null }]}>{
                                i18n.language === 'en' ? name :
                                    i18n.language === 'ml' ? name_ML :
                                        i18n.language === 'hi' ? name_HI : name_TA
                            }</Text>
                            {index === currentIndex && (
                                <View style={styles.noteList}>
                                    <Text key={note} style={[styles.body, { color: selectItemBgColor(index).color }]}>
                                        {
                                            i18n.language === 'en' ? note :
                                                i18n.language === 'ml' ? note_ML :
                                                    i18n.language === 'hi' ? note_HI : note_TA
                                        }
                                    </Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                );
            })}
        </Transitioning.View>
    );
}