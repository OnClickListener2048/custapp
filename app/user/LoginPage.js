/**
 * 登陆界面
 * Created by beansoft on 2017/5/19.
 */

import React, {Component} from 'react';
import {
    BackAndroid,
    DeviceEventEmitter,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    ToastAndroid,
} from 'react-native';


// import ProgressiveInput from 'react-native-progressive-input';
// 引入外部文件
import TimerButton from "../view/TimerButton";
import styles from './css/LoginPageStyle';
import px2dp from '../util'
import Toast from 'react-native-root-toast';
import SActivityIndicator from '../modules/react-native-sww-activity-indicator';
import * as apis from '../apis';
import InternetStatusView from '../modules/react-native-internet-status-view';
import {Navigation} from 'react-native-navigation';
import {DEBUG, SCREEN_WIDTH} from '../config';
import Alert from "react-native-alert";
import SubmitButton from "../view/SubmitButton";
import * as WeChat from 'react-native-wechat';
import AdapterUI from '../util/AdapterUI'

const dismissKeyboard = require('dismissKeyboard');     // 获取键盘回收方法

export default class LoginPage extends Component {
    static navigatorStyle = {
        navBarHidden: true, // 隐藏默认的顶部导航栏
        tabBarHidden: true, // 隐藏默认的底部Tab栏
    };

