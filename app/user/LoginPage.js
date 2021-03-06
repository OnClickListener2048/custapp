/**
 * 登陆界面
 * Created by beansoft on 2017/5/19.
 */

import React, {Component, PropTypes} from 'react';
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
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
// import ProgressiveInput from 'react-native-progressive-input';
// 引入外部文件
import styles from './css/LoginPageStyle';
import px2dp from '../util'
import Toast from 'react-native-root-toast';
import * as apis from '../apis';
import {Navigation} from 'react-native-navigation';
import {GUI_TEST, SCREEN_WIDTH} from '../config';
import Alert from "react-native-alert";
import SubmitButton from "../view/SubmitButton";
import * as WeChat from 'react-native-wechat';
import SubmitButtonWithIcon from "../view/SubmitButtonWithIcon";
import loadUserInfo from '../util/LoadUserInfoUtil';
import {isMobile} from '../util/StringUtil';

const dismissKeyboard = require('dismissKeyboard');     // 获取键盘回收方法
export default class LoginPage extends Component {
    static navigatorStyle = {
        navBarHidden: true, // 隐藏默认的顶部导航栏
        tabBarHidden: true, // 隐藏默认的底部Tab栏
    };

    static propTypes = {
        callback: PropTypes.func, // 登陆后的回调, 可选
    };

    // usage: this.focusField('smsCodeInput');
    focusField = (nextField) => {
        if (this.refs[nextField] !== undefined && !this.refs[nextField].isFocused()) {
            this.refs[nextField].focus();
        }
    };

    constructor(props) {
        super(props);
        global._inWechatCallback = false;// 是否在微信回调中, 全局变量, TODO, 所有全局变量集中存储

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
            isInWechatLoading: false,//是否正在进行微信登录中, 避免重复点击
            centerBlankHeight: 40, // logo区域和下方的间距
            submitButtonMarginTop: 50, // 微信登录按钮和上方的间距
            openMobileLogin: true, // 是否启用手机号登陆模式, 仅针对iOS AppStore提审
            mobileLogin: true, // 显示手机号登陆模式, 仅针对iOS AppStore提审
            passwordValid: false, // 手机模式密码
            password: '', // 手机模式密码有效
            loading: false, // 是否载入中, 载入中不能点击任何按钮
        };

        // this.state.mobile = props.mobile;

        this.readUserInfo = this.readUserInfo.bind(this);
        this._keyboardDidShow = this._keyboardDidShow.bind(this);
        this._keyboardDidHide = this._keyboardDidHide.bind(this);
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


    // 执行登陆操作
    _doWeChatLogin = () => {
        let scope = 'snsapi_userinfo';
        let state = 'wechat_sdk_demo';
        // this.setState({isInWechatLoading: true, loading: true});
        // let loading = SActivityIndicator.show(true, "尝试微信登录中...");

        // let _timer = setTimeout(() => {
        //     SActivityIndicator.hide(loading);
        //     if (this.state.isInWechatLoading) {
        //         this.setState({isInWechatLoading: false});//10秒后可点击返回
        //         this.setState({loading: false});
        //         Toast.show("操作超时");
        //     }
        //     clearTimeout(_timer);
        // }, 10000);

        WeChat.sendAuthRequest(scope, state).then(
            res => {
                if (global._inWechatCallback) {
                    console.log("已经在微信回调中");
                    return;
                }

                global._inWechatCallback = true;
                console.log("wechat sendAuthRequest()", JSON.stringify(res));
                // {"code":"071Na2zw1jxpWb0Q1kzw1Al0zw1Na2zh","state":"wechat_sdk_demo","appid":"wx16da5000356a9497","errCode":0,"type":"SendAuth.Resp"}
                // fetch('https://x-id.i-counting.cn/ua/wechat/callback?code='+res.code).then(response=>{
                //
                // })
                // if(res === null || res.code !== 0) {
                //
                // }
                apis.wechatToken(res.code).then(
                    responseData => {
                        // SActivityIndicator.hide(loading);
                        console.log('wechat token responseData', responseData);
                        // this.setState({isInWechatLoading: false});
                        let result = JSON.parse(responseData);
                        if (result.code === 0 && result.access_token) {
                            console.log('save access_token');

                            UserInfoStore.setUserToken(result.access_token).then(
                                v => {
                                    this.readUserInfo();// TODO 获取用户信息
                                },
                                e => {
                                    console.log(e.message)
                                    this.setState({isInWechatLoading: false});
                                    Toast.show("对不起, 操作已取消");
                                }
                            );
                        } else {
                            Alert.alert(result.msg);
                            this.setState({isInWechatLoading: false});
                            this.setState({loading: false});
                        }

                        global._inWechatCallback = false;
                    },
                    e => {
                        this.setState({isInWechatLoading: false});
                        Toast.show("对不起, 操作已取消");
                        console.log('出错了', e);
                        SActivityIndicator.hide(loading);
                        this.setState({loading: false});
                        global._inWechatCallback = false;
                    },
                );
            },
            e => {
                // this.setState({isInWechatLoading: false});
                // this.setState({loading: false});
                Toast.show("对不起, 操作已取消或失败, 请稍候重试");
                console.log('出错了', e);
                // SActivityIndicator.hide(loading);
                global._inWechatCallback = false;
            });
    };


