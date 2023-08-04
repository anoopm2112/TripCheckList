import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Linking } from 'react-native';
import { Input } from '@ui-kitten/components';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import Lottie from 'lottie-react-native';
// Custom Imports
import Colors from '../../../common/Colors';
import { convertHeight, convertWidth } from '../../../common/utils/dimentionUtils';
import { darkModeColor } from '../../../common/utils/arrayObjectUtils';
import AssetIconsPack from '../../../assets/IconProvide';

export default function ContactUsView() {
    const { t } = useTranslation();
    const isDarkMode = useSelector(state => state?.settings?.isDarkMode);
    const { backgroundColor, textBrownColor } = darkModeColor(isDarkMode);

    const validationSchema = yup.object().shape({
        subject: yup.string().required('ContactUs:enter_subject'),
        // email: yup.string().email('Invalid email').required('Please Enter Email'),
        message: yup.string().required('ContactUs:enter_message'),
    });

    const handleSubmit = async (values, { resetForm }) => {
        const recipient = 'tripchecklistapp@gmail.com';
        const subject = values.subject;
        const body = values.message;

        const url = `mailto://co?to=${recipient}&subject=${subject}&body=${body}`;

        const canOpen = await Linking.openURL(url);

        if (canOpen) {
            Linking.openURL(url);
        } else {
            console.log('Gmail app is not installed.');
        }
        resetForm();
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: convertHeight(20)
        },
        input: {
            width: '100%',
            textAlign: 'left',
            backgroundColor: isDarkMode ? '#333333' : '#f5f5f5'
        },
        label: {
            paddingTop: convertHeight(15),
            paddingBottom: convertHeight(8),
            color: textBrownColor,
            fontWeight: '500',
        },
        errortxt: {
            color: Colors.validation,
            fontStyle: 'italic',
            textAlign: 'center',
            paddingTop: convertHeight(5)
        },
        btnContainer: {
            padding: convertHeight(8),
            borderRadius: 5,
            justifyContent: 'space-between',
            alignItems: 'center',
            elevation: 2,
            marginTop: 20,
            flexDirection: 'row',
            alignSelf: 'flex-end',
        },
        textBtn: {
            color: Colors.primary,
            fontWeight: '500',
            paddingVertical: convertHeight(3)
        },
    });

    return (
        <Formik
            initialValues={{ subject: '', email: '', message: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {({ handleChange, handleSubmit, values, errors, touched }) => (
                <KeyboardAwareScrollView style={{ backgroundColor: backgroundColor }}>
                    <View style={styles.container}>
                        <View style={{ alignItems: 'center' }}>
                            <Lottie source={AssetIconsPack.icons.contact_us_mail} autoPlay loop={false}
                                style={{ height: convertHeight(170), width: convertWidth(170) }} />
                        </View>
                        
                        <Text style={styles.label}>{t('ContactUs:subject')}</Text>
                        <Input
                            placeholder={t('ContactUs:enter_your_subject')}
                            value={values.subject}
                            onChangeText={handleChange('subject')}
                            status={errors.subject ? 'danger' : ''}
                            textStyle={{ color: textBrownColor }}
                            multiline
                            style={styles.input}
                            accessoryRight={
                                <TouchableOpacity>
                                    <MaterialIcons name="subject" size={convertHeight(20)} color={textBrownColor} />
                                </TouchableOpacity>
                            }
                        />
                        {touched.subject && errors.subject && <Animatable.Text animation={'fadeInLeft'} style={styles.errortxt}>{t(errors.subject)}</Animatable.Text>}

                        <Text style={styles.label}>{t('ContactUs:message')}</Text>
                        <Input
                            placeholder={t('ContactUs:enter_your_message')}
                            value={values.message}
                            onChangeText={handleChange('message')}
                            status={errors.message ? 'danger' : ''}
                            textStyle={{ color: textBrownColor }}
                            multiline
                            maxLength={500}
                            style={[styles.input, { maxHeight: 200 }]}
                            numberOfLines={5}
                            accessoryRight={
                                <TouchableOpacity>
                                    <MaterialIcons name="message" size={convertHeight(20)} color={textBrownColor} />
                                </TouchableOpacity>
                            }
                        />
                        {touched.message && errors.message && <Animatable.Text animation={'fadeInLeft'} style={styles.errortxt}>{t(errors.message)}</Animatable.Text>}

                        <TouchableOpacity onPress={handleSubmit} activeOpacity={0.5}
                            style={[styles.btnContainer, { backgroundColor: Colors.tertiary }]}>
                            <Text style={[styles.textBtn, { textTransform: 'uppercase' }]}>{t('ContactUs:send')}</Text>
                            <MaterialCommunityIcons name="send-circle" size={24} style={{ paddingLeft: convertWidth(5) }} color={Colors.primary} />
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
            )}
        </Formik>
    );
}

{/* <Text style={styles.label}>{'Email'}</Text>
<Input
    placeholder={'Enter Your Email'}
    value={values.email}
    onChangeText={handleChange('email')}
    status={errors.email ? 'danger' : ''}
    textStyle={{ color: textBrownColor }}
    style={styles.input}
    accessoryRight={
        <TouchableOpacity>
            <MaterialIcons name="email" size={convertHeight(20)} color={textBrownColor} />
        </TouchableOpacity>
    }
/>
{touched.email && errors.email && <Animatable.Text animation={'fadeInLeft'} style={styles.errortxt}>{errors.email}</Animatable.Text>} */}
