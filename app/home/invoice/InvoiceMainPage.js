/**
 * Created by liufei on 2018/1/22.
 */


import SubmitButtonWithIcon from "../../view/SubmitButtonWithIcon";
import SubmitButton from "../../view/SubmitButton";

import React, {Component,PropTypes} from 'react';
import {

    StyleSheet,
    Text,
    View,
    Image

} from 'react-native';
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../config';
import BComponent from '../../base'
export default class InvoiceMainPage extends BComponent {

    constructor(props){
        super(props)
        this.scan=this.scan.bind(this);
        this.check=this.check.bind(this);
    }
    static navigatorStyle = {
        navBarHidden: false, // 隐藏默认的顶部导航栏
        tabBarHidden: true, // 默认隐藏底部标签栏
    };
    //开始扫描
    scan(){
        this.push({
            title: '扫一扫',
            screen: 'QRCodeScreenPage',
            backButtonHidden: true, // 是否隐藏返回按钮 (可选)
            passProps:{
                callback:function (data) {
                    alert(JSON.stringify(data))
                }
            }
        });
    }

    //手工录入查验
    check(){
        this.push({
            title: '发票验真',
            screen: 'InvoiceInputPage',
            backButtonHidden: true, // 是否隐藏返回按钮 (可选)
            passProps:{
            }
        });
    }

    render(){
        return(
            <View>
                <View style={{alignItems:'center'}}>
                    <Image
                        source={require('../../img/invoice_home_icon.png')}
                        style={{marginTop:50,}}
                    />
                    <Text style={{fontSize:18,color:'#333333',marginTop:30}}>
                        扫描二维码查验
                    </Text>
                </View>



                <View style={{marginTop:50}}>
                    <SubmitButtonWithIcon
                        isEnabled={true}
                        text="开始扫描"
                        img={require('../../img/scan_icon.png')}
                        buttonStyle={{width:SCREEN_WIDTH-40}}
                        textStyle={{ marginLeft: 10}}
                        onPress={() => {
                            this.scan()
                        }}
                    />
                    <SubmitButton
                        isEnabled={false}
                        text="手工录入查验"
                        buttonStyle={{width:335}}
                        onPress={() => {
                            this.check()
                        }}

                    />
                </View>
            </View>
        )
    }
}







