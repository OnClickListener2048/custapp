/**
 * 核名
 * Created by jiaxueting on 2017/9/26.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    ScrollView,
    SectionList,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    TextInput,
    Keyboard,
    KeyboardAvoidingView,
    StyleSheet
} from 'react-native';
import BComponent from '../../base';
import TextInputView from "./view/TextInputView";
import SubmitButton from "../../view/SubmitButton";
import TimerButton from "./view/TimerButton";
import * as apis from '../../apis';
import Toast from 'react-native-root-toast';
import errorText from '../../util/ErrorMsg';
import random from "../../util/random";
import '../../modules/react-native-sww-activity-indicator';
import notEmpty from "../../util/StringUtil";
const dismissKeyboard = require('dismissKeyboard');     // 获取键盘回收方法

const window = Dimensions.get('window');
export const SCREEN_HEIGHT = window.height;
export const SCREEN_WIDTH = window.width;
const deviceWidth = Dimensions.get('window').width;

export default class VerifyNamePage extends BComponent {
    constructor(props) {
        super(props);

        this.state = {
            companyNameNotEmpty: false,
            phoneNumNotEmpty: false,

            companyName: '',
            phoneNum: '',
            MessageName: '',

            // timerButtonEnable: false, // 倒计时按钮是否可用
            timerButtonClicked: false,//  倒计时按钮是否已点击

            verifyText: '请输入图片验证码',// 图片验证码提示语
            vCode: '',         // 图片验证码
            picURL: null,// 图片验证码
            vCodeInputValid: false,
            keyBoardOpen: false,

            smsCode: '',         // 短信验证码
            smsCodeValid: false,          // 短信验证码有效
            mobileValid: false,   // 手机号有效
            device:random(11), // 随机
            needVcode: false,// 是否需要图形验证码
        };

        this._doChangeVCode = this._doChangeVCode.bind(this);
        this._doVerfiyResult = this._doVerfiyResult.bind(this);
        this._isNotEmpty = this._isNotEmpty.bind(this);
        this._requestSMSCode = this._requestSMSCode.bind(this);
        this._keyboardDidShow = this._keyboardDidShow.bind(this);
        this._keyboardDidHide = this._keyboardDidHide.bind(this);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    }

    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        super.onNavigatorEvent(event);
    }

    componentWillMount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        // this._doChangeVCode();
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    // 小屏键盘显示适配
    _keyboardDidShow() {
        console.log('Keyboard Shown SCREEN_WIDTH=', SCREEN_WIDTH);
            this.setState({keyBoardOpen: true});

    }

    // 小屏键盘显示适配
    _keyboardDidHide() {
        console.log('Keyboard Hidden');
            this.setState({keyBoardOpen: false});

    }

    // 请求短信验证码
    _requestSMSCode(shouldStartCountting) {
        console.log('_requestSMSCode shouldStartCountting1111', shouldStartCountting);
        if (this.state.mobileValid) {
            apis.sendVerifyCode(this.state.mobile, 5, this.state.vCode,this.state.device).then(
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



    _isNotEmpty(contentType,content){
        if(contentType==='companyName'){
            if(content.length===0){
                this.setState({companyNameNotEmpty:false});
            }else{
                this.setState({
                    companyNameNotEmpty:true,
                    companyName:content
                });

            }
        }else if(contentType==='phoneNum'){



            // 如果手机号改了, 马上就重置获取验证码?
            if (this.refs.timerButton && this.refs.timerButton.state.counting) {
                this.refs.timerButton.reset();
            }
            this.setState({timerButtonClicked: false});

            let mobile = content;
            mobile = mobile.replace(/[^\d]/g, '');// 过滤非数字输入
            let mobileValid = mobile.length > 0 && (mobile.match(/^([0-9]{11})?$/)) !== null;
            let mobileNotEmpty = mobile.length > 0;
            this.setState({mobile, mobileValid, mobileNotEmpty, smsCode: '', smsCodeValid: false});


            if(content.length===0){
                this.setState({phoneNumNotEmpty:false});
            }else{
                this.setState({
                    phoneNumNotEmpty:true,
                    phoneNum:mobile
                });
            }
        }
    }

    // 刷新验证码
    _doChangeVCode() {
            apis.getVerifyVCodeImage(this.state.device, 5).then(
                data => {
                    let picURL = { uri: 'data:image/jpeg;base64,' + data.img };
                    this.setState({picURL, vCode: '', vCodeInputValid: false});
                },
                e => {
                    Toast.show(errorText(e));
                }
            );

    }

    //输入框子组件
    renderInput(textType,textName,textContent){
        return(
            <TextInputView
                callback={this._isNotEmpty}
                contentType={textType}
                textName={textName}
                content={textContent}
                textEditable={true}/>
        )

    }

    renderPhoneInput(textType,textName,textContent){
        return(
            <TextInputView
                callback={this._isNotEmpty}
                contentType={textType}
                textName={textName}
                content={textContent}
                keyboardType="number-pad"
                textEditable={true}/>
        )

    }



    _doVerfiyResult(){


        if (this.state.companyNameNotEmpty === false){
            Toast.show('请输入公司名称');
            return;
        }else if (this.state.phoneNumNotEmpty === false){
            Toast.show('请输入手机号');
            return;
        }



        UMTool.onEvent('immediateCheck')

        if(!NetInfoSingleton.isConnected) {
            Toast.show('暂无网络,请检查网络设置');

            return;
        }

        let loading = SActivityIndicator.show(true, "加载中...");

//this.state.companyName
        apis.loadVerifyResultData(this.state.companyName,this.state.phoneNum,this.state.smsCode).then(
            (responseData) => {
                SActivityIndicator.hide(loading);

                if (responseData.isvalid == 1){


                    this.props.navigator.push({
                        screen: 'VerifyResultPage',
                        title:'免费核名',
                        passProps: {
                            keyword:this.state.companyName,
                            mobile : this.state.phoneNum,
                            vcode : this.state.smsCode,
                            fetchState:'checkSuccess',
                            dataStatus:'initSucess',
                        }
                    });

                }else {

                    this.props.navigator.push({
                        screen: 'VerifyResultPage',
                        title:'免费核名',
                        passProps: {
                            keyword:this.state.companyName,
                            mobile : this.state.phoneNum,
                            vcode : this.state.smsCode,
                            fetchState:'checkRisk',
                            responseData:responseData,
                            dataStatus:'',
                        }
                    });



                }

            },
            (e) => {
                SActivityIndicator.hide(loading);

                Toast.show(errorText(e));


            },
        );
    }

    render(){
        return(
            <TouchableWithoutFeedback onPress={dismissKeyboard}>

            <ScrollView style={{flex:1,backgroundColor:'#FFFFFF',
                flexDirection: 'column'}}>
                {this.state.keyBoardOpen === false &&
                <View style={{width: DeviceInfo.width}}>
                    <Image source={require('../../img/verify_name.png')} style={{
                        width: deviceWidth, justifyContent: 'center',
                        alignItems: 'center', marginTop: 0
                    }}>
                        {/*<Text style={{backgroundColor:'transparent',fontSize:24,color:'white',fontWeight:'bold'}}>公司名称查询</Text>*/}
                        {/*<Text style={{backgroundColor:'transparent',fontSize:24,color:'white',fontWeight:'bold'}}>提升工商注册通过率</Text>*/}
                    </Image>
                </View>

                }


                {this.renderInput('companyName','请输入要注册的公司名称','')}
                {this.renderPhoneInput('phoneNum','请输入手机号','')}

                {/*  图片验证码 */}
                {
                    this.state.needVcode &&
                    <View style={styles.textInputContainer}>

                        <View style={[styles.textInputWrapper, {
                            borderBottomColor: '#dcdcdc',
                            borderBottomWidth: 0.5,
                        }]}>
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
                                           let vCodeInputValid = (vCode.length === 4);
                                           this.setState({vCode, vCodeInputValid});
                                           if (vCodeInputValid) {
                                               dismissKeyboard();
                                           }
                                       }}
                            />

                            <TouchableWithoutFeedback onPress={() => {
                                //this._doChangeVCode()
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
                                   editable={this.state.mobileValid}
                                   secureTextEntry={false} maxLength={6} keyboardType='numeric'
                                   style={styles.codeInput} placeholder='短信验证码'
                                   placeholderTextColor='#BABABA'
                                   returnKeyType='done'
                                   onChangeText={(smsCode) => {
                                       this.setState({smsCode})
                                       let smsCodeValid = (smsCode.length === 6);
                                       this.setState({smsCode, smsCodeValid});
                                       if(smsCodeValid) {
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
                            height: 17,
                            width: 1,
                            backgroundColor: '#c8c8c8',
                            alignSelf: 'center',
                            marginRight: 1
                        }}/>

                        <TimerButton enable={this.state.mobileValid }
                                     ref="timerButton"
                                     disableColor={"#BABABA"}
                                     style={{width: 94, marginRight: 0, height: 44, alignSelf: 'flex-end',}}
                                     textStyle={{color: '#333333',alignSelf: 'flex-end'}}
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



                <SubmitButton onPress={this._doVerfiyResult} isEnabled={(this.state.companyNameNotEmpty&&this.state.phoneNumNotEmpty&&
                    this.state.smsCodeValid)}
                              text="立即免费核名"
                />

            </ScrollView>

    </TouchableWithoutFeedback>

        )
    }
}


const styles = StyleSheet.create({
    sysContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexDirection: 'column'
    },

    textInputContainer: {
        height: 50,
        // width: SCREEN_WIDTH,
        backgroundColor: 'white',
        flexDirection: 'row',
    },

    // phone input box
    textInputWrapper: {
        height: 50,
        width: SCREEN_WIDTH - 34,
        // position: 'relative',
        marginLeft: 16,

        flexDirection: 'row',
        justifyContent: 'center',
    },
    codeInput: {
        flex: 1,
        height: 30,
        marginLeft: 0,
        padding: 0,
        fontSize: 16,

        color: '#333333',
        alignSelf: 'center',
    },

});