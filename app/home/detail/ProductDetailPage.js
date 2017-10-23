/**
 * Created by zhuangzihao on 2017/9/11.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    WebView,
    Platform,
    TouchableOpacity,
    TouchableWithoutFeedback,
    PanResponder,
    Animated,
    Keyboard,
    KeyboardAvoidingView,
    Linking,
    StyleSheet,
    TextInput
} from 'react-native';
import WebTab from './WebVIew'
import BComponent from '../../base';
const window = Dimensions.get('window');
import Modal from '../../view/Modalbox';
const dismissKeyboard = require('dismissKeyboard');     // 获取键盘回收方法
import * as apis from '../../apis';
import Toast from 'react-native-root-toast'

export const SCREEN_HEIGHT = window.height;
export const SCREEN_WIDTH = window.width;
export default class ProductDetailPage extends BComponent {
    constructor(props) {
        super(props);
        this.state = {
            isShowkeyBoard:false,
            mobile: '',     // 手机号
            area:'',  //服务区域
            name:'', //姓名
            message:'', //提交意见消息
            navigatorTitle:this.props.navigatorTitle,          //标题名称

        };
        this.marginTopValue= new Animated.Value(0)
        this._keyboardDidShow = this._keyboardDidShow.bind(this);
        this._keyboardDidHide = this._keyboardDidHide.bind(this);
        this.updateMobile = this.updateMobile.bind(this);
        this.updateArea = this.updateArea.bind(this);
        this.updateName = this.updateName.bind(this);
        this.updateMmessage = this.updateMmessage.bind(this);
    }
    static defaultProps = {
        item:{}
    };

    componentWillMount() {
        this._panResponder = PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (evt, gestureState) => true,

            onPanResponderGrant: (e, gestureState) => {

                this.pageX = e.nativeEvent.pageX;
                this.pageY = e.nativeEvent.pageY;
            },
            onPanResponderMove: (e, gestureState) => {

                if (Math.abs(this.pageY - e.nativeEvent.pageY) > Math.abs(this.pageX - e.nativeEvent.pageX)) {
                    // 上下滑动
                    if(this.pageY>e.nativeEvent.pageY){
                        //向上滑动
                        Animated.spring(this.marginTopValue, {
                            toValue: 1,
                            duration: 250,
                        }).start()
                    }else{
                        //向下滑动
                        Animated.spring(this.marginTopValue, {
                            toValue: 0,
                            duration: 250,
                        }).start()
                    }
                }
            },

        });
        // 发送通知
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }



    componentWillUnmount() {
        // 发送通知

        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    // 小屏键盘显示适配
    _keyboardDidShow() {
        this.setState({isShowkeyBoard: true});
    }

    // 小屏键盘显示适配
    _keyboardDidHide() {

        this.setState({isShowkeyBoard: false});
    }



    submitMessage(){

        if (this.state.area.length === 0){
            Toast.show('请输入服务范围');
            return;
        }else if (this.state.name.length === 0){
            Toast.show('请输入您的称呼');
            return;
        }else if (this.state.mobile.length === 0){
            Toast.show('请输入联系电话');
            return;
        }else if (this.state.message.length === 0){
            Toast.show('请输入留言内容');
            return;
        }else {
            let  mobileStr = this.state.mobile.replace(/[^\d]/g, '');// 过滤非数字输入
            let mobileValid = mobileStr.length > 0 && (mobileStr.match(/^([0-9]{11})?$/)) !== null;
            if (!mobileValid){
                Toast.show('请输入正确的联系电话');
                return;
            }
        }

        apis.submitFeedBack(this.state.navigatorTitle,this.state.area,this.state.name,this.state.mobile,this.state.message).then(
            (responseData) => {
                Toast.show('提交成功');
                this.refs.modal3.close()
            }, (e) => {
                Toast.show('提交失败'+ e);
            }
        );
    }
    callPhone(){
        Linking.openURL('tel:13522807924')
    }
    onlineMessage(){
        //在线留言
        this.refs.modal3.open()
    }

    updateMobile(mobile) {

        this.setState({mobile});
    }
    updateArea(area) {

        this.setState({area});
    }

    updateName(name) {

        this.setState({name});
    }

    updateMmessage(message) {
        this.setState({message});
    }


    // #E13238
    render(){
        const marginTop = this.marginTopValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -DeviceInfo.width*0.4]
        })
        return(
            <View {...this._panResponder.panHandlers} style={{flex:1,backgroundColor:'#f9f9f9'}}>
                <Animated.View style={{marginTop}}>
                    <Image style={{width:DeviceInfo.width,height:DeviceInfo.width*0.4}} source={{uri:this.props.item.cover}}/>
                </Animated.View>
                <WebTab url={this.props.item.url}/>
                <View style={styles.tabViewContainer}>
                    <TouchableOpacity
                        style={styles.btnTouchContainer}
                        onPress={() => {
                            this.callPhone()
                        }}>
                    <View style={[styles.btnContainer,{backgroundColor:'#E13238'}]}>
                    <Text style={styles.textContainer}>{'免费咨询'}</Text>
                    </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.btnTouchContainer}
                        onPress={() => {
                                          this.onlineMessage()
                                      }}>
                    <View  style={[styles.btnContainer,{backgroundColor:'#E19F0E'}]}>
                        <Text style={styles.textContainer}>{'在线留言'}</Text>
                    </View>
                    </TouchableOpacity>
                </View>

                <Modal onBackClick={()=>Keyboard.dismiss()} backdropPressToClose={!this.state.isShowkeyBoard}
                    style={ {height: 479, width: SCREEN_WIDTH - 56, backgroundColor:'#f9f9f9',justifyContent: 'center', alignItems: 'center', marginTop: -30}}
                    position={"center"} ref={"modal3"}>
                    <TouchableWithoutFeedback onPress={dismissKeyboard}>

                    <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={0} style={[{flex: 1, backgroundColor:'#f9f9f9',width: SCREEN_WIDTH - 56,flexDirection: 'column',alignItems:'center'}]}>
                        <View  style={[{height: 479 - 20, width: SCREEN_WIDTH - 76,marginTop:10, backgroundColor:'#ffffff',flexDirection: 'column',alignItems:'center'}]}>

                        <TextInput underlineColorAndroid='transparent' placeholderTextColor={'#666666'} style={[styles.textInputStyle,{marginTop: 30}]}
                                   placeholder='服务区域'
                                   onChangeText={
                                       (area) => {
                                           this.updateArea(area);
                                       }
                                   }
                        />
                        <TextInput underlineColorAndroid='transparent' placeholderTextColor={'#666666'} style={[styles.textInputStyle,{marginTop: 10}]}
                                   placeholder='您的称呼'
                                   onChangeText={
                                       (name) => {
                                           this.updateName(name);
                                       }
                                   }
                        />
                        <TextInput underlineColorAndroid='transparent' placeholderTextColor={'#666666'} style={[styles.textInputStyle,{marginTop: 10}]}
                                   placeholder='联系电话'
                                   keyboardType={'number-pad'}
                                   onChangeText={
                                       (mobile) => {
                                           this.updateMobile(mobile);
                                       }
                                   }
                        />
                        <TextInput underlineColorAndroid='transparent' multiline={true} ref={"content"} placeholderTextColor={'#D9D8D8'} style={[styles.textInputStyle,{marginTop: 10,height:this.state.isShowkeyBoard ? 140 : 180}]}
                                   placeholder='请在此输入留言内容,我们会尽快与您联系。'
                                   onChangeText={
                                       (message) => {
                                           this.updateMmessage(message);
                                       }
                                   }
                        />
                        <TouchableOpacity
                            style={styles.submitBtnTouchContainer}
                            onPress={() => {
                                this.submitMessage()
                            }}>
                            <View  style={[styles.btnContainer,{backgroundColor:'#FF9F0E',borderRadius:8}]}>
                                <Text style={styles.textContainer}>{'我要咨询'}</Text>
                            </View>
                        </TouchableOpacity>

                        </View>

                    </KeyboardAvoidingView>
                    </TouchableWithoutFeedback>

                </Modal>
            </View>

        )
    }
}


const styles = StyleSheet.create({


    tabViewContainer: {
        height: 50,
        width: SCREEN_WIDTH,
        backgroundColor: '#FFFFFF',
        justifyContent:'space-between',
        flexDirection: 'row',
    },

    btnTouchContainer: {
        flexDirection: 'row',
        height:50,
        width:(SCREEN_WIDTH - 4)/2
    },

    btnContainer: {
        flexDirection: 'row',
        justifyContent:'center',
        flex:1,
        alignItems:'center'
    },
    textContainer: {
        fontSize:16,
        textAlign:'center',
        color:'#ffffff'
    },
    textInputStyle:{
        borderRadius:8,
        borderColor:'#CBCBCB',
        borderWidth:1,
        width:SCREEN_WIDTH - 76 - 40,
        height:40,
        color:'#666666',
        paddingLeft: 10,
        paddingRight: 10,
        fontSize:16
    },
    submitBtnTouchContainer: {
        flexDirection: 'row',
        height:40,
        width:208,
        marginTop:24,
        borderRadius:8
    },
});