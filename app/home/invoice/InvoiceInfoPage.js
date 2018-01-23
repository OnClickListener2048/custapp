/**
 * Created by zhuangzihao on 2018/1/23.
 */


import React, {Component,PropTypes} from 'react';
import {

    StyleSheet,
    Text,
    View,
    Image

} from 'react-native';
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../config';
import BComponent from '../../base'
import invoice_data from './invoice_data.json'
export default class InvoiceInfoPage extends BComponent {

    constructor(props){
        super(props)

    }
    static navigatorStyle = {
        navBarHidden: false, // 隐藏默认的顶部导航栏
        tabBarHidden: true, // 默认隐藏底部标签栏
    };
    //开始扫描
    componentDidMount() {

    }

    render(){
        return(
            <View>

            </View>
        )
    }
}







