/**
 * Created by zhuangzihao on 2017/9/19.
 */
import React, { Component } from 'react';
import {

    StyleSheet,
    Text,
    View,

} from 'react-native';

export default class SectionHeader extends Component {
    static defaultProps = {
        text:'',//是标题
        style:{},
        textStyle:{},
        leftViewStyle:{},
        rightView:null
    };
    render(){
            return(
                <View style={[{paddingLeft:16,paddingRight:16,height:50,flexDirection:'row',alignItems:'center',backgroundColor:'white',justifyContent:'space-between'},this.props.style]}>
                    <View style={{flexDirection:'row'}}>
                        <View style={[{height:16,width:3,backgroundColor:'#CEAF72'},this.props.leftViewStyle]}></View>
                        <Text style={[{fontSize:setSpText(16),color:'#333333',fontWeight:'bold',marginLeft:5},this.props.textStyle]}>{this.props.text}</Text>
                    </View>
                    <View>{this.props.rightView}</View>
                </View>
            )

    }
}