    _goWechat() {
        WeChat.isWXAppInstalled().then(
            v => {
                console.log(v);

                if (!v) {
                    Toast.show("对不起, 您的设备上必须首先安装微信才能登陆.");
                } else {
                    this._doWeChatLogin();
                }
            },
            e => {
                console.log(e);
                Toast.show("对不起, 您的设备上必须首先安装微信才能登陆." + e);
            }
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
        // DeviceEventEmitter.emit('loginSuccess', true);
        //登录后刷新服务页面的数据
        DeviceEventEmitter.emit('ChangeCompany');
        DeviceEventEmitter.emit('ReloadMessage');

        this.props.callback && this.props.callback()
        Navigation.dismissModal({
            animationType: 'slide-down' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
        });

        // if (this.props.navigator) {
        //     console.log("popToRoot");
        //     this.props.navigator.popToRoot();
        // }
    }

    // 准备加载组件
    componentWillMount() {
        let deviceModel = DeviceInfo.getModel();
        // iPad 特殊处理, 便于苹果审核通过
        if (deviceModel && deviceModel.toLowerCase().includes('ipad')) {
            this.setState({centerBlankHeight: 0, submitButtonMarginTop: 0});
        }

        // 只针对ios处理
        if (Platform.OS === 'ios' || GUI_TEST) {
            UserInfoStore.getMobileLoginInfo().then(
                v => {
                    console.log(v);
                    // v.open = !v.open;// 调试开关反转
                    if (v) {
                        this.setState({openMobileLogin: v.open});
                        this.setState({openMobileInfo: v});
                    } else {
                        this.setState({openMobileLogin: false});
                    }
                }, e => {
                    console.log(e);
                    this.setState({openMobileLogin: false});
                }
            );
        } else {
            // Android一直打开微信登录
            this.setState({openMobileLogin: false});
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


    // 读取用户信息
    readUserInfo() {
        let _this = this;
        loadUserInfo({
            type: 'login',
            callback: function (res) {
                _this.setState({loading: false});
                if (res.code === 0 && res.userType === 0) {
                    _this.props.navigator.push({
                        screen: 'FirstBindPhonePage',
                        title: '',
                        passProps: {
                            callback: _this.props.callback
                        }
                    });
                } else {
                    _this.pop();
                }
            },
        })
    }

    updateMobile(mobile) {
        mobile = mobile.replace(/[^\d]/g, '');// 过滤非数字输入
        let mobileValid = isMobile(mobile);
        console.log('mobileValid22', mobileValid);
        let mobileNotEmpty = mobile.length > 0;
        this.setState({mobile, mobileValid, mobileNotEmpty, vCode: ''});
    }

    // 执行账号登陆逻辑
    _doPhoneLogin = () => {
        let loading = SActivityIndicator.show(true, "登录中...");
        let _timer = setTimeout(() => {
            SActivityIndicator.hide(loading);
            clearTimeout(_timer);
            let openMobileInfo = this.state.openMobileInfo;

            if (openMobileInfo && openMobileInfo.mobile === this.state.mobile && openMobileInfo.passwd === this.state.password
                && openMobileInfo.token) {
                UserInfoStore.setUserToken(openMobileInfo.token).then(
                    v => {
                        this.readUserInfo(); // 获取用户信息
                    },
                    e => console.log(e.message)
                );
            } else {
                Alert.alert("对不起", "您输入的手机号或密码不正确");
            }
        }, 1500);
    };

    // 渲染手机登陆界面
    renderMobileLogin = () => {
        if (this.state.openMobileLogin) {
            return (
                <KeyboardAvoidingView behavior='padding' style={[styles.containerKeyboard,
                    {backgroundColor: 'white'}]}
                                      keyboardVerticalOffset={0}>
                    <View style={{height: 40}}/>
                    <View style={styles.textInputContainer}>

                        <View style={styles.textInputWrapper}>
                            <TextInput underlineColorAndroid='transparent' maxLength={11}
                                       keyboardType='numeric' value={this.state.mobile}
                                       placeholderTextColor='#BABABA'
                                       accessibilityLabel="mobile" testID="mobile"
                                       style={styles.textInput} placeholder='手机号码' returnKeyType='next'
                                       onChangeText={
                                           (mobile) => {
                                               this.updateMobile(mobile);
                                           }
                                       }/>
                        </View>
                    </View>


                    {/*   密码 */}
                    <View style={[styles.textInputContainer,
                        {marginTop: 2}]}>

                        <View style={styles.textInputWrapper}>
                            <TextInput underlineColorAndroid='transparent' maxLength={11}
                                       keyboardType='default' value={this.state.password}
                                       secureTextEntry={true}
                                       placeholderTextColor='#BABABA'
                                       accessibilityLabel="password" testID="password"
                                       style={styles.textInput} placeholder='密码' returnKeyType='next'
                                       onChangeText={
                                           (password) => {
                                               this.setState({password})
                                               let passwordValid = (password.length >= 6);
                                               this.setState({password, passwordValid});
                                               if (passwordValid) {
                                                   dismissKeyboard();
                                               }
                                           }
                                       }

                                       onBlur={() => {
                                           dismissKeyboard();
                                       }}

                                       onSubmitEditing={() => {
                                           dismissKeyboard();
                                       }}

                            />
                        </View>
                    </View>

                    {/*  协议 */
                    }
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
                                color: (this.state.acceptLic ? '#BABABA' : '#BABABA'),
                                alignSelf: 'center',
                                marginRight: 1,
                                fontSize: 12
                            }}
                            >点击登录即视为同意</Text>
                            <Text style={{
                                color: (this.state.acceptLic ? '#BABABA' : '#BABABA'),
                                fontSize: (Platform.OS === 'ios') ? 12 : 11,
                                alignSelf: 'center',
                                textDecorationLine: 'underline',
                                marginRight: 1
                            }}
                            >《用户注册和使用协议》</Text>
                        </View>

                    </View>

                    <SubmitButton onPress={this._doPhoneLogin}
                                  accessibilityLabel="phoneLoginSubmit" testID="phoneLoginSubmit"
                                  isEnabled={(this.state.mobileValid && this.state.passwordValid)}
                                  text="登录"
                    />
                </KeyboardAvoidingView>
            );
        }

        return null;
    };

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


                    <Image source={require('../img/login_icon.png')} style={[styles.bzLogo,
                        {marginTop: px2dp(this.state.headPad)}]}/>

                    {
                        this.renderMobileLogin()
                    }

                    {!this.state.openMobileLogin && !this.state.loading &&
                    <KeyboardAvoidingView behavior='padding' style={[styles.containerKeyboard,
                        {backgroundColor: 'white'}]}
                                          keyboardVerticalOffset={0}>
                        <View style={{height: this.state.centerBlankHeight}}/>

                        <Image style={[styles.wechart_icon, {justifyContent: 'center'}]}
                               source={require('../img/cloud.png')}/>

                        <SubmitButtonWithIcon accessibilityLabel="SubmitButton" testID="SubmitButton"
                                              onPress={this._goWechat}
                                              buttonStyle={{marginTop: this.state.submitButtonMarginTop}}
                                              isEnabled={!this.state.isInWechatLoading}
                                              text={this.state.isInWechatLoading ? "登录中..." : "微信登录"}
                        />


                        <TouchableOpacity onPress={() => {
                            this.props.navigator.push({
                                screen: 'SupportPage',
                                title: '技术支持',
                            });
                        }}
                                          style={{
                                              marginTop: 20,
                                              marginRight: 30,
                                          }}>

                            <Text style={{color:'#999999',
                                fontSize: 14, alignSelf: 'flex-end'}}>登录遇到问题?</Text>
                        </TouchableOpacity>


                    </KeyboardAvoidingView>
                    }

                </View>
            </TouchableWithoutFeedback>
        );
    }
}


// AppRegistry.registerComponent('ReactDemo', () => ReactDemo);