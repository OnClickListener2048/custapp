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
import * as apis from '../apis';
import InternetStatusView from '../modules/react-native-internet-status-view';
import {Navigation} from 'react-native-navigation';
import {DEBUG, SCREEN_WIDTH} from '../config';
import Alert from "react-native-alert";
import SubmitButton from "../view/SubmitButton";
import * as WeChat from 'react-native-wechat';
import AdapterUI from '../util/AdapterUI'
import SubmitButtonWithIcon from "../view/SubmitButtonWithIcon";

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
            isInWechatLoading: false,//是否正在进行微信登录中, 避免重复点击

        };

        // this.state.mobile = props.mobile;

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

    // 执行登陆操作
    _doWeChatLogin = () => {
        let scope = 'snsapi_userinfo';
        let state = 'wechat_sdk_demo';
        this.setState({isInWechatLoading: true});
        let loading = SActivityIndicator.show(true, "微信登录中...");
        WeChat.sendAuthRequest(scope, state).then(
            res => {
                console.log(JSON.stringify(res));
                // {"code":"071Na2zw1jxpWb0Q1kzw1Al0zw1Na2zh","state":"wechat_sdk_demo","appid":"wx16da5000356a9497","errCode":0,"type":"SendAuth.Resp"}
                // fetch('https://x-id.i-counting.cn/ua/wechat/callback?code='+res.code).then(response=>{
                //
                // })
                // if(res === null || res.code !== 0) {
                //
                // }
                apis.wechatToken(res.code).then(
                    responseData => {
                        SActivityIndicator.hide(loading);
                        console.log('wechat token responseData', responseData);
                        this.setState({isInWechatLoading: false});
                        let result = JSON.parse(responseData);
                        if (result.code === 0 && result.access_token !== undefined) {
                            console.log('save access_token');
                            //绑定openID为用户别名
                            // JPushModule.setAlias(DeviceInfo.OS,function () {
                            //     console.log('绑定成功',DeviceInfo.OS)
                            // },function () {
                            //     console.log('绑定失败')
                            //
                            // })
                            // //设置分组
                            // JPushModule.setTags("我的分组",function () {
                            //     console.log('设置分组成功')
                            // },function () {
                            //     console.log('设置分组失败')
                            // })

                            UserInfoStore.setUserToken(result.access_token).then(
                                v => {
                                    this.readUserInfo();// TODO 获取用户信息
                                },
                                e => console.log(e.message)
                            );
                        } else {
                            Alert.alert(result.msg);
                        }
                    },
                    e => {
                        this.setState({isInWechatLoading: false});
                        Toast.show("对不起, 操作已取消.");
                        console.log('出错了', e);
                        SActivityIndicator.hide(loading);
                    },
                );
            },
            e => {
                this.setState({isInWechatLoading: false});
                Toast.show("对不起, 操作已取消或失败, 请稍候重试.");
                console.log('出错了', e);
                SActivityIndicator.hide(loading);
            });
    };

    _goWechat() {
        WeChat.isWXAppInstalled().then(
            v => {
                if (!v) {
                    Toast.show("对不起, 您的设备上必须首先安装微信才能登陆.");
                } else {
                    this._doWeChatLogin();
                }
            },
            e => {
                Toast.show("对不起, 您的设备上必须首先安装微信才能登陆.");
            }
        );
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
        //登录后刷新服务页面的数据
        DeviceEventEmitter.emit('ChangeCompany');


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
                                this.setState({picURLStr: verify});
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


    // 读取用户信息
    readUserInfo() {
        let loading = SActivityIndicator.show(true, "载入中...");
        apis.userInfo().then(
            (responseData) => {
                SActivityIndicator.hide(loading);
                /*
                {"code":0,"user":{"username":"8018b38a-1836-44ab-a0c9-9cf00a623e50","nickname":"Changjiong.Liu","email":null,"name":"Changjiong.Liu","mobilePhone":null,"sex":"1","avatar":"http://wx.qlogo.cn/mmopen/vi_32/ajNVdqHZLLDtt0ic4ia8rpMribw4y8JeobBuhu3hdibFJOjU4FxXLkSC28Jbg46K4LbPaGEXoLhOetGBFzx1baadPg/0","roles":["USER_INFO"]}}
                */
                console.log("用户信息读取成功返回:", JSON.stringify(responseData));
                if (responseData && responseData.user) {
                    if (responseData.user.mobilePhone) {
                        UserInfoStore.setLastUserPhone(responseData.user.mobilePhone).then();
                        UserInfoStore.setUserInfo(responseData.user).then();
                        //修改这个参数得到公司信息数据 responseData.user.mobilePhone   '18099990000' responseData.user.mobilePhone
                        loading = SActivityIndicator.show(true, "读取公司信息中...")
                        apis.getCompany(responseData.user.mobilePhone).then(
                            (companyInfo) => {
                                console.log("公司信息读取返回", companyInfo);
                                SActivityIndicator.hide(loading);
                                if (companyInfo && companyInfo.list) {

                                    console.log("公司信息读取成功返回:", JSON.stringify(companyInfo));

                                    let tmpCompaniesArr = companyInfo.list;

                                    //需要注掉到时候
                                    UserInfoStore.setCompanyArr(tmpCompaniesArr).then(
                                        (user) => {
                                            console.log("公司信息保存成功");
                                            this.pop();
                                        },
                                        (e) => {
                                            console.log("公司信息保存错误:", e);
                                            this.pop();
                                        },
                                    );
                                    if (tmpCompaniesArr.length > 0) {
                                        UserInfoStore.setCompany(tmpCompaniesArr[0]).then(
                                            (user) => {
                                                console.log("公司信息保存成功");
                                                this.pop();
                                            },
                                            (e) => {
                                                console.log("公司信息保存错误:", e);
                                                this.pop();
                                            },
                                        );
                                    } else {
                                        this.pop();// bug 修复: 无公司数据时不能返回
                                    }
                                } else {
                                    UserInfoStore.removeCompany().then();
                                    UserInfoStore.removeCompanyArr().then();
                                    this.pop();
                                }
                            },
                            (e) => {
                                SActivityIndicator.hide(loading);
                                UserInfoStore.removeCompany().then();
                                UserInfoStore.removeCompanyArr().then();

                                console.log("公司信息读取错误返回:", e);
                                this.pop();
                            },
                        );
                    } else {
                        // 没有手机号, 强制转往绑定手机页面
                        UserInfoStore.removeLastUserPhone().then();
                        UserInfoStore.setUserInfo(responseData.user).then(// 保存成功后再跳转
                            (user) => {
                                console.log("用户信息保存OK");
                                this.props.navigator.push({
                                    screen: 'FirstBindPhonePage',
                                    title: ''
                                });
                            },
                            (e) => {
                                console.log("用户信息保存错误:", e);
                                // this.pop();
                            },
                        );
                    }


                } else {
                    console.log("OK ===> LoginPage:");
                }
            },
            (e) => {
                SActivityIndicator.hide(loading);
                console.log("用户信息读取错误返回:", e);
                Toast.show('用户信息读取失败' + errorText(e), {
                    position: Toast.positions.CENTER,
                    duration: Toast.durations.LONG,
                    backgroundColor: 'red'
                });
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

                        <Image style={[styles.wechart_icon, {justifyContent: 'center'}]}
                               source={require('../img/cloud.png')}/>

                        {/*<TouchableWithoutFeedback onPress={this._doLogin}>*/}
                        {/*<View style={[styles.buttonview,*/}
                        {/*{*/}
                        {/*backgroundColor: (*/}
                        {/*(this.state.mobileValid && this.state.acceptLic && this.state.smsCodeValid  ) ? '#ef0c35' : '#e6e6e6')*/}
                        {/*}]}>*/}
                        {/*<Text style={styles.logintext}>登录</Text>*/}
                        {/*</View>*/}
                        {/*</TouchableWithoutFeedback>*/}
                        <SubmitButtonWithIcon onPress={this._goWechat} buttonStyle={{marginTop: 50}} isEnabled={!this.state.isInWechatLoading}
                                              text={this.state.isInWechatLoading ? "登录中..." : "微信登录"}
                        />

                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}


// AppRegistry.registerComponent('ReactDemo', () => ReactDemo);