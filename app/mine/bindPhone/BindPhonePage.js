/**
 * Created by zhuangzihao on 2017/9/18.
 */
/**
 修改手机号
 TODO 获取图形验证码逻辑独立出去到基类中
 */
import React, {Component} from 'react';

import {
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
import Alert from "react-native-alert";
import random from "../../util/random";
import loadUserInfo from '../../util/LoadUserInfoUtil'
import notEmpty from "../../util/StringUtil";

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
            device: random(11), // 随机
            needVcode: false,// 是否需要图形验证码
        };

        this._doChangeVCode = this._doChangeVCode.bind(this);
        this.readUserInfo = this.readUserInfo.bind(this);
        this._requestSMSCode = this._requestSMSCode.bind(this);
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
        // this._doChangeVCode();
    }

    componentDidMount() {
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
                    Toast.show('图形验证码' + errorText(e), {
                        position: Toast.positions.CENTER,
                        duration: Toast.durations.LONG,
                        backgroundColor: 'red'
                    });
                }
            );
        }
    }

    // 读取用户信息
    readUserInfo() {
        let _this = this;
        loadUserInfo({
            type: 'bind',
            callback: function (res) {
                if (res.code === 0) {
                    DeviceEventEmitter.emit('ChangeCompany');
                }
            },
        })
        // apis.userInfo().then(
        //     (responseData) => {
        //         console.log("用户信息读取成功返回:", JSON.stringify(responseData));
        //         if (responseData && responseData.user) {
        //
        //             if(responseData.user.mobilePhone) {
        //                 UserInfoStore.setLastUserPhone(responseData.user.mobilePhone).then();
        //                 UserInfoStore.setUserInfo(responseData.user).then();
        //
        //                 apis.getCompany(responseData.user.mobilePhone).then(
        //                     (companyInfo) => {
        //                         if (companyInfo && companyInfo.list) {
        //
        //                             let tmpCompaniesArr = companyInfo.list;
        //
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
        //                             }else{
        //
        //                                 this._removeCompanyInfo()
        //
        //                             }
        //
        //
        //                         }else{
        //
        //                             this._removeCompanyInfo()
        //
        //                         }
        //                     },
        //                     (e) => {
        //
        //                         // Toast.show('公司信息读取失败', {position: Toast.positions.CENTER, duration: Toast.durations.LONG, backgroundColor: 'red'});
        //
        //                     },
        //                 );
        //             }
        //         } else {
        //             console.log("OK ===> LoginPage:");
        //         }
        //     },
        //     (e) => {
        //         console.log("用户信息读取错误返回:", e);
        //         // Toast.show('用户信息读取失败', {position: Toast.positions.CENTER, duration: Toast.durations.LONG, backgroundColor: 'red'});
        //     },
        // );
    }

    _removeCompanyInfo() {
        UserInfoStore.removeCompany().then((s) => {
            DeviceEventEmitter.emit('ChangeCompany');
        }, (e) => {

        });
        UserInfoStore.removeCompanyArr().then();

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
                                // Navigation.dismissAllModals({
                                //     animationType: 'slide-down' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
                                // });
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
        if (this.state.newMobileValid) {
            apis.sendVerifyCode(this.state.newMobile, 1, this.state.vCode, this.state.device).then(
                (responseData) => {
                    Toast.show('短信验证码已发送');
                    this.setState({ vCode: '', needVcode: false});
                    // Toast.show('测试环境短信验证码:' + responseData.msg);
                    //     {position: Toast.positions.TOP, duration: Toast.durations.LONG, backgroundColor: 'green'});
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

    render() {
        return (
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <View style={{flex: 1, backgroundColor: '#F1F1F1'}}>
                    <Text
                        accessibilityLabel="bind_phone" testID="bind_phone"
                        style={{
                            padding: 17,
                            color: '#333333',
                            fontSize: 14,
                            width: SCREEN_WIDTH,
                            textAlign: 'center'
                        }}>当前手机号{this.state.phone}</Text>
                    <View style={{
                        width: SCREEN_WIDTH,
                        padding: 14,
                        paddingLeft: 30,
                        paddingRight: 30,
                        backgroundColor: '#FFFFFF',
                        borderBottomWidth: 0.5,
                        borderBottomColor: '#ececec'
                    }}>
                        <TextInput
                            accessibilityLabel="bind_update_phone" testID="bind_update_phone"
                            style={{fontSize: 14, padding: 0}}
                                   placeholder="请输入新手机号"
                                   placeholderTextColor='#c8c8c8'
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
                                   }
                        />
                    </View>

                    {/*  图片验证码 */}
                    {
                        this.state.needVcode &&
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
                                <TextInput
                                    accessibilityLabel="bind_img_code" testID="bind_img_code"
                                    underlineColorAndroid='transparent'
                                           ref="vCodeInput"
                                           autoCorrect={false}

                                           editable={this.state.newMobileValid}
                                           secureTextEntry={false} maxLength={4} keyboardType='default'
                                           style={[styles.codeInput, {paddingLeft: 0,}]}
                                           placeholder={this.state.verifyText}
                                           placeholderTextColor='#c8c8c8'
                                           returnKeyType='done'
                                           onChangeText={(vCode) => {
                                               let vCodeInputValid = (vCode.length === 4);
                                               this.setState({vCode, vCodeInputValid});
                                               if (vCodeInputValid) {
                                                   dismissKeyboard();
                                               }
                                           }}

                                />

                                <TouchableWithoutFeedback
                                    accessibilityLabel="bind_img_get_code" testID="bind_img_get_code"
                                    onPress={() => {
                                    // this._doChangeVCode()
                                }}>
                                    <Image style={{width: 69, marginRight: 0, height: 34, alignSelf: 'center',}}
                                           source={this.state.picURL}/>
                                </TouchableWithoutFeedback>

                            </View>
                        </View>
                    }

                    {/*  短信验证码 */}
                    <View style={{
                        flexDirection: 'row',
                        width: DeviceInfo.width,
                        backgroundColor: '#FFFFFF',
                        alignItems: 'center'
                    }}>
                        <View style={{width: SCREEN_WIDTH / 2, padding: 14, paddingLeft: 30, paddingRight: 30}}>
                            <TextInput
                                accessibilityLabel="bind_message_code" testID="bind_message_code"
                                style={{fontSize: 14, padding: 0}}
                                placeholder="请输入验证码"
                                placeholderTextColor='#c8c8c8'
                                underlineColorAndroid='transparent'
                                value={this.state.smsCode}
                                editable={this.state.newMobileValid }
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
                                accessibilityLabel="bind_message_button" testID="bind_message_button"
                                enable={this.state.newMobileValid}
                                ref="timerButton"
                                style={{width: 90, marginRight: 30}}
                                textStyle={{fontSize: 12, color: '#6A6A6A'}}
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
                                }}
                            />
                            <View style={{width: 1, height: 17, backgroundColor: '#ececec'}}/>
                        </View>

                    </View>
                    <View style={{height: 40}}/>
                    <SubmitButton
                        accessibilityLabel="bind_message_submit" testID="bind_message_submit"
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