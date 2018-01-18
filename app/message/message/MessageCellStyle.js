/**
 * Created by jinglan on 2017/6/9.
 */
import {StyleSheet, Dimensions} from 'react-native';
import px2dp from '../../util'
const window = Dimensions.get('window');

export const SCREEN_HEIGHT = window.height;
export const SCREEN_WIDTH = window.width;
const styles = StyleSheet.create({

        rowStyle: {
            marginTop: 10,
            backgroundColor: '#FFFFFF',
            flexDirection: 'column',
            width: SCREEN_WIDTH - 30,
            marginLeft:15,


        },
    timeRowStyle: {
        backgroundColor: '#F1F1F1',
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'center',
        width:SCREEN_WIDTH - 30
    },


    imageRowStyle: {
        height: 150.0/(345 + 30)*SCREEN_WIDTH,
        width:SCREEN_WIDTH - 30,
        backgroundColor: 'white',
    },


    topRowStyle: {
        height : 32,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems:'flex-end',

    },
    lineStyle: {
        height : 0.5,
        width: SCREEN_WIDTH - 50,
        marginLeft:10,
        backgroundColor: '#D7D7D7',
        flexDirection: 'row',
    },

    subtitleRowStyle: {
        marginTop:10,
        marginBottom:15,
        width: SCREEN_WIDTH - 30,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems:'center',

    },

    bottomRowStyle: {
        width: SCREEN_WIDTH - 30,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems:'center',
        // justifyContent: 'space-between'

    },

        messageBottomStyle: {
            resizeMode: "stretch",
            width: SCREEN_WIDTH - 27.5 - 15,
            height : 69,
            flexDirection: 'row',

        },

        titleViewStyle: {
            marginLeft: 20,
            marginRight: 22.5,
            flex: 1,
            backgroundColor: '#FFFFFF',
            // backgroundColor: 'red',

            height : 65,
            // maxWidth: SCREEN_WIDTH - 120,
            // width : 200,
            flexDirection: 'column',

        },
        timeTitleStyle: {
            fontSize: 12,
            marginBottom: 15,
            marginTop: 16.5,
            marginLeft : 10,
            marginRight : 15,
            color : '#969696',
            backgroundColor: '#FFFFFF',
            // backgroundColor: 'yellow',

            // marginRight: 22.5,
            // width : 200,

        },
    }
);
export default styles;
