// 首次绑定手机号的界面
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
    ToastAndroid,
} from 'react-native';


// import ProgressiveInput from 'react-native-progressive-input';
// 引入外部文件
import TimerButton from "../view/TimerButton";
import styles from './css/LoginPageStyle';
import px2dp from '../util'
import Toast from 'react-native-root-toast';
import '../modules/react-native-sww-activity-indicator';
import * as apis from '../apis';
import InternetStatusView from '../modules/react-native-internet-status-view';
import {Navigation} from 'react-native-navigation';
import {DEBUG, SCREEN_WIDTH} from '../config';
import Alert from "react-native-alert";
import SubmitButton from "../view/SubmitButton";
import * as WeChat from 'react-native-wechat';
import AdapterUI from '../util/AdapterUI'
import BComponent from "../base/BComponent";
import errorText from '../util/ErrorMsg';
import random from "../util/random";
import loadUserInfo from '../util/LoadUserInfoUtil';
import notEmpty from "../util/StringUtil";

const dismissKeyboard = require('dismissKeyboard');     // 获取键盘回收方法

export default class FirstBindPhonePage extends BComponent {
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
        this.state = {
            phone: '',// 现在手机号
            newMobile: '', // 新手机号
            newMobileValid: false, // 新手机号有效
            smsCode: '',         // 短信验证码
            smsCodeValid: false,          // 短信验证码有效
            timerButtonClicked: false,//  倒计时按钮是否已点击
            verifyText: '请输入图片验证码',// 图片验证码提示语
            vCode: '',         // 图片验证码
            picURL: null,// 图片验证码
            vCodeInputValid: false,
            device: random(11), // 随机
            needVcode: false,// 是否需要图形验证码
        };

