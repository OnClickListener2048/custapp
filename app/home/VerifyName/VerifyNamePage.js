/**
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
    Image,
    TextInput,
    StyleSheet
} from 'react-native';
import BComponent from '../../base';
import TextInputView from "./view/TextInputView";
import SubmitButton from "../../view/SubmitButton";
import TimerButton from "./view/TimerButton";
import * as apis from '../../apis';
import Toast from 'react-native-root-toast';
const dismissKeyboard = require('dismissKeyboard');     // 获取键盘回收方法

const window = Dimensions.get('window');
export const SCREEN_HEIGHT = window.height;
export const SCREEN_WIDTH = window.width;
const deviceWidth = Dimensions.get('window').width;
export default class HomePage extends BComponent {
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

            smsCode: '',         // 短信验证码
            smsCodeValid: false,          // 短信验证码有效
            mobileValid: false,   // 手机号有效

        }
        this._doVerfiyResult = this._doVerfiyResult.bind(this);
        this._isNotEmpty = this._isNotEmpty.bind(this);
        this._requestSMSCode = this._requestSMSCode.bind(this);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    }

    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        super.onNavigatorEvent(event);
    }

    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
    }

    // 请求短信验证码
    _requestSMSCode(shouldStartCountting) {
        console.log('_requestSMSCode');
        if (this.state.mobileValid) {
            apis.loadVerifyCode(this.state.mobile).then(
                (responseData) => {
                    Toast.show('短信验证码已发送'+ responseData);

                }, (e) => {
                    Toast.show('短信验证码获取失败'+ e);

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
        this.props.navigator.push({
            screen: 'VerifyResultPage',
            title:'免费核名',
            passProps: {
                keyword:this.state.companyName,
                mobile : this.state.phoneNum,
                vcode : this.state.smsCode,
            }
        });
    }

    render(){
        return(
            <ScrollView style={{flex:1,backgroundColor:'#FFFFFF',
                flexDirection: 'column'}}>
                <View style={{width:DeviceInfo.width}}>
                    <Image source={require('../../img/verify_name.png')} style={{width:deviceWidth,justifyContent:'center',
                        alignItems:'center',marginTop:DeviceInfo.OS==='ios'?20:0}}>
                        {/*<Text style={{backgroundColor:'transparent',fontSize:24,color:'white',fontWeight:'bold'}}>公司名称查询</Text>*/}
                        {/*<Text style={{backgroundColor:'transparent',fontSize:24,color:'white',fontWeight:'bold'}}>提升工商注册通过率</Text>*/}
                    </Image>
                </View>
                {this.renderInput('companyName','请输入要注册的公司名称','')}
                {this.renderPhoneInput('phoneNum','请输入手机号','')}



                {/*  短信验证码 */}
                <View style={styles.textInputContainer}>


                    <View style={styles.textInputWrapper}>
                        <TextInput underlineColorAndroid='transparent'
                                   value={this.state.smsCode}
                                   ref="smsCodeInput"
                                   editable={this.state.mobileValid && this.state.timerButtonClicked}
                                   secureTextEntry={false} maxLength={6} keyboardType='numeric'
                                   style={styles.codeInput} placeholder='短信验证码'
                                   placeholderTextColor='#999999'
                                   returnKeyType='done'
                                   onChangeText={(smsCode) => {
                                       this.setState({smsCode})
                                       let smsCodeValid = (smsCode.length === 6);
                                       this.setState({smsCode, smsCodeValid});
                                       if(smsCodeValid) {
                                           // dismissKeyboard();
                                       }
                                   }}

                                   onBlur={() => {
                                        dismissKeyboard();
                                   }}

                                   onSubmitEditing={() => {
                                       // dismissKeyboard();
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
                                     disableColor={"#c8c8c8"}
                                     style={{width: 94, marginRight: 0, height: 44, alignSelf: 'flex-end',}}
                                     textStyle={{color: '#333333',alignSelf: 'flex-end'}}
                                     timerCount={80}
                                     onClick={(shouldStartCountting) => {
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