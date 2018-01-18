/**
 * Created by zhuangzihao on 2017/10/16.
 */

import React, {Component} from 'react';
import {
    WebView,
    StyleSheet,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Keyboard,
    Text,
    Platform,
    Image,
    Linking,
    TextInput,
    Dimensions
} from 'react-native';
import BComponent from '../base/BComponent'
import * as Progress from 'react-native-progress';
const deviceWidth = Dimensions.get('window').width;
import Toast from 'react-native-root-toast'
const window = Dimensions.get('window');
import Modal from '../view/Modalbox';
import DeviceInfo from 'react-native-device-info';
import * as WeChat from'react-native-wechat'

const dismissKeyboard = require('dismissKeyboard');     // 获取键盘回收方法
import * as apis from '../apis';
import * as URI from "uri-js";
import queryString from "query-string";
let imgUrl = 'https://assets.pilipa.cn/www/images/public/share_logo.png'
export const SCREEN_HEIGHT = window.height;
export const SCREEN_WIDTH = window.width;
const patchPostMessageFunction = function() {

    var originalPostMessage = window.postMessage;

    var patchedPostMessage = function(message, targetOrigin, transfer) {
        originalPostMessage(message, targetOrigin, transfer);
    };

    patchedPostMessage.toString = function() {
        return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
    };

    window.postMessage = patchedPostMessage;
};

const patchPostMessageJsCode = '(' + String(patchPostMessageFunction) + ')();';

const second = 1500
const html ="";

export default class WebViewPage extends BComponent {
    static defaultProps = {
        url:'',
        shareTitle:'噼里啪智能财税',
        shareDescription:''

    };
    constructor(props) {
        super(props);
        this.state={
            progress:0,
            isShowProgress:true,
            isShowTabButton:false,
            isShowkeyBoard:false,
            mobile: '',     // 手机号
            area:'',  //服务区域
            name:'', //姓名
            message:'', //提交意见消息
            navigatorTitle:this.props.navigatorTitle,          //标题名称
            UMTrack: '',     // 原生跳转到此网页传过来的埋点信息

        }
        this._handleMessage = this._handleMessage.bind(this);


        this._keyboardDidShow = this._keyboardDidShow.bind(this);
        this._keyboardDidHide = this._keyboardDidHide.bind(this);
        this.updateMobile = this.updateMobile.bind(this);
        this.updateArea = this.updateArea.bind(this);
        this.updateName = this.updateName.bind(this);
        this.updateMmessage = this.updateMmessage.bind(this);
        this.appendURL = this.appendURL.bind(this);


    }

    // 小屏键盘显示适配
    _keyboardDidShow() {
        this.setState({isShowkeyBoard: true});
    }

    // 小屏键盘显示适配
    _keyboardDidHide() {

        this.setState({isShowkeyBoard: false});
    }


