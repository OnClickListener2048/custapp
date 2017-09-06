/**
 * Created by jinglan on 2017/6/13.
 */
import {StyleSheet, Dimensions} from 'react-native';
import px2dp from '../../util/index'
const window = Dimensions.get('window');

export const SCREEN_HEIGHT = window.height;
export const SCREEN_WIDTH = window.width;

const styles = StyleSheet.create({

    registerCompanyViewContainer: {
        width: SCREEN_WIDTH,
        height:190,
        marginTop: 15,
        backgroundColor: 'orange',
        flexDirection: 'column'
        // style={{ marginLeft: 15,marginTop: 15, height: 100, width: 300, flexDirection: 'column', backgroundColor : 'g
    },

    registerCompanyRowStyle: {
        marginLeft : 15,
        marginRight : 15,
        width: SCREEN_WIDTH - 30,
        // flex: 1,
        height: 30,
        flexDirection: 'row',
        justifyContent:'space-between'
    },
    registerCompanySubViewStyle: {
        maxWidth: SCREEN_WIDTH/2 - 15,
        width: SCREEN_WIDTH/2 - 15,
        height: 30,
        marginLeft : 0,
        marginRight : 0,
        flexDirection: 'row',
    },

});
export default styles;