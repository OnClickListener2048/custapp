/**
 * Created by liufei on 2017/9/25.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native';

import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../../config';

export default class PayTaxes extends Component {

    constructor(props){
        super(props)
    }

    render(){

        return(
            <View style={styles.wrapper}>
                <View style={styles.wrapper1}>
                    <TouchableOpacity onPress={()=>{this._goto()}}>
                        <Image style={styles.img} source={require('../../../img/service_cash_img.png')}>
                            <Text style={styles.text}>
                                纳税表
                            </Text>
                        </Image>
                    </TouchableOpacity>

                </View>
            </View>
        )
    }

    _goto(){
        this.props.navigator.push({
            screen: 'TaxFormPage',
            title:'纳税表',
            passProps:{
                year:this.props.year,
                month:this.props.month,
                callback:this.props.callback
            }
        })
    }
}

const styles = StyleSheet.create({
    wrapper:{
        marginHorizontal:20,
        marginTop:30

    },
    wrapper1:{
        flexDirection:'row',

    },
    img:{
        resizeMode:'contain',
        justifyContent:'center',
        alignItems:'center',
        width:(SCREEN_WIDTH-20-40)/2,
        height:(SCREEN_WIDTH-20-40)*0.5/2,
    },
    text:{
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'transparent',
        fontSize:24,
        color:"#ffffff"

    }


});