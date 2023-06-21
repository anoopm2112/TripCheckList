import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, StatusBar, Platform } from 'react-native';
import { Input } from '@ui-kitten/components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTranslation } from "react-i18next";
// Custom Imports
import Colors from '../../../common/Colors';
import { convertHeight, convertWidth } from '../../../common/utils/dimentionUtils';

const COST = 'Cost';
const MILEAGE = 'Mileage';
const DISTANCE = 'Distance';

export default function CostPlanner() {

    const { t } = useTranslation();

    const [currentPriceOfPetrol, setCurrentPriceOfPetrol] = useState('');
    const [mileage, setMileage] = useState('');
    const [distanceCovered, setDistanceCovered] = useState('');
    const [costTravel, setCostTravel] = useState('');
    const [totalCostOfTravel, setTotalCostOfTravel] = useState('0');

    // Validations
    const [valCurrentPriceOfPetrol, setValCurrentPriceOfPetrol] = useState(false);
    const [valMileage, setValMileage] = useState(false);
    const [valDistance, setValDistance] = useState(false);
    const [valCost, setValCost] = useState(false);

    const [TopTab, setTopTab] = useState(COST);

    const handleCostCalculation = () => {
        if (currentPriceOfPetrol === '' || currentPriceOfPetrol === 0) {
            setValCurrentPriceOfPetrol(true);
        } else if (mileage === '' || mileage === 0) {
            setValMileage(true);
        } else if (distanceCovered === '' || distanceCovered === 0) {
            setValDistance(true);
        } else if ((TopTab === DISTANCE && costTravel === '') || (TopTab === DISTANCE && costTravel === 0)) {
            setValCost(true);
        } else {
            let travelPlanner;
            if (TopTab === COST) {
                const costOfTravel = (distanceCovered / mileage) * currentPriceOfPetrol;
                travelPlanner = costOfTravel.toFixed(2);
            } else if (TopTab === MILEAGE) {
                const calculatedMileage = distanceCovered / currentPriceOfPetrol;
                travelPlanner = calculatedMileage.toFixed(2);
            } else {
                const distanceCovered = (costTravel / currentPriceOfPetrol) * mileage;
                travelPlanner = distanceCovered.toFixed(2);
            }
            setTotalCostOfTravel(travelPlanner);
        }
    };

    const itemsRenderByValue = () => {
        if (TopTab === COST) {
            return {
                title: t('CostPlanner:total_travel_cost'), btnText: t('CostPlanner:check_cost'),
                postLetter: '\u20B9', fuelLabel: t('CostPlanner:fuel_price'),
                iconCostSize: convertHeight(27), iconMileageSize: convertHeight(16), iconDistanceSize: convertHeight(16),
                fuelPlaceHolder: t('CostPlanner:enter_fuel_price'),
                bgCostColor: '#eaf4ff', bgMileageColor: Colors.primary, bgDistanceColor: Colors.primary,
            };
        } else if (TopTab === MILEAGE) {
            return {
                title: t('CostPlanner:total_mileage'), btnText: t('CostPlanner:check_mileage'),
                postLetter: t('CostPlanner:L'), fuelLabel: t('CostPlanner:fuel_liters'),
                iconCostSize: convertHeight(21), iconMileageSize: convertHeight(20), iconDistanceSize: convertHeight(16),
                fuelPlaceHolder: t('CostPlanner:enter_fuel_liters'),
                bgCostColor: Colors.primary, bgMileageColor: '#eaf4ff', bgDistanceColor: Colors.primary,
            };
        } else if (TopTab === DISTANCE) {
            return {
                title: t('CostPlanner:Total_travel_distance'), btnText: t('CostPlanner:check_distance'),
                postLetter: t('CostPlanner:km'), fuelLabel: t('CostPlanner:fuel_price'),
                iconCostSize: convertHeight(21), iconMileageSize: convertHeight(16), iconDistanceSize: convertHeight(20),
                fuelPlaceHolder: t('CostPlanner:enter_fuel_price'),
                bgCostColor: Colors.primary, bgMileageColor: Colors.primary, bgDistanceColor: '#eaf4ff'
            };
        }
    };

    const handleResetPress = () => {
        setCurrentPriceOfPetrol(0);
        setMileage(0);
        setDistanceCovered(0);
        setCostTravel(0);
        setTotalCostOfTravel(0);
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: convertHeight(20)
        },
        input: {
            paddingBottom: convertHeight(15),
            width: '100%'
        },
        btnContainer: {
            padding: convertHeight(8),
            borderRadius: 5,
            justifyContent: 'space-between',
            alignItems: 'center',
            elevation: 2
        },
        textBtn: {
            color: Colors.primary,
            fontWeight: '500',
            paddingVertical: convertHeight(3)
        },
        cardView: {
            backgroundColor: Colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: convertHeight(2),
            ...Platform.select({
                ios: {
                    shadowColor: '#c7c7c7', shadowOffset: { width: 5, height: 5 },
                    shadowOpacity: 0.5, shadowRadius: 5,
                },
                android: {
                    elevation: 3, shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2, shadowRadius: 2,
                },
            })
        },
        label: {
            color: Colors.black,
            fontWeight: '500',
            paddingBottom: convertHeight(8)
        },
        totalTxt: {
            fontSize: convertHeight(16),
            color: Colors.black,
            letterSpacing: -1
        },
        topBar: {
            width: convertHeight(50),
            height: convertHeight(50),
            borderRadius: convertHeight(50),
            alignItems: 'center',
            elevation: 2,
            justifyContent: 'center'
        },
        topBarContainer: {
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            backgroundColor: Colors.primary,
            height: convertHeight(90),
            alignItems: 'center'
        },
        info_title: {
            color: Colors.black,
            textAlign: 'left',
            fontWeight: '800',
            fontSize: convertHeight(11),
            textDecorationLine: 'underline'
        },
        info_text: {
            color: '#363836',
            textAlign: 'left',
            paddingTop: convertHeight(3),
            fontWeight: '700',
            fontSize: convertHeight(10)
        },
        errortxt: {
            color: Colors.validation,
            fontStyle: 'italic',
            textAlign: 'center',
            paddingBottom: convertHeight(15)
        }
    });

    return (
        <KeyboardAwareScrollView>
            <StatusBar backgroundColor={Colors.primary} barStyle={'dark-content'} />
            <View style={styles.container}>

                <View style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: convertHeight(20) }}>
                    <Text style={[styles.totalTxt, { fontWeight: '500', fontSize: convertHeight(14), color: '#515452' }]}>{itemsRenderByValue().title}</Text>
                    <Text style={[styles.totalTxt, { fontWeight: '900', fontSize: convertHeight(28) }]}>{totalCostOfTravel}{itemsRenderByValue().postLetter}</Text>
                </View>

                <View style={styles.topBarContainer}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => { handleResetPress(); setTopTab(COST); }} activeOpacity={0.5}
                            style={[styles.topBar, { backgroundColor: itemsRenderByValue().bgCostColor }]}>
                            <MaterialIcons name="local-gas-station" size={itemsRenderByValue().iconCostSize} color={Colors.black} />
                        </TouchableOpacity>
                        <Text style={[styles.textBtn, { color: Colors.black, letterSpacing: -1 }]}>{t('CostPlanner:cost')}</Text>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => { handleResetPress(); setTopTab(MILEAGE); }} activeOpacity={0.5}
                            style={[styles.topBar, { backgroundColor: itemsRenderByValue().bgMileageColor }]}>
                            <Ionicons name="md-speedometer" size={convertHeight(itemsRenderByValue().iconMileageSize)} color={Colors.black} />
                        </TouchableOpacity>
                        <Text style={[styles.textBtn, { color: Colors.black, letterSpacing: -1 }]}>{t('CostPlanner:mileage')}</Text>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => { handleResetPress(); setTopTab(DISTANCE); }} activeOpacity={0.5}
                            style={[styles.topBar, { backgroundColor: itemsRenderByValue().bgDistanceColor }]}>
                            <MaterialCommunityIcons name="map-marker-distance" size={convertHeight(itemsRenderByValue().iconDistanceSize)} color={Colors.black} />
                        </TouchableOpacity>
                        <Text style={[styles.textBtn, { color: Colors.black, letterSpacing: -1 }]}>{t('CostPlanner:distance')}</Text>
                    </View>
                </View>

                <View style={[styles.cardView, { padding: convertHeight(25), marginTop: 10 }]}>
                    <View>
                        <Text style={styles.label}>{itemsRenderByValue().fuelLabel}</Text>
                        <Input
                            placeholder={itemsRenderByValue().fuelPlaceHolder}
                            value={currentPriceOfPetrol}
                            onChangeText={(text) => {
                                setValCurrentPriceOfPetrol(false);
                                setCurrentPriceOfPetrol(text.replace(/[^0-9.]/g, ''));
                            }}
                            keyboardType="numeric"
                            style={styles.input}
                            accessoryRight={
                                <TouchableOpacity>
                                    <MaterialIcons name="local-gas-station" size={convertHeight(20)} color={Colors.black} />
                                </TouchableOpacity>
                            }
                        />
                        {valCurrentPriceOfPetrol && <Text style={styles.errortxt}>{t('CostPlanner:fuel_price_val')}</Text>}
                    </View>

                    {TopTab !== MILEAGE &&
                        <View>
                            <Text style={styles.label}>{t('CostPlanner:mileage')}</Text>
                            <Input
                                placeholder={t('CostPlanner:enter_mileage')}
                                value={mileage}
                                onChangeText={(text) => {
                                    setMileage(text.replace(/[^0-9.]/g, ''));
                                    setValMileage(false);
                                }}
                                keyboardType="numeric"
                                style={styles.input}
                                accessoryRight={
                                    <TouchableOpacity>
                                        <Ionicons name="md-speedometer" size={convertHeight(20)} color={Colors.black} />
                                    </TouchableOpacity>
                                }
                            />
                            {valMileage && <Text style={styles.errortxt}>{t('CostPlanner:mileage_val')}</Text>}
                        </View>
                    }

                    {(TopTab === COST || TopTab === MILEAGE) ?
                        <View>
                            <Text style={styles.label}>{t('CostPlanner:distance')}</Text>
                            <Input
                                placeholder={t('CostPlanner:enter_distance')}
                                value={distanceCovered}
                                onChangeText={(text) => {
                                    setDistanceCovered(text.replace(/[^0-9.]/g, ''));
                                    setValDistance(false);
                                }}
                                keyboardType="numeric"
                                style={styles.input}
                                accessoryRight={
                                    <TouchableOpacity>
                                        <MaterialCommunityIcons name="map-marker-distance" size={convertHeight(20)} color={Colors.black} />
                                    </TouchableOpacity>
                                }
                            />
                            {valDistance && <Text style={styles.errortxt}>{t('CostPlanner:distance_val')}</Text>}
                        </View>
                        :
                        <View>
                            <Text style={styles.label}>{t('CostPlanner:cost')}</Text>
                            <Input
                                placeholder={t('CostPlanner:enter_cost')}
                                value={costTravel}
                                onChangeText={(text) => {
                                    setCostTravel(text.replace(/[^0-9.]/g, ''));
                                    setValCost(false);
                                }}
                                keyboardType="numeric"
                                style={styles.input}
                                accessoryRight={
                                    <TouchableOpacity>
                                        <MaterialCommunityIcons name="cash" size={convertHeight(20)} color={Colors.black} />
                                    </TouchableOpacity>
                                }
                            />
                            {valCost && <Text style={styles.errortxt}>{t('CostPlanner:cost_val')}</Text>}
                        </View>
                    }

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                        <TouchableOpacity onPress={handleResetPress} activeOpacity={0.5}
                            style={[styles.btnContainer, { backgroundColor: Colors.tertiary, width: '28%' }]}>
                            <Text style={[styles.textBtn, { textTransform: 'uppercase' }]}>{t('Common:reset')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleCostCalculation} activeOpacity={0.5}
                            style={[styles.btnContainer, { backgroundColor: Colors.green, width: '68%' }]}>
                            <Text style={[styles.textBtn, { textTransform: 'uppercase' }]}>{itemsRenderByValue().btnText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ padding: convertHeight(15) }}>
                    <Text style={styles.info_title}>{t('CostPlanner:how_to_save_fuel')}</Text>
                    <Text style={styles.info_text}>{t('CostPlanner:info_1')}</Text>
                    <Text style={styles.info_text}>{t('CostPlanner:info_2')}</Text>
                    <Text style={styles.info_text}>{t('CostPlanner:info_3')}</Text>
                    <Text style={styles.info_text}>{t('CostPlanner:info_4')}</Text>
                    <Text style={[styles.info_text, {
                        fontStyle: 'italic', fontSize: convertHeight(9), color: '#686968'
                    }]}>{t('CostPlanner:info_5')}</Text>
                </View>



            </View>
        </KeyboardAwareScrollView>
    );
}