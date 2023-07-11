import { StyleSheet } from "react-native";
import COLORS from "../../common/Colors";
import { convertHeight, convertWidth } from "../../common/utils/dimentionUtils";
import Colors from "../../common/Colors";

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
        paddingHorizontal: 10,
        marginTop: 20,
    },
    button: {
        borderRadius: 50,
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: '#FFF',
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
    },
    textBtnSplit: {
        flex: 1,
        textAlign: 'center',
        fontWeight: '500',
        textTransform: 'uppercase',
        fontSize: 12
    },
    buttonViewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        borderRadius: 50,
        width: convertWidth(155),
        borderWidth: 0.5,
        borderColor: Colors.info,
    },
    subItemContainer: {
        padding: convertHeight(5),
        margin: convertWidth(10),
        elevation: 1,
        width: convertWidth(100),
        height: convertWidth(120),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 25,
        borderWidth: 0.2,
        borderColor: Colors.info
    },
    bottomScroll: {
        fontSize: convertHeight(12),
        fontWeight: 'bold',
        padding: convertHeight(6)
    },
    addBtn: {
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: -20
    }
});