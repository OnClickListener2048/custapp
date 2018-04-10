/**
 * Created by jinglan on 2018/4/10.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Linking,
    ScrollView
} from 'react-native';

import {SCREEN_WIDTH} from '../../config';

import goQQChat from "../../util/goQQChat";

import BComponent from '../../base/BComponent'
export default class SupportPage extends BComponent {
    constructor(props) {
        super(props);
        this._onLineChat = this._onLineChat.bind(this);
        this._onTellPhone = this._onTellPhone.bind(this);
    }


    componentDidMount() {
    }


    _onLineChat(){
        goQQChat("3589002710")
    }

    _onTellPhone(){
        Linking.openURL('tel:400-107-0110')
    }

    _renderSubView(num,title,subtitle){
        return (
        <View style = {{flexDirection:"row",paddingLeft:25,paddingRight:50}}>
            <View style = {{width: 18 ,flexDirection:"column",alignItems:"center"}}>
                <View style = {{width:0.5,height:2,backgroundColor:num === 0 ? "#FFFFFF" : "#D1D1D1"}}/>
                <Image source={require('../../img/supportTip.png')}/>
                <View style = {{width:0.5,flex:1,backgroundColor:"#D1D1D1"}}/>
            </View>
            <View style= {{flex:1,flexDirection:"column",marginLeft:14}}>
                <Text style={{fontSize:16,color:"#333333"}}>{title}</Text>

                {num !== 2 && <Text style={{fontSize:16,color:"#333333",marginTop:10,marginBottom:num === 1 ? 10 : 20}}>{subtitle}</Text>}

                {num === 2 && <TouchableOpacity onPress={this._onTellPhone}>
                    <Text style={{fontSize:16,color:"#333333",marginTop:10}}>{subtitle}</Text>
                </TouchableOpacity>}

                {num === 1 &&  <TouchableOpacity onPress={this._onLineChat}>
                    <View style={[styles.buttonStyle]}>
                        <Text style={styles.buttonTextStyle}>{"在线支持"}</Text>
                    </View>
                </TouchableOpacity>}
            </View>

        </View>
        )
    }

    render(){
        return (
            <View style = {{flex:1,paddingTop:24}}>
                {this._renderSubView(0,"步骤1","请联系您的销售确认噼里啪管理系统中登记的客户手机号是否和当前绑定手机号一致，如果不一致，请销售帮忙修改后退出并重新登录。")}
                {this._renderSubView(1,"步骤2","问题依然未解决？\n技术支持在线时间为工作日10:00到18:00，您随时可以留下您的问题等待我们的处理并告知您处理结果。")}
                {this._renderSubView(2,"步骤3","如果以上都不能解决您的问题，您也可以立即拨打电话联系客服 400-107-0110。")}

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        paddingTop:10,
        paddingBottom:15
    },


    buttonStyle: {
        backgroundColor: 'transparent',
        margin: 0,
        borderRadius: 2,
        borderColor: '#CEAF72',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 26,
        width: 80,
        marginBottom: 20,
    },

    buttonTextStyle: {
        fontSize: 14,
        color: '#CEAF72',
        textAlign: 'center'
    },
});