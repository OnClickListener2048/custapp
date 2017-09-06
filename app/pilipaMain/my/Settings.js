/**
 修改手机号
 */
import React from 'react';

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
import px2dp from '../../util/index'
import Toast from 'react-native-root-toast';
import {SCREEN_WIDTH as width} from '../../config';
import SActivityIndicator from '../../modules/react-native-sww-activity-indicator';
import * as apis from '../../apis/setting';
import TimerButton from "../../view/TimerButton";
import settingStyles from './css/SettingsPageStyle';
import BComponent from '../../base';
// import Alert from "../../modules/react-native-alert";
import errorText from '../../util/ErrorMsg';
import SubmitButton from "../../view/ui/SubmitButton";

const dismissKeyboard = require('dismissKeyboard');     // 获取键盘回收方法

export default class Settings extends BComponent {
    static navigatorStyle = {
        tabBarHidden: true, // 隐藏默认的顶部导航栏
        navBarHidden: false, // 隐藏默认的顶部导航栏
    };

    constructor(props) {
        super(props);
        this.state = {
            userName: '-',     // 用户名
            phone: '', //手机号
            newMobile: '',     // 新手机号
            newMobileValid: false,   // 手机号有效
            smsCode: '',         // 短信验证码
            oldSmsCodeValid: false,        // 短信验证码有效
            bindNewMobile: false, // 是否绑定手机号的第二阶段
            newSmsCodeValid: false,        // 短信验证码有效
            submitButtonText: '更换手机号码', // 提交按钮的文本
            timerButtonClicked: false,//  倒计时按钮是否已点击
        };
    }

    componentWillMount() {
        UserInfoStore.getUserInfo().then(
            (user) => {
                if (user !== null) {
                    this.setState({userName: user.name, phone: user.phone});
                }
            },
            (e) => {
                console.log("读取信息错误:", e);
            },
        );
    }

    componentWillUnmount() {
        console.log("Settings.js componentWillUnmount()");
    }

    render() {
        return (
                <View style={styles.container}>
                    <View style={styles.topContainer}>
                        {/*   旧手机号*/}
                        {!this.state.bindNewMobile &&
                        <View style={[styles.textInputContainer,
                            {marginTop: px2dp(120)}]}>
                            <Text style={styles.nameTextStyle}>
                                当前绑定手机号码:
                            </Text>
                            <Text style={[styles.nameTextStyle,
                                {marginLeft: 5}]}>
                                {this.state.phone}
                            </Text>
                        </View>
                        }

                        {/*   手机号 */}
                        {this.state.bindNewMobile &&
                        <View style={[styles.textInputContainer,
                            {marginTop: px2dp(120)}]}>
                            <Image source={this.state.newMobileValid ? require('../../img/phone_sh.png') :
                                require('../../img/phone_s.png')} style={settingStyles.inputLogo}/>
                            <View style={settingStyles.textInputWrapper}>
                                <TextInput underlineColorAndroid='transparent' maxLength={11}
                                           keyboardType='numeric' value={this.state.newMobile}
                                           style={settingStyles.textInput} placeholder='新手机号码' returnKeyType='next'
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
                                               }
                                           }/>
                            </View>
                        </View>
                        }

                        {/*  验证码 */}
                        <View style={styles.textInputContainer}>
                            <Image
                                source={this.state.oldSmsCodeValid || this.state.newSmsCodeValid || this.state.timerButtonClicked ? require('../../img/d123_red.png') :
                                    require('../../img/d123.png')}
                                style={settingStyles.inputLogo}/>
                            <View style={settingStyles.textInputWrapper}>
                                <TextInput underlineColorAndroid='transparent'
                                           value={this.state.smsCode}
                                           editable={this.state.timerButtonClicked}
                                           secureTextEntry={false} maxLength={6} keyboardType='numeric'
                                           style={settingStyles.codeInput} placeholder='短信验证码'
                                           returnKeyType='done'
                                           onChangeText={(smsCode) => {
                                               this.setState({smsCode})
                                               let oldSmsCodeValid = (smsCode.length === 6);
                                               let newSmsCodeValid = oldSmsCodeValid;
                                               this.setState({smsCode});
                                               this.state.bindNewMobile ?
                                                   this.setState({newSmsCodeValid}) :
                                                   this.setState({oldSmsCodeValid});
                                           }
                                           }

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

