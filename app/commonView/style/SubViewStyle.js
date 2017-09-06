/**
 * Created by jinglan on 2017/6/12.
 */
import {StyleSheet, Dimensions} from 'react-native';
import px2dp from '../../util/index'
const window = Dimensions.get('window');

export const SCREEN_HEIGHT = window.height;
export const SCREEN_WIDTH = window.width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        flexDirection: 'column'
    },
    companyInfoViewContainer: {
        width: SCREEN_WIDTH,
        height: 185,
        backgroundColor: '#FFFFFF',

        flexDirection: 'column'
        // style={{ marginLeft: 15,marginTop: 15, height: 100, width: 300, flexDirection: 'column', backgroundColor : 'g
    },

    companyNameRowStyle: {
        marginLeft : 15,
        marginRight : 15,
        width: SCREEN_WIDTH - 30,
        height: 35,
        flexDirection:  'row',
        justifyContent:'space-between',

    },

    companyInfoRowStyle: {
        marginLeft : 15,
        marginRight : 15,
        width: SCREEN_WIDTH - 30,
        height:  70,
        flexDirection: 'column',
        justifyContent:'space-between',

    },
    companyInfoRowSubViewStyle: {
        maxWidth:  SCREEN_WIDTH - 30,
        width: SCREEN_WIDTH - 30,
        height: 35,
        marginLeft : 0,
        marginRight : 0,
        flexDirection: 'row',


    },
    companyInfoRowPhoneStyle: {
        maxWidth:  SCREEN_WIDTH - 30,
        width:  SCREEN_WIDTH - 30,
        height: 35,
        marginLeft : 0,
        marginRight : 0,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems:'center',
    },

    textInputWrapper: {
        height: 35,
        width: SCREEN_WIDTH-83 - 30,
        // backgroundColor: 'transparent',
        // position: 'relative',
        // marginRight: px2dp(20),
        flexDirection: 'row',
        marginLeft : 0,
        marginRight : 0,
    },

    contactNmaeInputWrapper: {
        height: 30,
        width:  SCREEN_WIDTH-83 - 30,
        // backgroundColor: 'transparent',
        // position: 'relative',
        // marginRight: px2dp(20),
        flexDirection: 'row',
        marginTop: 5,
        marginLeft : 0,
    },

    textInput: {
        flex: 1,
        width: px2dp(438),
        marginLeft: px2dp(0),
        padding: 0,
        fontSize: 15,
        color:'#323232',

    },

});
export default styles;
