/**
 * Created by jinglan on 2017/6/14.
 */
import {StyleSheet, Dimensions} from 'react-native';
import px2dp from '../../../util/index'
const window = Dimensions.get('window');

export const SCREEN_HEIGHT = window.height;
export const SCREEN_WIDTH = window.width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column'
    },
    companyInfoViewContainer: {
        width: SCREEN_WIDTH,
        height:130,
        backgroundColor: '#FFFFFF',
        flexDirection: 'column'
        // style={{ marginLeft: 15,marginTop: 15, height: 100, width: 300, flexDirection: 'column', backgroundColor : 'g
    },

    // phone input box
    textInputContainer: {
        height: px2dp(50),
        // width: SCREEN_WIDTH,
        // backgroundColor: '#FFDDFF',
        flexDirection: 'row',
    },

    // phone input box
    textInputWrapper: {
        minHeight: px2dp(30),
        maxHeight:100,
        width: SCREEN_WIDTH-115,
        borderBottomColor: '#dcdcdc',
        borderBottomWidth: 0.5,
        backgroundColor: 'transparent',
        // position: 'relative',
        marginRight: px2dp(20),
        flexDirection: 'row',
    },

    textInput: {
        flex: 1,
        width: px2dp(438),
        marginLeft: px2dp(0),
        padding: 0,
        color:'#323232',
        fontSize: px2dp(30),
    },

    legalPersonStyle: {
        marginTop : 5,
        width: SCREEN_WIDTH - 30,
        // flex: 1,
        height: 30,
        flexDirection: 'row',
        justifyContent:'space-between'
    },

    registerNumStyle: {
        marginTop : 5,
        width: SCREEN_WIDTH - 30,
        // flex: 1,
        height: 30,
        flexDirection: 'row',
        justifyContent:'space-between'
    },

    companyInfoRowSubViewStyle: {
        maxWidth: SCREEN_WIDTH/2 - 15,
        width: SCREEN_WIDTH/2 - 15,
        height: 30,
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