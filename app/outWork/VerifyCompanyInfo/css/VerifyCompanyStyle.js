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
        backgroundColor: '#FAFAFA',
        flexDirection: 'column'
    },
    menuTouch:{
        position: 'absolute',
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        left: 0,
        bottom: 0,
        zIndex: 10
    },
    menuShadow: {
        position: 'absolute',
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: 'black',
        left: 0,
        bottom: 0,
        opacity: 0.2,
        zIndex: 10
    },
    companyInfoViewContainer: {
        width: SCREEN_WIDTH,
        height:130,
        flexDirection: 'row',
        justifyContent:'space-between',
        backgroundColor: '#FFFFFF',
        // style={{ marginLeft: 15,marginTop: 15, height: 100, width: 300, flexDirection: 'column', backgroundColor : 'g
    },
    identityCardPhoto: {
        width: SCREEN_WIDTH,
        height:100,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row'
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

    },

    containers: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    background: {
        backgroundColor: '#ffffffff',
        justifyContent: 'center',
        alignItems: 'center'
    },
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
        marginLeft:100,
    },

    textInput: {
        flex: 1,
        width: px2dp(438),
        marginLeft: px2dp(0),
        padding: 0,
        color:'#323232',
        fontSize: px2dp(30),
    },


});
export default styles;