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
        text:'我是标题',//是标题
        style:{},
        textStyle:{},
        leftViewStyle:{}
    };
    render(){
        return(
            <View style={[{padding:16,flexDirection:'row',alignItems:'center',backgroundColor:'white'},this.props.style]}>
                <View style={[{height:16,width:3,backgroundColor:'#FFBF17'},this.props.leftViewStyle]}></View>
                <Text style={[{fontSize:16,color:'#333333',fontWeight:'bold',marginLeft:5},this.props.textStyle]}>{this.props.text}</Text>
            </View>
        )
    }
}