/**
 * Created by zhuangzihao on 2017/9/11.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    WebView
} from 'react-native';
import WebTab from './WebVIew'
import BComponent from '../../base';

export default class ProductDetailPage extends BComponent {

    static defaultProps = {
        item:{}
    };
    render(){
        return(
            <View style={{flex:1}}>
                <Image style={{width:DeviceInfo.width,height:DeviceInfo.width*0.4}} source={{uri:this.props.item.img}}/>
                <WebTab url={this.props.item.desc_url}/>
            </View>
        )
    }
}