    componentWillMount() {

        this.initNavigator()
        // 发送通知
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);

    }
    initNavigator(){
        this.props.navigator.setButtons({
            rightButtons: [{icon: require('../img/share.png'),id:'share'}], // see "Adding buttons to the navigator" below for format (optional)
        });
    }
    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        super.onNavigatorEvent(event)
        if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
            if (event.id == 'share') { // this is the same id field from the static navigatorButtons definition
                this.refs.shareModel.open()
            }
        }
    }

    componentWillUnmount() {
        // 发送通知

        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    componentDidMount() {
        this.setState({ progress:0.95 });
        // console.log('-----',this.props.navigator)

    }
    _onLoadEnd(){
        this.setState({ progress:1 });
        let urlStr = this.appendURL();

        // this.props.url
        let components = URI.parse(urlStr);
        let query = components.query;
        let passProps = {};
        if (query) {
            passProps = queryString.parse(query);
        }

        let passPropsFinal = {};
        let paramsKeyArray = Object.keys(passProps);// 直接使用这个解析后的 passProps, 会产生莫名奇妙的错误, 稳妥起见, 复制一下
        // 通过 forEach 方法拿到数组中每个元素,将元素与参数的值进行拼接处理,并且放入 paramsArray 中
        paramsKeyArray.forEach(key => passPropsFinal[key] =  passProps[key] );

        // console.log( "网页信息后缀是否包含 showFooterTab = ", passPropsFinal['showFooterTab']);

        if (passPropsFinal['showFooterTab'] == 'true'){
            this.setState({isShowTabButton: true});

        }


        let _this = this;
        this._hiddenProgresssTimer = setTimeout(function () {
            _this.setState({ isShowProgress:false });
            clearTimeout(this._hiddenProgresssTimer);

        },second)

        // console.log('webview _onLoadEnd');
        this.webview.postMessage(++this.data);
    }
    callPhone(){
        if (this.props.UMTrack.length > 0){
            UMTool.onEvent(this.props.UMTrack + '_Consulting');

        }

        Linking.openURL('tel:4001070110')
    }

    onlineMessage(){
        if (this.props.UMTrack.length > 0){
            // console.log('当前的埋点是:' + this.props.UMTrack);
            UMTool.onEvent(this.props.UMTrack + '_OnMessage');

        }
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

    submitMessage(){



        if (this.state.area.length === 0 || this.state.area.replace(/^[\s　]+|[\s　]+$/g, "").length === 0){
            Toast.show('请输入服务范围');
            this.refs.AreaTextInput.clear();
            this.updateArea('');
            return;
        }else if (this.state.name.length === 0 || this.state.name.replace(/^[\s　]+|[\s　]+$/g, "").length === 0){
            Toast.show('请输入您的称呼');
            this.refs.NameTextInput.clear();
            this.updateName('');
            return;
        }else if (this.state.mobile.length === 0 || this.state.mobile.replace(/^[\s　]+|[\s　]+$/g, "").length === 0){
            Toast.show('请输入联系电话');
            this.refs.MobileTextInput.clear();
            this.updateMobile('');
            return;
        }else if (this.state.message.length === 0 || this.state.message.replace(/^[\s　]+|[\s　]+$/g, "").length === 0){
            Toast.show('请输入留言内容');
            this.refs.ContentTextInput.clear();
            this.updateMmessage('');
            return;
        }else {
            let  mobileStr = this.state.mobile.replace(/[^\d]/g, '');// 过滤非数字输入
            let mobileValid = mobileStr.length > 0 && (mobileStr.match(/^([0-9]{11})?$/)) !== null;
            if (!mobileValid){
                Toast.show('请输入正确的联系电话');
                return;
            }
        }

        let loading = SActivityIndicator.show(true, "加载中...");



        apis.submitFeedBack(this.state.navigatorTitle,this.state.area,this.state.name,this.state.mobile,this.state.message).then(
            (responseData) => {
                SActivityIndicator.hide(loading);

                Toast.show('提交成功');
                this.refs.modal3.close()
                this.refs.AreaTextInput.clear();
                this.refs.NameTextInput.clear();
                this.refs.MobileTextInput.clear();
                this.refs.ContentTextInput.clear();


            }, (e) => {
                Toast.show(errorText(e));
                SActivityIndicator.hide(loading);

            }
        );
    }

    appendURL(platform = 'app'){
        let urlStr = this.props.url;
        if (this.props.url.indexOf("pilipa") !== -1 || this.props.url.indexOf("i-counting") !== -1) {
            if (this.props.url.indexOf("?") !== -1) {
                //包含
                urlStr = urlStr + '&userAgent=custapp&plpplatform='+platform+'&client=' + Platform.OS + '&version=' + DeviceInfo.getVersion();
            } else {
                urlStr = urlStr + '?&userAgent=custapp&plpplatform='+platform+'&client=' + Platform.OS + '&version=' + DeviceInfo.getVersion();
            }
        }
        // console.log('当前访问的网页地址是' + urlStr);

        return urlStr;
    }

    /**
     * 微信分享URL加工.
     */
    makeWXURL = () => {
        let urlStr = this.props.url;
        if (this.props.url.indexOf("pilipa") !== -1 || this.props.url.indexOf("i-counting") !== -1) {
            if (this.props.url.indexOf("?") !== -1) {
                //包含
                urlStr = urlStr + '&pilipa=wxapp';
            } else {
                urlStr = urlStr + '?&pilipa=wxapp';
            }
        }

        if (urlStr.indexOf('showFooterTab=true') !== -1){
            urlStr = urlStr.replace(/showFooterTab=true/g, "showFooterTab=false");
        }

        return urlStr;
    };


    render(){



        let urlStr = this.appendURL();

        return(
            <View style={{flex:1,backgroundColor:'#ebebeb',position:'relative'}}>
                <WebView
                    injectedJavaScript={patchPostMessageJsCode}
                    source={{uri:urlStr}}
                    onLoad = {() => {console.log('webview onLoad')}}
                    onLoadEnd = {this._onLoadEnd.bind(this)}
                    onMessage={this._handleMessage}
                    ref={webview => this.webview = webview}
                    renderError={(e) => {
                        if (e) {
                        return;
                        }
                    }}
                    onShouldStartLoadWithRequest={(e) => {
                        console.log('onShouldStartLoadWithRequest ', e.url);
                        let scheme = e.url.split('://')[0];
                        return scheme === 'http' || scheme === 'https';
                    }}
                />
                {
                    this.state.isShowProgress?<Progress.Bar
                        width={deviceWidth}
                        height={2}
                        borderRadius={0}
                        style={styles.progressView}
                        progress={this.state.progress}
                        borderColor="transparent"
                        animationType="timing"
                        animationConfig={{duration:second}}
                    />:null
                }
                {this.state.progress === 1 && this.state.isShowTabButton === true && <View style={styles.tabViewContainer}>
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
                </View>}
                <Modal onBackClick={()=>Keyboard.dismiss()} backdropPressToClose={!this.state.isShowkeyBoard}
                       style={ {height: 439 - 10, width: SCREEN_WIDTH - 75, backgroundColor:'clear',justifyContent: 'center', alignItems: 'center', marginTop: -30}}
                       position={"center"} ref={"modal3"}>



                    <TouchableWithoutFeedback onPress={dismissKeyboard}>

                        <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={0} style={[{marginTop:10,height: 439 - 20, backgroundColor:'#f9f9f9',width: SCREEN_WIDTH - 75,flexDirection: 'column',alignItems:'center'}]}>
                            <View  style={[{height: 439 - 20 - 20, width: SCREEN_WIDTH - 75 - 15,marginTop:10, backgroundColor:'#ffffff',flexDirection: 'column',alignItems:'center'}]}>

                                <TextInput underlineColorAndroid='transparent' placeholderTextColor={'#666666'} style={[styles.textInputStyle,{marginTop: 20}]}
                                           placeholder='服务区域'
                                           ref="AreaTextInput"
                                           onChangeText={
                                               (area) => {
                                                   this.updateArea(area);
                                               }
                                           }
                                />
                                <TextInput underlineColorAndroid='transparent' placeholderTextColor={'#666666'} style={[styles.textInputStyle,{marginTop: 10}]}
                                           placeholder='您的称呼'
                                           ref="NameTextInput"
                                           onChangeText={
                                               (name) => {
                                                   this.updateName(name);
                                               }
                                           }
                                />
                                <TextInput underlineColorAndroid='transparent' placeholderTextColor={'#666666'} style={[styles.textInputStyle,{marginTop: 10}]}
                                           placeholder='联系电话'
                                           ref="MobileTextInput"
                                           keyboardType={'number-pad'}
                                           onChangeText={
                                               (mobile) => {
                                                   this.updateMobile(mobile);
                                               }
                                           }
                                />
                                <TextInput underlineColorAndroid='transparent' multiline={true} ref={"ContentTextInput"} placeholderTextColor={'#D9D8D8'}
                                           style={[styles.textInputStyle,{textAlignVertical:"top",marginTop: 10,height:this.state.isShowkeyBoard ? 130 : 130}]}
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
                <Modal style={{height:187,backgroundColor:'#EDEDED'}} position={"bottom"} ref={"shareModel"}>
                    <Text style={{fontSize:18,padding:16,textAlign:'center',color:'#666666'}}>分享</Text>
                    <View style={{paddingLeft:70,paddingRight:70,flex:1,justifyContent:'space-around', alignItems:'center',flexDirection:'row',borderTopWidth:1,borderTopColor:'#E1E1E1'}}>
                        <TouchableOpacity onPress={()=>{this._share('friend')}}>
                            <View style={{alignItems:'center'}}>
                                <Image source={require('../img/share_friend.png')}/>
                                <Text style={{fontSize:12,marginTop:8,color:'#666666'}}>微信好友</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{this._share('circle')}}>
                            <View style={{alignItems:'center'}}>
                                <Image source={require('../img/share_circle.png')}/>
                                <Text style={{fontSize:12,marginTop:8,color:'#666666'}}>朋友圈</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        )

    }
    _share (type) {
        let urlStr = this.makeWXURL();

        if(type === 'friend'){
            WeChat.isWXAppInstalled()
                .then((isInstalled) => {
                    if (isInstalled) {
                        WeChat.shareToSession({
                            title:this.props.shareTitle,
                            description:this.props.shareDescription,
                            type: 'news',
                            webpageUrl: urlStr,
                            thumbImage:imgUrl
                        })
                            .catch((error) => {
                                // alert(error.message);
                            });
                    } else {
                        // alert('没有安装微信软件，请您安装微信之后再试');
                        Toast.show('没有安装微信软件，请您安装微信之后再试')

                    }
                });

        }else{
            WeChat.isWXAppInstalled()
                .then((isInstalled) => {

                    if (isInstalled) {

                        WeChat.shareToTimeline({
                            title:this.props.shareTitle,
                            description:this.props.shareDescription,
                            type: 'news',
                            webpageUrl: urlStr,
                            thumbImage:imgUrl
                        })
                            .catch((error) => {
                                // alert(error.message);
                            });
                    } else {
                        // alert('没有安装微信软件，请您安装微信之后再试');
                        Toast.show('没有安装微信软件，请您安装微信之后再试')

                    }
                });
        }
    }
    _handleMessage(e) {
        // console.log('网页发送的信息',e.nativeEvent.data)
        UMTool.onEvent(e.nativeEvent.data)
    }

}
const styles = StyleSheet.create({

    progressView: {
        position: 'absolute',
        top:0,
    },

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
        width:SCREEN_WIDTH/2.0
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
        width:SCREEN_WIDTH - 75 - 15 - 35,
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
        marginTop:25,
        borderRadius:8
    }
});

