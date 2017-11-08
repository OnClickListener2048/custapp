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
    ScrollView,
    Linking
} from 'react-native';
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../config';
import CommenCell from '../../view/CommenCell'
import BComponent from '../../base';
import Alert from "react-native-alert";
import Toast from 'react-native-root-toast';

export default class MinePage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            phone: '注册/登录', //手机号
            avatar: require('../../img/head_img.png'),// 头像
            company: '请立即注册或登录',//公司名称
            logined: false,// 是否已登陆
        };

        this.initPage = this.initPage.bind(this);
        this.reset = this.reset.bind(this);
    }
    static navigatorStyle = {
        navBarHidden: true, // 隐藏默认的顶部导航栏
        tabBarHidden: false, // 默认隐藏底部标签栏
    };

    // 子类请继承此方法, 不要忘了调用super.onNavigatorEvent(event);
    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        console.log('MinePage', event.id);//willAppear
        super.onNavigatorEvent(event);
        if (event.id === 'willAppear') {
            this.initPage();
        }

    }

    reset() {
        this.setState({
            phone: '注册/登录', //手机号
            avatar: require('../../img/head_img.png'),// 头像
            company: '请立即注册或登录',//公司名称
            logined: false,// 是否已登陆
        });
    }

    // 准备加载组件
    componentWillMount() {
        this.initPage();
    }

    initPage() {
        console.log('MinePage', 'initPage');
        UserInfoStore.isLogined().then(
            logined => {
                    console.log('MinePage logined', logined);
                    this.setState({logined:logined});
                    if(!logined) {
                        this.reset();
                    } else {
                        UserInfoStore.getUserInfo().then(
                            (user) => {
                                if (user !== null) {
                                    this.setState({userName: user.name, phone: user.mobilePhone});

                                    if(user.avatar !== null) {
                                        console.log('MinePage', user.avatar);
                                        this.setState({avatar: {uri:user.avatar}});
                                    }
                                } else {
                                    this.reset();
                                }
                            },
                            (e) => {
                                console.log("读取信息错误:", e);
                                this.reset();
                            },
                        );

                        UserInfoStore.getCompany().then(
                            (company) => {
                                console.log('company', company);
                                if (company && company.infos && company.infos[0] && company.infos[0].value) {
                                    this.setState({company: company.infos[0].value});
                                } else {
                                    this.setState({company: ''});
                                }
                            },
                            (e) => {
                                console.log("读取信息错误:", e);
                            },
                        );
                    }
                },
            e => {
                console.log("读取登陆状态错误:", e);
                this.reset();
            }
        );
    }

    render(){
        return(
            <View style={{flex:1,backgroundColor:'#f9f9f9',position:'relative'}}>
                <View style={{width:DeviceInfo.width,height:DeviceInfo.height/3,backgroundColor:'white',position:'absolute'}}/>
                <ScrollView
                    contentContainerStyle={{backgroundColor:'#F9F9F9'}}>
                    <TouchableOpacity style={styles.login_wrapper} onPress={this.login.bind(this)}>
                        <View style={{flexDirection:'row'}}>
                            <Image style={styles.head_img} source={this.state.avatar}/>
                            <View style={styles.login_title_wrapper}>
                                <Text style={styles.login}>
                                    {this.state.phone || this.state.userName}
                                </Text>
                                <Text style={styles.company}>
                                    {this.state.company}
                                </Text>
                            </View>
                        </View>
                        <Image style={styles.left_bu} source={require('../../img/left_button.png')}/>
                    </TouchableOpacity>
                    <CommenCell
                        leftText="我的订单"
                        style={{marginTop:9}}
                        onPress = {this._goto.bind(this,'MyOrderPage','我的订单')}
                    />
                    <CommenCell
                        leftText="企业信息"
                        onPress = {this._goto.bind(this,'CompanySurveyPage','企业概况')}
                    />
                    <CommenCell
                        leftText="账号与安全"
                        onPress = {this._goto.bind(this,'AccountAndSecurity','账号与安全')}
                        style={{marginTop:9}}
                    />
                    <CommenCell
                        leftText="设置"
                        onPress = {this._goto.bind(this,'SettingPage','设置')}
                    />
                    <CommenCell
                        leftText="联系客服"
                        style={{marginTop:9}}
                        onPress = {this._call.bind(this,'')}
                    />
                </ScrollView>
            </View>

        )
    }
    _call(){
        Linking.openURL('tel:400-107-0110')
    }
    _goto(screen, title ){

        // 未登录不能跳转的页面
        if(!this.state.logined) {
            if(screen === 'BindPhonePage' ||screen === 'MyOrderPage' ||screen === 'CompanySurveyPage' || screen === 'AccountAndSecurity') {
                Toast.show("请先登录")
                return;
            }
        }


        if(screen === '')return;

        this.props.navigator.push({
            screen: screen,
            title:title
        });

    }

    login(){
        if(this.state.logined) {
            this.props.navigator.push({
                screen: 'PersonalDataPage',
                title:'个人资料',
            });
        } else {
            loginJumpSingleton.goToLogin(this.props.navigator);
        }
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
        width:60,
        height:60,
        borderRadius: 30,
    },
    login_title_wrapper:{
        width:SCREEN_WIDTH-30-70-22,
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

});