/**
 * Created by liufei on 2017/9/15.
 */

import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    Platform,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../config';
import CommenCell from '../../view/CommenCell'
export default class MinePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource:[]
        };

    }
    static navigatorStyle = {
        navBarHidden: true, // 隐藏默认的顶部导航栏
        tabBarHidden: false, // 默认隐藏底部标签栏
    };

    render(){
        return(
            <View style={{flex:1,backgroundColor:'#f9f9f9',position:'relative'}}>
                <View style={{width:DeviceInfo.width,height:DeviceInfo.height/3,backgroundColor:'white',position:'absolute'}}/>
                <ScrollView
                    contentContainerStyle={{backgroundColor:'#F9F9F9'}}>
                    <TouchableOpacity style={styles.login_wrapper} onPress={this.login.bind(this)}>
                        <View style={{flexDirection:'row'}}>
                            <Image style={styles.head_img} source={require('../../img/head_img.png')}/>
                            <View style={styles.login_title_wrapper}>
                                <Text style={styles.login}>
                                    注册/登录
                                </Text>
                                <Text style={styles.company}>
                                    请立即注册或登录
                                </Text>
                            </View>
                        </View>
                        <Image style={styles.left_bu} source={require('../../img/left_button.png')}/>
                    </TouchableOpacity>
                    <CommenCell
                        leftText="我的订单"
                        style={{marginTop:9}}
                        onPress = {this._goto.bind(this,'')}
                    />
                    <CommenCell
                        leftText="企业信息"
                        onPress = {this._goto.bind(this,'CompanyInfoPage')}
                    />
                    <CommenCell
                        leftText="账号与安全"
                        onPress = {this._goto.bind(this,'BindPhonePage')}
                        style={{marginTop:9}}
                    />
                    <CommenCell
                        leftText="设置"
                        onPress = {this._goto.bind(this,'SettingPage')}
                    />
                    <CommenCell
                        leftText="联系客服"
                        style={{marginTop:9}}
                        onPress = {this._goto.bind(this,'')}
                    />
                </ScrollView>
            </View>

        )
    }
    _goto(screen){

        if(screen == '')return;

        this.props.navigator.push({
            screen: screen,
        });

    }
    login(){
        loginJumpSingleton.goToLogin(this.props.navigator);
    }

}

const styles = StyleSheet.create({
    login_wrapper:{
        flexDirection:'row',
        width:SCREEN_WIDTH,
        paddingHorizontal:20,
        paddingTop:Platform.OS==='ios'?70:50,
        paddingBottom:20,
        backgroundColor:'#FFFFFF',
        justifyContent:'space-between'
    },

    head_img:{
        resizeMode: "contain",
    },
    login_title_wrapper:{
        marginTop:13,
        marginLeft:10
    },
    login:{
        fontSize:18,
        color:'#333333',
    },
    company:{
        fontSize:14,
        color:'#999999'
    },
    left_bu:{
        resizeMode: "contain",
        marginTop:20,
        marginLeft:10
    },
    items:{
        flexDirection:'row',
        width:SCREEN_WIDTH,
        paddingHorizontal:20,
        backgroundColor:'#FFFFFF',
        marginTop:10,
        paddingVertical:20,
        alignItems:'center',
        justifyContent:'space-between'
    },
    items_text:{
        fontSize:16,
        color:'#333333',

    },
    items_button:{
        resizeMode: "contain",
    },
    line:{
        height:1,
        width:SCREEN_WIDTH,
        borderBottomColor:'#ececec',
        borderBottomWidth:0.5 ,
        backgroundColor:'transparent'
    },

})