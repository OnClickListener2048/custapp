/**
 * Created by liufei on 2018/4/16.
 */

import React, {PropTypes,Component} from 'react';
import {View, Text,Platform,Image,Dimensions,StyleSheet} from 'react-native';
const window = Dimensions.get('window');

export const SCREEN_WIDTH = window.width;

export default class DetailAccountCateoryCell extends Component {

    constructor(props) {
        super(props)

    }

    render() {
        const {categoryItem} = this.props

        return (
            <View>
            <View style={styles.rowStyle}>
                <View style={styles.rowWrp}>
                    <Text style={styles.textStyle}>
                        {categoryItem.subjectNo}
                    </Text>
                    <Text style={[styles.textStyle,{marginLeft:5, width:270}]}
                          numberOfLines={1}
                    >
                        {categoryItem.subjectName}
                    </Text>

                </View>
                <Image style={styles.img}
                       source={require('../../../img/left_button.png')}
                />
            </View>
                <View style={[styles.line,{marginLeft:16}]}/>
            </View>
        )
    }
}


const styles = StyleSheet.create({

    rowStyle: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        width: SCREEN_WIDTH,
        alignItems:'center',
        justifyContent:"space-between",
        paddingTop:18,
        paddingBottom:18

    },
    rowWrp:{
        flexDirection:'row',
        marginLeft:15
    },
    textStyle:{
        fontSize: 14,
        color: '#333333',
    },
    img:{
        resizeMode : "contain",
        marginRight:15
    },
    line:{
        height:0.5,
        width:SCREEN_WIDTH,
        borderLeftColor:'#ececec',
        borderLeftWidth:1 ,
        backgroundColor:'transparent',
        marginLeft:10
    },
});