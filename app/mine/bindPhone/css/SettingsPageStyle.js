/**
 * Created by zhuangzihao on 2017/9/18.
 */
import {StyleSheet, Dimensions} from 'react-native';
import px2dp from '../../../util'
const window = Dimensions.get('window');

export const SCREEN_HEIGHT = window.height;
export const SCREEN_WIDTH = window.width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexDirection: 'column'
    },

    // logo图标
    bzLogo: {
        resizeMode: "contain",
        borderWidth: 0,
        borderColor: "#f9f9f9",
        alignSelf: 'center',
        marginTop: px2dp(238),
        width: px2dp(135),
        height: px2dp(110)
    },

    // phone input box
    textInputContainer: {
        height: px2dp(88),
        // width: SCREEN_WIDTH,
        // backgroundColor: '#FFDDFF',
        flexDirection: 'row',
        justifyContent:'center'
    },

    // phone input box
    textInputWrapper: {
        height: px2dp(88),
        width: px2dp(438),
        borderBottomColor: '#dcdcdc',
        borderBottomWidth: 0.5,
        backgroundColor: 'transparent',
        // position: 'relative',
        marginLeft: px2dp(20),
        flexDirection: 'row',
        justifyContent: 'center',
    },

    // 输入框之前的logo图标
    inputLogo: {
        resizeMode: "contain",
        marginRight: px2dp(0),
        marginBottom: 2,
        alignSelf: 'center'
    },

    containerKeyboard: {
        flex: 1, justifyContent: 'flex-start', paddingHorizontal: 20, paddingTop: 0,
    },

    navBarLeftItemStyle: {
        width: 20,
        height: 20,
        marginLeft: 15,
    },
    navbarTitleItemStyle: {
        fontSize: 17,
        color: 'black',
        marginRight: 50
    },
    header: {
        height: 50,
        backgroundColor: '#12B7F5',
        justifyContent: 'center',
    },
    headtitle: {
        alignSelf: 'center',
        fontSize: 20,
        color: '#ffffff',
    },
    avatarview: {
        height: 150,
        backgroundColor: '#ECEDF1',
        justifyContent: 'center',
    },
    avatarimage: {
        width: 100,
        height: 100,
        alignSelf: 'center'
    },
    marginTopview: {
        height: 15,
        backgroundColor: '#F7F7F9'
    },
    inputview: {
        height: 100,
    },
    textInput: {
        flex: 1,
        width: px2dp(438),
        fontSize: 15,
        marginLeft: px2dp(0),
        padding: 0,
        fontSize: px2dp(28),
        color: '#ef0c35',
    },

    codeInput: {
        flex: 1,
        height: 30,
        width: px2dp(148),
        fontSize: 15,
        marginLeft: px2dp(0),
        padding: 0,
        fontSize: px2dp(28),
        color: '#ef0c35',
        alignSelf: 'center',
    },

    underline: {
        height: 1,
        backgroundColor: '#dcdcdc',
    },

    dividerview: {
        flexDirection: 'row',
    },
    divider: {
        flex: 1,
        height: 10,
        backgroundColor: 'transparent'
    },
    bottomview: {
        backgroundColor: 'transparent',
    },
    buttonview: {
        backgroundColor: '#e6e6e6',
        margin: 0,
        borderRadius: 6,
        justifyContent:'center',
        alignSelf:'center',
        height: px2dp(88),
        width: px2dp(500),
        marginTop: px2dp(45)
    },
    logintext: {
        fontSize: 15,
        color: '#FFFFFF',
        marginTop: 10,
        marginBottom: 10,
        textAlign:'center'
    },
    emptyview: {
        flex: 1,
    },
    bottombtnsview: {
        flexDirection: 'row',
    },
    bottomleftbtnview: {
        flex: 1,
        height: 50,
        paddingLeft: 10,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    bottomrightbtnview: {
        flex: 1,
        height: 50,
        paddingRight: 10,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    bottombtn: {
        fontSize: 15,
        color: '#1DBAF1',
    }
});

export default styles;
