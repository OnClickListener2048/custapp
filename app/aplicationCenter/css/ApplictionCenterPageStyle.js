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
    // phone input box
    applicationViewContainer: {
        height: 250,
        width: SCREEN_WIDTH,
        backgroundColor: '#FAFAFA',

        // width: SCREEN_WIDTH,
        // backgroundColor: '#FFDDFF',
        flexDirection: 'row',
        //justifyContent:'center'
        flexWrap:'wrap'

    }
    }
);
export default styles;