    // usage: this.focusField('smsCodeInput');
    focusField = (nextField) => {
        if (this.refs[nextField] !== undefined && !this.refs[nextField].isFocused()) {
            this.refs[nextField].focus();
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            mobile: '',     // 手机号
            mobileValid: false,   // 手机号有效
            mobileNotEmpty: false, // 手机号已输入
            smsCode: '',         // 短信验证码
            smsCodeValid: false,          // 短信验证码有效
            acceptLic: true,// 同意许可协议
            picURLStr: '',// 图片验证码原始地址
            picURL: {uri: ''},// 图片验证码地址
            verifyText: '',// 图片验证码提示语
            vCode: '',         // 图片验证码
            vCodeInputValid: false,          // 图片验证码输入有效
            vCodeServerValid: true,          // 图片验证码服务端有效
            // timerButtonEnable: false, // 倒计时按钮是否可用
            timerButtonClicked: false,//  倒计时按钮是否已点击
            headPad: 20,// 顶部的默认空白
        };

        // this.state.mobile = props.mobile;
        this._doLogin = this._doLogin.bind(this);
        this._requestSMSCode = this._requestSMSCode.bind(this);
        this._verifyVCode = this._verifyVCode.bind(this);
        this._doChangeVCode = this._doChangeVCode.bind(this);
        this.readUserInfo = this.readUserInfo.bind(this);
        this._keyboardDidShow = this._keyboardDidShow.bind(this);
        this._keyboardDidHide = this._keyboardDidHide.bind(this);
        this._setupDebug = this._setupDebug.bind(this);
        this.updateMobile = this.updateMobile.bind(this);
        this._goWechat = this._goWechat.bind(this);

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    }

    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        console.log('ApplicationCenterPage event.type', event.type);
        console.log('ApplicationCenterPage event', JSON.stringify(event));
        if (event.id === 'backPress') {
            BackAndroid.exitApp();
        }
    }

    _goWechat() {
        let scope = 'snsapi_userinfo';
        let state = 'wechat_sdk_demo';
        WeChat.sendAuthRequest(scope, state).then(res => {
            alert(JSON.stringify(res))
            console.log(JSON.stringify(res));
            // {"code":"071Na2zw1jxpWb0Q1kzw1Al0zw1Na2zh","state":"wechat_sdk_demo","appid":"wx16da5000356a9497","errCode":0,"type":"SendAuth.Resp"}
            // fetch('https://x-id.i-counting.cn/ua/wechat/callback?code='+res.code).then(response=>{
            //
            // })
            // apis.wechatCallback(res.code).then(
            //     responseData => {
            //         console.log('UAA responseData', responseData)
            //     },
            //     e => {
            //         console.log('出错了', e);
            //     },
            // );
        })

    }

    //debug only
    _setupDebug() {
        UserInfoStore.getLastUserPhone().then(
            (mobile) => {
                if (mobile !== null) {
                    this.setState({
                        mobile: mobile,     // 手机号
                        mobileValid: true,   // 手机号有效
                        // smsCode: '888888',         // 短信验证码
                        // smsCodeValid: true,        // 短信验证码有效
                        // acceptLic: true,
                        // vCode: 'E69M',         // 图片验证码
                        // vCodeInputValid: false,          // 图片验证码有效
                    });
                }
            },
            (e) => {
                console.log("读取信息错误:", e);
            },
        );


    }


    back() {
        Navigation.dismissModal({
            animationType: 'slide-down' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
        });
    }

    // 返回
    pop() {
        // 发送通知
        DeviceEventEmitter.emit('loginSuccess', true);

        Navigation.dismissModal({
            animationType: 'slide-down' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
        });

        if (this.props.navigator) {
            console.log("popToRoot");
            this.props.navigator.popToRoot();
        }
    }

    // 准备加载组件
    componentWillMount() {
        // 发送通知
        DeviceEventEmitter.emit('isHiddenTabBar', true);
        if (DEBUG) {
            this._setupDebug();
        }

        // let {isReset = false } = this.props;// 重置, 清理所有登录信息
        //
        // if (isReset) {
        //     loginJumpSingleton.reset();
        // }

        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    // 屏蔽返回按键
    componentDidMount() {
        console.log('BackAndroid=', BackAndroid);

        // if(BackAndroid !== null) {
        //     console.log('BackAndroid !== null', BackAndroid !== null);
        //     BackAndroid.addEventListener('hardwareBackPress',function(){
        //         console.log('hardwareBackPress');
        //             BackAndroid.exitApp();
        //             return false;
        //     });
        // }
    }

    // 准备销毁组件
    componentWillUnmount() {
        // 发送通知
        DeviceEventEmitter.emit('isHiddenTabBar', false);
        loginJumpSingleton.isJumpingLogin = false;
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    // 小屏键盘显示适配
    _keyboardDidShow() {
        console.log('Keyboard Shown SCREEN_WIDTH=', SCREEN_WIDTH);
        if (SCREEN_WIDTH <= 360) {// 屏幕小于5寸
            this.setState({headPad: 0});
        }
    }

    // 小屏键盘显示适配
    _keyboardDidHide() {
        console.log('Keyboard Hidden');
        if (SCREEN_WIDTH < 360) {
            this.setState({headPad: 20});
        }
    }

    // 请求短信验证码
    _requestSMSCode(shouldStartCountting) {
        console.log('_requestSMSCode');
        if (this.state.mobileValid && this.state.vCodeServerValid) {
            apis.sendVerifyCode(this.state.mobile, this.state.vCodeInputValid ? this.state.vCode : null).then(
                (responseData) => {
                    Toast.show('短信验证码已发送');

                    // Toast.show('测试环境短信验证码:' + responseData.msg);
                    // Toast.show('测试环境短信验证码 ' + responseData.msg,
                    //     {position: Toast.positions.TOP, duration: Toast.durations.LONG, backgroundColor: 'green'});
                }, (e) => {
                    console.log("短信验证码获取失败" + JSON.stringify(e));
                    let msg = e.msg;
                    if (msg !== undefined) {
                        if (!msg.includes("图形验证码")) {
                            Alert.alert('', msg,
                                [
                                    {
                                        text: '确定',
                                        onPress: () => {

                                        },
                                    },]
                                , {cancelable: true});
                        }
                    } else {
                        Alert.alert('', '短信验证码获取失败',
                            [
                                {
                                    text: '确定',
                                    onPress: () => {

                                    },
                                },]
                            , {cancelable: true});
                    }
                    try {
                        if (e.data !== undefined && e.data.verifyText !== null && e.data.verify !== null) {
                            let {verifyText, verify} = e.data;
                            if (verify !== null && verify.length > 0) {
                                let picStr = "https://" + verify + "?phone=" + this.state.mobile + "&t=" + new Date().getTime();
                                console.log('***** 请求图片', picStr);
                                let picURL = {uri: picStr};
                                this.setState({picURL});
                                let picURLStr = verify;
                                this.setState({picURLStr});
                            }

                            if (verifyText !== null && verifyText.length > 0) {
                                this.setState({vCodeServerValid: false});
                                this.setState({verifyText});
                            }

                            console.log("**** refs", this.refs);
                            // 重置允许获取验证码
                            if (this.refs.timerButton.state.counting) {
                                this.refs.timerButton.reset();
                            }
                            this.setState({timerButtonClicked: false});
                        }
                    } catch (e) {
                        console.log("验证码异常*******", e);
                        // 重置允许获取验证码
                        if (this.refs.timerButton.state.counting) {
                            this.refs.timerButton.reset();
                        }
                        this.setState({timerButtonClicked: false});
                    }
                }
            );
        }
    }

    // 验证图形码
    _verifyVCode() {
        console.log('_verifyVCode');
        if (this.state.mobileValid) {
            apis.sendVerifyVCode(this.state.mobile, this.state.vCodeInputValid ? this.state.vCode : null).then(
                (responseData) => {
                    Toast.show('图形验证码已验证');
                    this.setState({vCodeServerValid: true});
                    // this.setState({verifyText : null});
                    // 重置允许获取验证码
                    if (this.refs.timerButton.state.counting) {
                        this.refs.timerButton.reset();
                    }
                    this.setState({timerButtonClicked: false});

                    // this.focusField('smsCodeInput');
                    // if(!this.refs.smsCodeInput.isFocused()) {
                    //     this.refs.smsCodeInput.focus();
                    // }
                }, (e) => {
                    console.log('_verifyVCode error:' + e.message);
                    // 重置允许获取验证码
                    if (this.refs.timerButton.state.counting) {
                        this.refs.timerButton.reset();
                    }
                    this.setState({timerButtonClicked: false});
                    let msg = '请输入正确的验证字符或手机号';//e.msg;
                    // if(msg === undefined) {
                    //     msg = e.message;
                    // }

                    if (msg !== undefined) {
                        Alert.alert('', msg,
                            [
                                {
                                    text: '确定',
                                    onPress: () => {

                                    },
                                },]
                            , {cancelable: true});
                    }
                    this._doChangeVCode();
                }
            );
        }
    }

    _doChangeVCode() {
        // 刷新验证码
        let picURLStr = this.state.picURLStr;
        if (picURLStr !== null && picURLStr.length > 0) {
            let picStr = "https://" + picURLStr + "?phone=" + this.state.mobile + "&t=" + new Date().getTime();
            console.log('***** 请求图片', picStr);
            let picURL = {uri: picStr};
            this.setState({picURL, vCode: '', vCodeInputValid: false});
        }
    }

    _doLogin() {
        if (!(this.state.mobileValid && this.state.acceptLic && this.state.smsCodeValid && this.state.vCodeServerValid)) {
            // Toast.show('请输入正确的手机号, 验证码并同意许可协议.');
            return;
        }
        let loading = SActivityIndicator.show(true, "登录中");
        UMTool.onEvent("login");
        apis.login(this.state.mobile, this.state.smsCode).then(
            (responseData) => {
                SActivityIndicator.hide(loading);
                console.log("登录成功返回:", responseData);
                if (responseData !== null && responseData.data !== null && responseData.data.token) {
                    UserInfoStore.setUserToken(responseData.data.token).then(
                        v => {
                            // this.readUserInfo();
                            // 到载入页
                            //     navToBootstrap();
                            this.readUserInfo();
                        },
                        e => console.log(e.message)
                    );
                }
            },
            (e) => {
                SActivityIndicator.hide(loading);
                this._doChangeVCode();
                let errMsg = e.msg;
                if (errMsg === undefined) {
                    errMsg = '请输入正确的验证码或手机号码';
                }
                Alert.alert('', errMsg,
                    [
                        {
                            text: '确定',
                            onPress: () => {
                                this.setState({smsCode: '', smsCodeValid: false});
                                this.focusField('smsCodeInput');
                            },
                        },]
                    , {cancelable: false});
            },
        );
    }

    // 读取用户信息
    readUserInfo() {
        let loading = SActivityIndicator.show(true, "载入中...");
        apis.userInfo().then(
            (responseData) => {
                SActivityIndicator.hide(loading);
                console.log("用户信息读取成功返回:", JSON.stringify(responseData));
                // Toast.show('用户信息读取成功返回' +  JSON.stringify(responseData));
                if (responseData !== null && responseData.data !== null) {
                    UserInfoStore.setLastUserPhone(responseData.data.phone);

                    UserInfoStore.setUserInfo(responseData.data).then(// 保存成功后再跳转
                        (user) => {
                            console.log("OK ===> Main:");
                            this.pop();
                        },
                        (e) => {
                            console.log("用户信息保存错误:", e);
                            this.pop();
                        },
                    );

                } else {
                    console.log("OK ===> LoginPage:");
                }
            },
            (e) => {
                SActivityIndicator.hide(loading);
                console.log("用户信息读取错误返回:", e);
            },
        );
    }

    updateMobile(mobile) {
// 如果手机号改了, 马上就重置获取验证码?
        if (this.refs.timerButton && this.refs.timerButton.state.counting) {
            this.refs.timerButton.reset();
        }
        this.setState({timerButtonClicked: false});

        mobile = mobile.replace(/[^\d]/g, '');// 过滤非数字输入
        let mobileValid = mobile.length > 0 && (mobile.match(/^([0-9]{11})?$/)) !== null;
        let mobileNotEmpty = mobile.length > 0;
        this.setState({mobile, mobileValid, mobileNotEmpty, smsCode: '', smsCodeValid: false, vCode: ''});
    }

    render() {
        return (

            <TouchableWithoutFeedback onPress={dismissKeyboard}>

                {/* 导航栏 */}
                {/*<CommunalNavBar*/}
                {/*leftItem={() => this.renderLeftItem()}*/}
                {/*titleItem={() => this.renderTitleItem()}*/}
                {/*/>*/}
                <View style={{flex: 1, backgroundColor: 'white'}}>
                    <TouchableOpacity
                        style={{height: 30, width: 30, marginTop: Platform.OS === 'ios' ? 30 : 10, marginLeft: 15}}
                        onPress={() => {
                            this.back()
                        }}>
                        <Image source={require('../img/login_back.png')}/>
                    </TouchableOpacity>
                    {/*<InternetStatusView*/}
                    {/*textToDisplay="未检测到网络连接，请确保WIFI或移动网络正常可用。"*/}
                    {/*style={{*/}
                    {/*justifyContent: 'center',*/}
                    {/*alignSelf: 'stretch',*/}
                    {/*backgroundColor: '#00000088',*/}
                    {/*marginTop: px2dp(50),*/}
                    {/*height: 25*/}
                    {/*}}*/}
                    {/*/>*/}

                    <Image source={require('../img/login_icon.png')} style={[styles.bzLogo,
                        {marginTop: px2dp(this.state.headPad)}]}/>

                    <KeyboardAvoidingView behavior='padding' style={[styles.containerKeyboard,
                        {backgroundColor: 'white'}]}
                                          keyboardVerticalOffset={0}>
                        <View style={{height: 40}}/>
                        {/*   手机号 */}
                        <View style={styles.textInputContainer}>

                            <View style={styles.textInputWrapper}>
                                <TextInput underlineColorAndroid='transparent' maxLength={11}
                                           keyboardType='numeric' value={this.state.mobile}
                                           placeholderTextColor='#BABABA'
                                           style={styles.textInput} placeholder='手机号码' returnKeyType='next'
                                           onChangeText={
                                               (mobile) => {
                                                   this.updateMobile(mobile);
                                               }
                                           }/>
                            </View>
                        </View>

                        {/*  图片验证码 */}
                        {this.state.verifyText !== null && this.state.verifyText.length > 0 &&

                        <View style={styles.textInputContainer}>

                            <View style={styles.textInputWrapper}>
                                <TextInput underlineColorAndroid='transparent'
                                           ref="vCodeInput"
                                           autoCorrect={false}
                                           value={this.state.vCode}
                                           editable={this.state.mobileValid}
                                           secureTextEntry={false} maxLength={4} keyboardType='default'
                                           style={styles.codeInput} placeholder='图形验证'
                                           placeholderTextColor='#BABABA'
                                           returnKeyType='done'
                                           onChangeText={(vCode) => {
                                               this.setState({vCode})
                                               let vCodeInputValid = (vCode.length === 4);
                                               this.setState({vCode, vCodeInputValid});
                                               if (vCodeInputValid) {
                                                   dismissKeyboard();
                                               }
                                           }}

                                           onBlur={() => {
                                               dismissKeyboard();
                                               if (this.state.vCodeInputValid && !this.state.vCodeServerValid) {
                                                   this._verifyVCode();
                                               }
                                           }}

                                           onSubmitEditing={() => {
                                               dismissKeyboard();
                                               //this._verifyVCode();
                                           }}
                                />

                                <TouchableWithoutFeedback onPress={this._doChangeVCode}>
                                    <Image style={{width: 69, marginRight: 0, height: 34, alignSelf: 'center',}}
                                           source={this.state.picURL}/>
                                </TouchableWithoutFeedback>

                            </View>
                        </View>
                        }

                        {/*  短信验证码 */}
                        <View style={styles.textInputContainer}>

                            <View style={styles.textInputWrapper}>
                                <TextInput underlineColorAndroid='transparent'
                                           value={this.state.smsCode}
                                           ref="smsCodeInput"
                                           editable={this.state.mobileValid && this.state.vCodeServerValid && this.state.timerButtonClicked}
                                           secureTextEntry={false} maxLength={6} keyboardType='numeric'
                                           style={styles.codeInput} placeholder='短信验证'
                                           placeholderTextColor='#BABABA'
                                           returnKeyType='done'
                                           onChangeText={(smsCode) => {
                                               this.setState({smsCode})
                                               let smsCodeValid = (smsCode.length === 6);
                                               this.setState({smsCode, smsCodeValid});
                                               if (smsCodeValid) {
                                                   dismissKeyboard();
                                               }
                                           }}

                                           onBlur={() => {
                                               dismissKeyboard();
                                           }}

                                           onSubmitEditing={() => {
                                               dismissKeyboard();
                                           }}
                                />

                                <View style={{
                                    height: 15,
                                    width: 1,
                                    backgroundColor: '#c8c8c8',
                                    alignSelf: 'center',
                                    marginRight: 1
                                }}/>

                                <TimerButton enable={this.state.mobileValid && this.state.vCodeServerValid}
                                             ref="timerButton"
                                             style={{width: 70, marginRight: 0, height: 44, alignSelf: 'flex-end',}}
                                             textStyle={{color: '#6A6A6A', alignSelf: 'flex-end'}}
                                             timerCount={80}
                                             onClick={(shouldStartCountting) => {
                                                 shouldStartCountting(true);
                                                 this.setState({timerButtonClicked: true});
                                                 this._requestSMSCode(shouldStartCountting);
                                             }}/>
                            </View>
                        </View>

                        {/*  协议 */}
                        <View style={[styles.textInputContainer,
                            {marginTop: 2}]}>
                            <TouchableOpacity
                                style={{alignSelf: 'center'}} onPress={() => {
                                dismissKeyboard();
                                let _acceptLic = !this.state.acceptLic;
                                console.log('_acceptLic', _acceptLic);
                                this.setState({acceptLic: _acceptLic});
                            }}>
                            </TouchableOpacity>
                            <View style={[styles.textInputWrapper,
                                {justifyContent: 'flex-start', borderBottomWidth: 0}]}>
                                <Text style={{
                                    color: ( this.state.acceptLic ? '#BABABA' : '#BABABA'),
                                    alignSelf: 'center',
                                    marginRight: 1,
                                    fontSize: 12
                                }}
                                >点击登录即视为同意</Text>
                                <Text style={{
                                    color: ( this.state.acceptLic ? '#BABABA' : '#BABABA'),
                                    fontSize: (Platform.OS === 'ios') ? 12 : 11,
                                    alignSelf: 'center',
                                    textDecorationLine: 'underline',
                                    marginRight: 1
                                }}
                                >《用户注册和使用协议》</Text>
                            </View>

                        </View>

                        {/*<TouchableWithoutFeedback onPress={this._doLogin}>*/}
                        {/*<View style={[styles.buttonview,*/}
                        {/*{*/}
                        {/*backgroundColor: (*/}
                        {/*(this.state.mobileValid && this.state.acceptLic && this.state.smsCodeValid  ) ? '#ef0c35' : '#e6e6e6')*/}
                        {/*}]}>*/}
                        {/*<Text style={styles.logintext}>登录</Text>*/}
                        {/*</View>*/}
                        {/*</TouchableWithoutFeedback>*/}

                        <SubmitButton onPress={this._doLogin}
                                      isEnabled={(this.state.mobileValid && this.state.acceptLic && this.state.smsCodeValid)}
                                      text="登录"
                        />
                        <View style={styles.wechart_text}>
                            <View style={styles.line}/>
                            <Text style={styles.wechart_te}>
                                第三方登录
                            </Text>
                            <View style={styles.line}/>

                        </View>
                        <View style={[styles.wechart_text, {marginTop: 20}]}>
                            <TouchableOpacity onPress={() => {
                                this._goWechat()
                            }}>

                                <Image style={[styles.wechart_icon, {justifyContent: 'center'}]}
                                       source={require('../img/wechart.png')}/>
                            </TouchableOpacity>
                        </View>

                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}


// AppRegistry.registerComponent('ReactDemo', () => ReactDemo);