                                <TimerButton
                                    enable={this.state.bindNewMobile ? this.state.newMobileValid : !this.state.oldSmsCodeValid}
                                    ref="timerButton"
                                    style={{width: 70, marginRight: 0, height: 44, alignSelf: 'flex-end',}}
                                    textStyle={{color: '#ef0c35', alignSelf: 'flex-end'}}
                                    timerCount={180}
                                    onClick={(shouldStartCountting) => {
                                        shouldStartCountting(true);
                                        this.setState({timerButtonClicked: true});
                                        this._requestSMSCode(shouldStartCountting);
                                    }}/>
                            </View>
                        </View>

                        <SubmitButton onPress={() => {this._doSubmit()}} isEnabled={this.state.oldSmsCodeValid || (this.state.newSmsCodeValid && this.state.newMobileValid )}
                                      text={this.state.submitButtonText}
                        />

                    </View>

                </View>
        );
    }

    // 请求验证码
    _requestSMSCode(shouldStartCountting) {
        console.log('_requestSMSCode shouldStartCountting', shouldStartCountting);
        if (!this.state.oldSmsCodeValid || this.state.newMobileValid) {
            apis.sendVerifyCode(this.state.newMobileValid ?
                this.state.newMobile : this.state.phone
            ).then(
                (responseData) => {
                    Toast.show('短信验证码已发送');
                    // Toast.show('测试环境短信验证码:' + responseData.msg);
                    // Toast.show('测试环境短信验证码 ' + responseData.msg,
                    //     {position: Toast.positions.TOP, duration: Toast.durations.LONG, backgroundColor: 'green'});
                }, (e) => {
                    Toast.show(errorText( e ));
                }
            );
        }
    }

    _doSubmit() {
        let loading = SActivityIndicator.show(true, "");

        if (this.state.bindNewMobile) {
            // 执行最后的绑定操作
            apis.editPhoneBind(this.state.newMobile, this.state.smsCode).then(
                (responseData) => {
                    SActivityIndicator.hide(loading);
                    Alert.alert('', '绑定成功',
                        [
                            {
                                text: '确定',
                                onPress: () => {
                                    this.props.navigator.pop();
                                    DeviceEventEmitter.emit('goLoginPage', true);
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
        } else {
            // 校验第一步的短信验证码
            apis.editPhoneEdit(this.state.smsCode).then(
                (responseData) => {
                    SActivityIndicator.hide(loading);
                    this.setState({
                        bindNewMobile: true, smsCode: '',
                        oldSmsCodeValid: false, newSmsCodeValid: false, submitButtonText: '绑定'
                    });
                    this.refs.timerButton.reset();
                    this.setState({timerButtonClicked: false});
                },
                (e) => {
                    SActivityIndicator.hide(loading);
                    console.log("短信验证码校验失败:", e);
                    // Toast.show('短信验证码校验失败:' + JSON.stringify(e));
                    Alert.alert('', '短信验证码校验失败',
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
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FAFAFA',
        flex: 1,
    },

    topContainer: {
        backgroundColor: '#FFFFFF',
    },

    inputArea: {
        height: px2dp(352),
        width: width,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginLeft: 15,
        marginTop: 15,
        alignItems: 'center'
    },

    lineView: {
        // height: px2dp(100),
        width: width,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginLeft: 15,
        marginRight: 15,
        alignItems: 'center'
    },

    divider: {
        backgroundColor: '#dedede',
        marginLeft: 0,
        marginRight: 0,
        height: 0.5,
    },

    nameTextStyle: {
        fontSize: 15,
        color: '#323232',
        textAlign: 'left',
        marginLeft: 0,
    },

    buttonView: {
        margin: 0,
        borderRadius: 5,
        alignSelf: 'center',
        justifyContent: 'center',
        height: px2dp(88),
        width: px2dp(500),
        marginTop: px2dp(100),
        marginBottom: px2dp(101),
    },
    submitButtonText: {
        fontSize: 30 / 2,
        color: '#ffffff',
        textAlign: 'center',
    },

    // phone input box
    textInputContainer: {
        height: px2dp(88),
        // width: SCREEN_WIDTH,
        // backgroundColor: '#FFDDFF',
        flexDirection: 'row',
        justifyContent: 'center'
    },

    codeInput: {
        flex: 1,
        height: px2dp(352),
        width: px2dp(148),
        fontSize: 15,
        marginLeft: px2dp(0),
        padding: 0,
        color: '#ef0c35',
        alignSelf: 'center',
    },
});