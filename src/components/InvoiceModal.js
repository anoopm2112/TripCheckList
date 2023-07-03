import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from "react-native";
import Pdf from "react-native-pdf";
import { useSelector } from 'react-redux';
import Colors from "../common/Colors";
import { convertHeight, convertWidth } from "../common/utils/dimentionUtils";
import { darkModeColor } from "../common/utils/arrayObjectUtils";

export default function InvoiceModal(props) {
    const { pdfModalVisible, onClose, generateBillLocation } = props;

    const isDarkMode = useSelector(state => state?.settings?.isDarkMode);
    const { backgroundColor } = darkModeColor(isDarkMode);

    const styles = StyleSheet.create({
        pdf: {
            flex: 1,
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            backgroundColor: backgroundColor
        },
        floatingBtn: {
            alignItems: 'center',
            justifyContent: 'center',
            padding: convertWidth(10),
            position: 'absolute',
            bottom: convertHeight(30),
            borderRadius: 5,
            elevation: 4,
            right: convertWidth(20),
            backgroundColor: Colors.tertiary
        },
        pdfViewContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.primary
        }
    });

    return (
        <Modal animationType="slide" transparent={true} visible={pdfModalVisible} onRequestClose={() => { onClose() }}>
            <View style={styles.pdfViewContainer}>
                <Pdf style={styles.pdf} trustAllCerts={false} source={{ uri: generateBillLocation, cache: true }} />
            </View>
            <TouchableOpacity style={styles.floatingBtn} onPress={() => { onClose() }}>
                <Text style={{ color: Colors.primary }}>Close</Text>
            </TouchableOpacity>
        </Modal>
    )
}