        this._doChangeVCode = this._doChangeVCode.bind(this);
        this.readUserInfo = this.readUserInfo.bind(this);
        this._serviceTerm = this._serviceTerm.bind(this);
        this._requestSMSCode = this._requestSMSCode.bind(this);
    }

    componentWillMount() {
        // this._doChangeVCode();
    }

    componentDidMount() {
    }

    _serviceTerm() {
        this.props.navigator.push({
            screen: 'ServiceTermPage',
            title: '服务条款'
        });
    }

    // 刷新验证码
    _doChangeVCode() {
        if (this.state.device) {
            apis.getVerifyVCodeImage(this.state.device, 1).then(
                data => {
                    let picURL = {uri: 'data:image/jpeg;base64,' + data.img};
                    this.setState({picURL, vCode: '', vCodeInputValid: false});
                },
                e => {

                }
            );
        }
    }

    // 读取用户信息
    readUserInfo() {
        let _this = this;
        loadUserInfo({
            type:'bind',
            callback: function(res){
                if(res.code === 0){
                    DeviceEventEmitter.emit('ChangeCompany');
                }
            },
        })
        // apis.userInfo().then(
        //     (responseData) => {
        //         console.log("用户信息读取成功返回:", JSON.stringify(responseData));
        //         if (responseData && responseData.user) {
        //             if (responseData.user.mobilePhone) {
        //                 UserInfoStore.setLastUserPhone(responseData.user.mobilePhone).then();
        //                 UserInfoStore.setUserInfo(responseData.user).then();
        //                 apis.getCompany(responseData.user.mobilePhone).then(
        //                     (companyInfo) => {
        //                         console.log("公司信息读取成功返回:", JSON.stringify(companyInfo));
        //                         if (companyInfo && companyInfo.list) {
        //                             console.log("公司信息保存中....", companyInfo.list);
        //                             let tmpCompaniesArr = companyInfo.list;
        //
        //                             //需要注掉到时候
        //                             if (tmpCompaniesArr.length > 0) {
        //
        //                                 UserInfoStore.setCompanyArr(tmpCompaniesArr).then(
        //                                     (user) => {
        //                                         console.log("公司信息保存成功");
        //                                     },
        //                                     (e) => {
        //                                         console.log("公司信息保存错误:", e);
        //                                     },
        //                                 );
        //
        //                                 UserInfoStore.setCompany(tmpCompaniesArr[0]).then(
        //                                     (user) => {
        //                                         console.log("公司信息保存成功");
        //                                         DeviceEventEmitter.emit('ChangeCompany');
        //
        //                                     },
        //                                     (e) => {
        //                                         console.log("公司信息保存错误:", e);
        //                                     },
        //                                 );
        //                             }
        //                         }
        //                     },
        //                     (e) => {
        //                         Toast.show('公司信息读取失败', {
        //                             position: Toast.positions.CENTER,
        //                             duration: Toast.durations.LONG,
        //                             backgroundColor: 'red'
        //                         });
        //                         console.log("公司信息读取错误返回:", e);
        //                     },
        //                 );
        //             }
        //         } else {
        //             console.log("OK ===> LoginPage:");
        //         }
        //     },
        //     (e) => {
        //         console.log("用户信息读取错误返回:", e);
        //         Toast.show('用户信息读取失败', {
        //             position: Toast.positions.CENTER,
        //             duration: Toast.durations.LONG,
        //             backgroundColor: 'red'
        //         });
        //     },
        // );
    }

    // 修改绑定手机号
    _doSubmit() {
        let loading = SActivityIndicator.show(true, "");
        apis.editPhoneBind(this.state.newMobile, this.state.smsCode).then(
            (responseData) => {
                SActivityIndicator.hide(loading);
                this.readUserInfo();
                Alert.alert('绑定成功', '',
                    [
                        {
                            text: '确定',
                            onPress: () => {
                                Navigation.dismissModal({
                                    animationType: 'slide-down' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
                                });
                                if (this.props.navigator) {
                                    console.log("PhoneBind popToRoot");
                                    this.props.navigator.popToRoot();
                                }
                                this.props.callback && this.props.callback();// 执行登陆后动作回调
                            },
                        },]
                    , {cancelable: false});

            },
            (e) => {
                SActivityIndicator.hide(loading);
                console.log("短信验证码校验失败:", e);
                // Toast.show('短信验证码校验失败:' + JSON.stringify(e));
                Alert.alert('绑定失败', e.msg,
                    [
                        {
                            text: '确定',
                            onPress: () => {

                            },
                        },]
                    , {cancelable: false});
            },
        );

    }


    // 请求短信验证码
    _requestSMSCode(shouldStartCountting) {
        console.log('_requestSMSCode shouldStartCountting', shouldStartCountting);
        if (this.state.newMobileValid) {
            apis.sendVerifyCode(this.state.newMobile, 1, this.state.vCode, this.state.device).then(
                (responseData) => {
                    Toast.show('短信验证码已发送');
                    this.setState({ vCode: '', needVcode: false});
                }, (e) => {
                    let errMsg = errorText(e);
                    if(notEmpty(errMsg)) {
                        Toast.show(errMsg);
                    }

                    this.refs.timerButton.reset();

                    try {
                        let {code, imgcode} = e;
                        if(code === 2) {
                            let picURL = {uri: 'data:image/jpeg;base64,' + imgcode};
                            this.setState({picURL, vCode: '', needVcode: true, vCodeInputValid: false});
                        }
                    } catch(e) {
                    }
                }
            );
        }
    }

    back() {
        if (this.props.navigator) {
            this.props.navigator.pop();
        }
    }

    // 返回
    pop() {
        Navigation.dismissModal({
            animationType: 'slide-down' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
        });

        if (this.props.navigator) {
            console.log("popToRoot");
            this.props.navigator.popToRoot();
            // 选中我的页面
            this.props.navigator.switchToTab({
                tabIndex: 3
            });
        }
    }

    render() {
        return (

            <TouchableWithoutFeedback onPress={dismissKeyboard}>

                <View style={{flex: 1, backgroundColor: 'white'}}>
                    <TouchableOpacity
                        style={{height: 30, width: 30, marginTop: Platform.OS === 'ios' ? 30 : 10, marginLeft: 15}}
                        onPress={() => {
                            this.pop()
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
                                               (newMobile) => {
                                                   // 如果手机号改了, 马上就重置获取验证码?
                                                   if (!this.refs.timerButton.state.counting) {
                                                       this.refs.timerButton.reset();
                                                   }
                                                   this.setState({timerButtonClicked: false});
                                                   newMobile = newMobile.replace(/[^\d]/g, '');// 过滤非数字输入
                                                   let newMobileValid = newMobile.length > 0 && (newMobile.match(/^([0-9]{11})?$/)) !== null;
                                                   if (newMobile.length > 0 && newMobile === this.state.phone) {
                                                       Toast.show('对不起, 不能输入当前登录用户的手机号进行绑定 ',
                                                           {
                                                               position: Toast.positions.CENTER,
                                                               duration: Toast.durations.LONG,
                                                               backgroundColor: 'black'
                                                           });
                                                       newMobileValid = false;
                                                   }
                                                   this.setState({newMobile, newMobileValid});
                                               }
                                           }/>
                            </View>
                        </View>

                        {/*  图片验证码 */}
                        {
                            this.state.needVcode &&
                            <View style={styles.textInputContainer}>

                                <View style={styles.textInputWrapper}>
                                    <TextInput underlineColorAndroid='transparent'
                                               ref="vCodeInput"
                                               autoCorrect={false}
                                               value={this.state.vCode}
                                               editable={this.state.newMobileValid}
                                               secureTextEntry={false} maxLength={4} keyboardType='default'
                                               style={styles.codeInput} placeholder='图形验证'
                                               placeholderTextColor='#BABABA'
                                               returnKeyType='done'
                                               onChangeText={(vCode) => {
                                                   let vCodeInputValid = (vCode.length === 4);
                                                   this.setState({vCode, vCodeInputValid});
                                                   if (vCodeInputValid) {
                                                       dismissKeyboard();
                                                   }
                                               }}
                                    />

                                    <TouchableWithoutFeedback onPress={() => {
                                        // this._doChangeVCode()
                                    }}>
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
                                           editable={this.state.newMobileValid }
                                           secureTextEntry={false} maxLength={6} keyboardType='numeric'
                                           style={styles.codeInput} placeholder='短信验证'
                                           placeholderTextColor='#BABABA'
                                           returnKeyType='done'
                                           onChangeText={(smsCode) => {
                                               this.setState({smsCode});
                                               let smsCodeValid = (smsCode.length === 6);
                                               this.setState({smsCodeValid});
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

                                <TimerButton enable={this.state.newMobileValid}
                                             ref="timerButton"
                                             style={{width: 70, marginRight: 0, height: 44, alignSelf: 'flex-end',}}
                                             textStyle={{color: '#6A6A6A', alignSelf: 'flex-end'}}
                                             timerCount={60}
                                             onClick={(shouldStartCountting) => {
                                                 if(this.state.needVcode && !this.state.vCodeInputValid) {
                                                     Toast.show("对不起, 请输入图形验证码");
                                                     this.refs.timerButton.reset();
                                                     return;
                                                 }
                                                 shouldStartCountting(true);
                                                 this.setState({timerButtonClicked: true});
                                                 this._requestSMSCode(shouldStartCountting);
                                             }}/>
                            </View>
                        </View>

                        {/*  协议 */}
                        <TouchableWithoutFeedback onPress={ () => this._serviceTerm()}>
                            <View style={[styles.textInputContainer,
                                {marginTop: 2}]}>
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
                        </TouchableWithoutFeedback>

                        <SubmitButton
                            text='立即绑定'
                            onPress={() => {
                                this._doSubmit()
                            }}
                            isEnabled={this.state.newMobileValid && this.state.smsCodeValid}
                        />
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}