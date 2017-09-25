/**
 * Created by zhuangzihao on 2017/9/14.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Dimensions,
    TouchableOpacity
} from 'react-native';

const deviceWidth = Dimensions.get('window').width;
const col = 3
const itemMargin = 30
const itemWidth = (deviceWidth - itemMargin*(col+1))/col

export default class PayTaxes extends Component {
    render(){

        let arr = ['纳税表']
        return(
            <View style={{flexDirection:'row',flex:1,flexWrap:'wrap'}}>
                {
                    arr.map((item,index)=>{
                        return(
                            <TouchableOpacity key={index} onPress={()=>{this._goto()}}>
                                <View  style={{marginLeft:itemMargin,marginTop:20,width:itemWidth,height:80,backgroundColor:'red'}}>
                                    <Text>{item}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })
                }
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