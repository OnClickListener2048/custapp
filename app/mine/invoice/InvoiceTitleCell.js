
import React, {PropTypes,Component} from 'react';
import {View, Text,Platform,Image,Dimensions,StyleSheet} from 'react-native';
const window = Dimensions.get('window');
export const SCREEN_WIDTH = window.width;
export const SCREEN_HEIGHT = window.height;

export default class InvoiceTitleCell extends Component {

    constructor(props) {
        super(props)

    }

    static propTypes = {
        invoiceTitle: PropTypes.string,
        invoiceSubTitle: PropTypes.string,
    };

    render() {
        // const { style} = this.props
        const {invoiceTitle, invoiceSubTitle} = this.props;

        return (
            <View
                style={styles.rowStyle}>



                <View
                    style={styles.textRowStyle}>
                    <Text
                        textAlign='left'
                        numberOfLines={1}
                        style={[{fontSize: 17,marginTop:10, marginLeft : 10 ,marginRight : 0, height:30,color : '#333333'}] }>{invoiceTitle}</Text>
                    <Text
                        textAlign='left'
                        numberOfLines={2}
                        style={[{fontSize: 17, marginLeft : 10 ,height:30, marginRight : 0 ,color : '#333333'}] }>{'税号:' + invoiceSubTitle}</Text>

                </View>


                <Image
                    source={require('../../img/left_button.png')}
                    style={[{width: 10,height:15,marginRight:10}]}/>


            </View>
        )
    }
}




const styles = StyleSheet.create({
    rowStyle: {
        marginBottom: 10,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        width: SCREEN_WIDTH,
        alignItems:'center',
        justifyContent:'space-between'

    },


    textRowStyle: {
        marginLeft:0,
        backgroundColor: '#FFFFFF',
        flexDirection: 'column',
        width: SCREEN_WIDTH - 30,
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

    }

});
