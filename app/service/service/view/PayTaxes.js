/**
 * Created by liufei on 2017/9/25.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native';

const deviceWidth = Dimensions.get('window').width;
const col = 3
const itemMargin = 30
const itemWidth = (deviceWidth - itemMargin*(col+1))/col

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
        alignItems:'center'
    },
    text:{
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'transparent',
        fontSize:24,
        color:"#ffffff"

    }


});