/**
 * Created by zhuangzihao on 2017/9/20.
 */
import React, {Component} from 'react';
import {
    View,
    Image,
    Text
} from 'react-native';
import BComponent from '../../base';

export default class SystemMessagePage extends BComponent {
    static defaultProps = {
        item:{}
    };
    render(){
        return(
            <View style={{flex:1,backgroundColor:'#f9f9f9'}}>
                <View style={{width:DeviceInfo.width,height:48,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                    <Image source={require('../../img/tip.png')}/>
                    <Text style={{fontSize:14,color:'#333333',marginLeft:5}}>{this.props.item.title}</Text>
                </View>
                <View style={{width:DeviceInfo.width-28,marginLeft:14,backgroundColor:'white',padding:30,paddingLeft:14,paddingRight:14}}>
                    <Text style={{fontSize:14,color:'#333333'}}>{this.props.item.date}</Text>
                    <Text style={{fontSize:14,color:'#333333',marginTop:14}}>尊敬的客户：</Text>
                    <Text style={{fontSize:14,color:'#333333',lineHeight:20,marginTop:5}}>&emsp;&emsp;{this.props.item.text}</Text>
                </View>
            </View>
        )
    }
}