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
import px2dp from '../../util/index'
import Toast from 'react-native-root-toast';
import {SCREEN_WIDTH as width} from '../../config';
import SActivityIndicator from '../../modules/react-native-sww-activity-indicator';
import * as apis from '../../apis/setting';
import TimerButton from "../../view/TimerButton";
import settingStyles from './css/SettingsPageStyle';
import BComponent from '../../base';
import errorText from '../../util/ErrorMsg';
import SubmitButton from "../../view/SubmitButton";

const dismissKeyboard = require('dismissKeyboard');     // 获取键盘回收方法

export default class BindPhonePage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            phone:'',
            newMobile:'',
            newMobileValid:false,
            smsCode:'',
            smsCodeValid:false,
            timerButtonClicked:false
        };
    }

    componentWillMount() {
        UserInfoStore.getUserInfo().then(
            (user) => {
                if (user !== null) {
                    this.setState({ phone: user.phone});
                }
            },
            (e) => {
                console.log("读取信息错误:", e);
            },
        );
    }
    render(){
        return(
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={{flex:1,backgroundColor:'#F9F9F9'}}>
                <Text style={{padding:17,color:'#333333',fontSize:14,width:DeviceInfo.width,textAlign:'center'}}>当前手机号{this.state.phone}</Text>
                <View style={{width:DeviceInfo.width, padding:14,paddingLeft:30,paddingRight:30,backgroundColor:'#FFFFFF',borderBottomWidth:0.5,borderBottomColor:'#ececec'}}>
                    <TextInput style={{fontSize:14,padding:0}}
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
                                   }
                               }
                    />
                </View>
                <View style={{flexDirection:'row',width:DeviceInfo.width,backgroundColor:'#FFFFFF',alignItems:'center'}}>
                    <View style={{width:DeviceInfo.width/2,padding:14,paddingLeft:30,paddingRight:30}}>
                        <TextInput
                            style={{fontSize:14,padding:0}}
                            placeholder="请输入验证码"
                            underlineColorAndroid='transparent'
                            value={this.state.smsCode}
                            editable={this.state.timerButtonClicked}
                            secureTextEntry={false}
                            maxLength={6}
                            keyboardType='numeric'
                            returnKeyType='done'
                            onChangeText={(smsCode) => {
                                this.setState({smsCode})
                                let smsCodeValid = (smsCode.length === 6);
                                this.setState({smsCodeValid})
                            }
                            }

                            onSubmitEditing={() => {
                                dismissKeyboard();
                            }}
                        />
                    </View>
                    <View style={{flexDirection:'row-reverse',alignItems:'center',width:DeviceInfo.width/2}}>
                        <TimerButton
                            enable = {true}
                            ref="timerButton"
                            style={{width:90,marginRight:30}}
                            textStyle={{fontSize:12,color:'#6A6A6A'}}
                            timerCount={180}
                            onClick={(shouldStartCountting) => {
                                shouldStartCountting(true);
                                this.setState({timerButtonClicked: true});
                                this._requestSMSCode(shouldStartCountting);
                            }}
                        />
                        <View style={{width:1,height:17,backgroundColor:'#ececec'}}/>
                    </View>

                </View>
                <View style={{height:40}}/>
                <SubmitButton
                    text='立即绑定'
                    onPress={() => {this._doSubmit()}}
                    isEnabled = {this.state.newMobileValid && this.state.smsCodeValid}
                />

            </View>
            </TouchableWithoutFeedback>

        )
    }


    _doSubmit() {
        let loading = SActivityIndicator.show(true, "");
        apis.editPhoneBind(this.state.newMobile, this.state.smsCode).then(
            (responseData) => {
                SActivityIndicator.hide(loading);
                Alert.alert('', '绑定成功',
                    [
                        {
                            text: '确定',
                            onPress: () => {
                                this.props.navigator.pop();
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


    _requestSMSCode(shouldStartCountting) {
        console.log('_requestSMSCode shouldStartCountting', shouldStartCountting);
        apis.sendVerifyCode(this.state.phone).then(
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

