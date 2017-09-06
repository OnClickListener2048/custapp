/**
 * Created by jinglan on 2017/6/22.
 */
import {StyleSheet, Dimensions} from 'react-native';
const window = Dimensions.get('window');

export const SCREEN_HEIGHT = window.height;
export const SCREEN_WIDTH = window.width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        flexDirection: 'column'
    },
    bttomLineStyle: {
        resizeMode: "stretch",
        width: SCREEN_WIDTH,
        height : 2,
        flexDirection: 'row',

    },

    companyInfoViewContainer: {
        width: SCREEN_WIDTH,
        height:130,
        backgroundColor: '#FFFFFF',
        flexDirection: 'column'
        // style={{ marginLeft: 15,marginTop: 15, height: 100, width: 300, flexDirection: 'column', backgroundColor : 'g
    },

    companyInfoRowStyle: {
        marginLeft : 15,
        marginRight : 15,
        marginTop : 10,
        width: SCREEN_WIDTH - 30,
        // flex: 1,
        height: 30,
        flexDirection: 'row',
        justifyContent:'space-between'
    },
    companyInfoRowSubViewStyle: {
        maxWidth: SCREEN_WIDTH/2 - 15,
        width: SCREEN_WIDTH/2 - 15,
        height: 35,
        marginLeft : 0,
        marginRight : 0,
        flexDirection: 'row',
    },
    companyInfoRowPhoneStyle: {
        maxWidth: SCREEN_WIDTH/2 - 15,
        width: SCREEN_WIDTH/2 - 15,
        height: 30,
        marginLeft : 0,
        marginRight : 0,
        flexDirection: 'row',
        justifyContent:'flex-end'

    }

});
export default styles;
