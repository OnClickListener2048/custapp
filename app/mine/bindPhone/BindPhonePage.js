/**
 * Created by zhuangzihao on 2017/9/18.
 */
/**
 修改手机号
 */
import React, {Component} from 'react';

import {
    Alert,
    DeviceEventEmitter,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import styles from '../../user/css/LoginPageStyle';
import px2dp from '../../util/index'
import Toast from 'react-native-root-toast';
import {SCREEN_WIDTH} from '../../config';
import '../../modules/react-native-sww-activity-indicator';
import * as apis from '../../apis/account';
import TimerButton from "../../view/TimerButton";
import settingStyles from './css/SettingsPageStyle';
import BComponent from '../../base';
import errorText from '../../util/ErrorMsg';
import SubmitButton from "../../view/SubmitButton";
import {Navigation} from 'react-native-navigation';

const dismissKeyboard = require('dismissKeyboard');     // 获取键盘回收方法

export default class BindPhonePage extends BComponent {

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
        };

        this._doChangeVCode = this._doChangeVCode.bind(this);
        this._verifyVCode = this._verifyVCode.bind(this);
        this.readUserInfo = this.readUserInfo.bind(this);
    }

    componentWillMount() {
        UserInfoStore.getUserInfo().then(
            (user) => {
                if (user !== null) {
                    this.setState({phone: user.mobilePhone});

                }
            },
            (e) => {
                console.log("读取信息错误:", e);
            },
        );
    }

    componentDidMount() {
    }

    // 刷新验证码
    _doChangeVCode(newMobile) {
        if (newMobile.length === 11) {
            apis.getVerifyVCodeImage(newMobile, 1).then(
                data => {
                    let picURL = {uri: 'data:image/jpeg;base64,' + data.img};
                    this.setState({picURL, vCode: '', vCodeInputValid: false});
                },
                e => {

                }
            );
        }
    }

    // 验证图形码
    _verifyVCode() {
        console.log('_verifyVCode');
        if (this.state.mobileValid) {
            apis.sendVerifyCode(this.state.mobile, '1', this.state.vCodeInputValid ? this.state.vCode : null).then(
                (responseData) => {
                    Toast.show('短信验证码已发送');
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
                                        // this.focusField('vCodeInput');
                                        // if(!this.refs.vCodeInput.isFocused()) {
                                        //     this.refs.vCodeInput.focus();
                                        // }
                                    },
                                },]
                            , {cancelable: true});
                    }
                    this._doChangeVCode();
                }
            );
        }
    }

    // 读取用户信息
    readUserInfo() {
        apis.userInfo().then(
            (responseData) => {
                console.log("用户信息读取成功返回:", JSON.stringify(responseData));
                if (responseData !== null && responseData.user !== null) {
                    if (responseData.user.mobilePhone !== null) {
                        UserInfoStore.setLastUserPhone(responseData.user.mobilePhone);
                    } else {
                        UserInfoStore.removeLastUserPhone();
                    }


                    UserInfoStore.setUserInfo(responseData.user).then(// 保存成功后再跳转
                        (user) => {
                            console.log("OK ===> Main:");
                        },
                        (e) => {
                            console.log("用户信息保存错误:", e);
                        },
                    );

                } else {
                    console.log("OK ===> LoginPage:");
                }
            },
            (e) => {
                console.log("用户信息读取错误返回:", e);
                Toast.show('用户信息读取错误' + JSON.stringify(e));
            },
        );
    }

    // 修改绑定手机号
    _doSubmit() {
        let loading = SActivityIndicator.show(true, "");
        apis.editPhoneBind(this.state.newMobile, this.state.smsCode).then(
            (responseData) => {
                SActivityIndicator.hide(loading);
                this.readUserInfo();
                Alert.alert('', '绑定成功',
                    [
                        {
                            text: '确定',
                            onPress: () => {
                                Navigation.dismissAllModals({
                                    animationType: 'slide-down' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
                                });
                                if (this.props.navigator) {
                                    console.log("PhoneBind popToRoot");
                                    this.props.navigator.popToRoot();
                                }
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
        if (this.state.newMobileValid && this.state.vCodeInputValid) {
            apis.sendVerifyCode(this.state.newMobile, 1, this.state.vCode).then(
                (responseData) => {
                    Toast.show('短信验证码已发送');
                    // Toast.show('测试环境短信验证码:' + responseData.msg);
                    // Toast.show('测试环境短信验证码 ' + responseData.msg,
                    //     {position: Toast.positions.TOP, duration: Toast.durations.LONG, backgroundColor: 'green'});
                }, (e) => {
                    Toast.show(errorText(e));
                }
            );
        }
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <View style={{flex: 1, backgroundColor: '#F9F9F9'}}>
                    <Text
                        style={{padding: 17, color: '#333333', fontSize: 14, width: SCREEN_WIDTH, textAlign: 'center'}}>当前手机号{this.state.phone}</Text>
                    <View style={{
                        width: SCREEN_WIDTH,
                        padding: 14,
                        paddingLeft: 30,
                        paddingRight: 30,
                        backgroundColor: '#FFFFFF',
                        borderBottomWidth: 0.5,
                        borderBottomColor: '#ececec'
                    }}>
                        <TextInput style={{fontSize: 14, padding: 0}}
                                   placeholder="请输入新手机号"
                                   underlineColorAndroid='transparent'
                                   maxLength={11}
                                   keyboardType='numeric'
                                   returnKeyType='next'
                                   onChangeText={
                                       (newMobile) => {
                                           // 如果手机号改了, 马上就重置获取验证码?
                                           if (!this.refs.timerButton.state.counting) {
                                               this.refs.timerButton.reset();
                                           }
                                           this.setState({timerButtonClicked: false});
                                           newMobile = newMobile.replace(/[^\d]/g, '');// 过滤非数字输入
                                           let newMobileValid = newMobile.length > 0 && (newMobile.match(/^([0-9]{11})?$/)) !== null;
                                           if (newMobile === this.state.phone) {
                                               Toast.show('对不起, 不能输入当前登录用户的手机号进行绑定 ',
                                                   {
                                                       position: Toast.positions.CENTER,
                                                       duration: Toast.durations.LONG,
                                                       backgroundColor: 'black'
                                                   });
                                               newMobileValid = false;
                                           }
                                           this.setState({newMobile, newMobileValid});

                                           if (newMobileValid) {
                                               this._doChangeVCode(newMobile);
                                           }
                                       }
                                   }
                        />
                    </View>

                    {/*  图片验证码 */}
                    <View style={styles.textInputContainer}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            width: SCREEN_WIDTH,
                            padding: 14,
                            paddingLeft: 30,
                            paddingRight: 30,
                            backgroundColor: '#FFFFFF',
                            borderBottomWidth: 0.5,
                            borderBottomColor: '#ececec'
                        }}>
                            <TextInput underlineColorAndroid='transparent'
                                       ref="vCodeInput"
                                       autoCorrect={false}
                                       value={this.state.vCode}
                                       editable={this.state.newMobileValid}
                                       secureTextEntry={false} maxLength={4} keyboardType='default'
                                       style={[styles.codeInput, {paddingLeft: 0,}]}
                                       placeholder={this.state.verifyText}
                                       placeholderTextColor='#c8c8c8'
                                       returnKeyType='done'
                                       onChangeText={(vCode) => {
                                           this.setState({vCode})
                                           let vCodeInputValid = (vCode.length === 4);
                                           this.setState({vCode, vCodeInputValid});
                                           if (vCodeInputValid) {
                                               dismissKeyboard();
                                           }
                                       }}

                            />

                            <TouchableWithoutFeedback onPress={() => {
                                this._doChangeVCode(this.state.newMobile)
                            }}>
                                <Image style={{width: 69, marginRight: 0, height: 34, alignSelf: 'center',}}
                                       source={this.state.picURL}/>
                            </TouchableWithoutFeedback>

                        </View>
                    </View>

                    {/*  短信验证码 */}
                    <View style={{
                        flexDirection: 'row',
                        width: DeviceInfo.width,
                        backgroundColor: '#FFFFFF',
                        alignItems: 'center'
                    }}>
                        <View style={{width: SCREEN_WIDTH / 2, padding: 14, paddingLeft: 30, paddingRight: 30}}>
                            <TextInput
                                style={{fontSize: 14, padding: 0}}
                                placeholder="请输入验证码"
                                underlineColorAndroid='transparent'
                                value={this.state.smsCode}
                                editable={this.state.timerButtonClicked && this.state.vCodeInputValid}
                                secureTextEntry={false}
                                maxLength={6}
                                keyboardType='numeric'
                                returnKeyType='done'
                                onChangeText={(smsCode) => {
                                    this.setState({smsCode});
                                    let smsCodeValid = (smsCode.length === 6);
                                    this.setState({smsCodeValid});
                                    if (smsCodeValid) {
                                        dismissKeyboard();
                                    }
                                }}

                                onSubmitEditing={() => {
                                    dismissKeyboard();
                                }}
                            />
                        </View>


                        <View style={{flexDirection: 'row-reverse', alignItems: 'center', width: DeviceInfo.width / 2}}>
                            <TimerButton
                                enable={this.state.newMobileValid && this.state.vCodeInputValid}
                                ref="timerButton"
                                style={{width: 90, marginRight: 30}}
                                textStyle={{fontSize: 12, color: '#6A6A6A'}}
                                timerCount={60}
                                onClick={(shouldStartCountting) => {
                                    if (this.state.newMobileValid && this.state.vCodeInputValid) {
                                        shouldStartCountting(true);
                                        this.setState({timerButtonClicked: true});
                                        this._requestSMSCode(shouldStartCountting);
                                    } else {
                                        this.refs.timerButton.reset();
                                    }
                                }}
                            />
                            <View style={{width: 1, height: 17, backgroundColor: '#ececec'}}/>
                        </View>

                    </View>
                    <View style={{height: 40}}/>
                    <SubmitButton
                        text='立即绑定'
                        onPress={() => {
                            this._doSubmit()
                        }}
                        isEnabled={this.state.newMobileValid && this.state.smsCodeValid}
                    />

                </View>
            </TouchableWithoutFeedback>
        )
    }

}