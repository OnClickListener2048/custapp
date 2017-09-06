/**
 * Created by jinglan on 2017/6/9.
 */
import {StyleSheet, Dimensions} from 'react-native';
import px2dp from '../../util'
const window = Dimensions.get('window');

export const SCREEN_HEIGHT = window.height;
export const SCREEN_WIDTH = window.width;
const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#FAFAFA',
            flexDirection: 'column'
        },


    listViewcontainer: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        flexDirection: 'column'
    },
         rowStyle: {
             marginTop: 15,
             height : 69,
             backgroundColor: '#FAFAFA',
             flexDirection: 'column',

         },
    realRowStyle: {
        marginLeft: 27.5,
        marginRight: 15,
        height : 68,
        // // justifyContent : 'space-between',
        // // borderBottomColor: 'blue',
        // borderBottomWidth: 1,
        // backgroundColor: 'orange',
        // flexDirection: 'row',
        //
        // borderColor: '#FAFAFA',
        // borderRadius: 6,
        // borderWidth: 1,

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
