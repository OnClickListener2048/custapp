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
import {SCREEN_WIDTH as width} from '../../config';
import SActivityIndicator from '../../modules/react-native-sww-activity-indicator';
import * as apis from '../../apis/account';
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
            timerButtonClicked:false,
            verifyText: '请输入图片验证码',// 图片验证码提示语
            vCode: '',         // 图片验证码
            picURL: require('../../img/head_img.png'),// 图片验证码
        };

        this._doChangeVCode = this._doChangeVCode.bind(this);
    }

    componentWillMount() {
        UserInfoStore.getUserInfo().then(
            (user) => {
                if (user !== null) {
                    this.setState({ phone: user.mobilePhone});

                }
            },
            (e) => {
                console.log("读取信息错误:", e);
            },
        );
    }

    componentDidMount() {
        this._doChangeVCode();
    }

    _doChangeVCode() {
        //this.state.phone
        apis.getVerifyVCodeImage('13810397064', 1).then(
            data => {
                let picURL = { uri: 'data:image/jpeg;base64,' + data.img };
                this.setState({picURL, vCode: '', vCodeInputValid: false});
            },
            e => {

            }
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

                <View style={styles.textInputContainer}>

                    <View style={styles.textInputWrapper}>
                        <TextInput underlineColorAndroid='transparent'
                                   ref="vCodeInput"
                                   autoCorrect={false}
                                   value={this.state.vCode}
                                   editable={this.state.mobileValid}
                                   secureTextEntry={false} maxLength={4} keyboardType='default'
                                   style={styles.codeInput} placeholder={this.state.verifyText}
                                   placeholderTextColor='#c8c8c8'
                                   returnKeyType='done'
                                   onChangeText={(vCode) => {
                                       this.setState({vCode})
                                       let vCodeInputValid = (vCode.length === 4);
                                       this.setState({vCode, vCodeInputValid});
                                       if(vCodeInputValid) {
                                           dismissKeyboard();
                                       }
                                   }}

                                   onBlur={() => {
                                       dismissKeyboard();
                                       if(this.state.vCodeInputValid&& !this.state.vCodeServerValid) {
                                           this._verifyVCode();
                                       }
                                   }}

                                   onSubmitEditing={() => {
                                       dismissKeyboard();
                                       //this._verifyVCode();
                                   }}
                        />

                        <TouchableWithoutFeedback onPress={this._doChangeVCode}>
                            <Image  style={{width: 69, marginRight: 0, height: 34, alignSelf: 'center',}}
                                    source={this.state.picURL}     />
                        </TouchableWithoutFeedback>

                    </View>
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

                    <TextInput underlineColorAndroid='transparent'
                               ref="vCodeInput"
                               autoCorrect={false}
                               value={this.state.vCode}
                               editable={this.state.mobileValid}
                               secureTextEntry={false} maxLength={4} keyboardType='default'
                               style={styles.codeInput} placeholder={this.state.verifyText}
                               placeholderTextColor='#c8c8c8'
                               returnKeyType='done'
                               onChangeText={(vCode) => {
                                   this.setState({vCode})
                                   let vCodeInputValid = (vCode.length === 4);
                                   this.setState({vCode, vCodeInputValid});
                                   if(vCodeInputValid) {
                                       dismissKeyboard();
                                   }
                               }}

                               onBlur={() => {
                                   dismissKeyboard();
                                   if(this.state.vCodeInputValid&& !this.state.vCodeServerValid) {
                                       this._verifyVCode();
                                   }
                               }}

                               onSubmitEditing={() => {
                                   dismissKeyboard();
                                   //this._verifyVCode();
                               }}
                    />



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

