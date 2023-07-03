import { StyleSheet } from "react-native";
import COLORS from "../../common/Colors";
import { convertHeight, convertWidth } from "../../common/utils/dimentionUtils";

export const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: convertHeight(8),
    },
    counterContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: convertHeight(12)
    },
    addTask: {
        backgroundColor: 'green',
        borderColor: 'green',
        width: '48%'
    },
    listItemContainer: {
        elevation: 5,
        backgroundColor: COLORS.primary,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: convertWidth(10),
        height: convertHeight(32),
        flexDirection: 'row'
    },
    paidByYou: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: convertHeight(10)
    },
    errortxt: {
        color: COLORS.validation,
        fontStyle: 'italic',
        textAlign: 'center',
        paddingVertical: convertHeight(3)
    },
    txtInputContainer: {
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    txtNameContainer: {
        flex: 0.5,
        textAlign: 'center'
    },
    paidByTitle: {
        color: COLORS.black, 
        padding: convertHeight(7), 
        textAlign: 'center',
        fontWeight: 'bold', 
        fontSize: convertHeight(16), 
        color: COLORS.secondary,
        textDecorationLine: 'underline'
    },
    addNoteBtn: {
        elevation: 5,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        margin: convertWidth(9),
        padding: convertHeight(8),
        width: convertWidth(155)
    },
    actionBtnContainer: {
        backgroundColor: COLORS.tertiary,
        borderColor: COLORS.tertiary,
        marginVertical: convertHeight(12)
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginTop: 20,
    },
    button: {
        borderRadius: 50,
        width: 70,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 5,
    },
    animated_container: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    }
});