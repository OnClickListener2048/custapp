/**
 * 关于PiLiPa
 * Created by jiaxueting on 2017/12/19.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    NativeModules,
    StyleSheet,
    ScrollView,Platform,
    TextInput, WebView, Image
} from 'react-native';
import CommentCell from '../../view/CommenCell'
import DeviceInfo from 'react-native-device-info';
import BComponent from '../../base';
import {H5_URL} from '../../config'
import * as apis from '../../apis/setting';
import Alert from "react-native-alert";
import Toast from 'react-native-root-toast'


export default class AboutPilipaPage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            updateIcon:this.props.updateIcon,//this.props.updateIcon,//是否显示new
            loadState:'success',
            upgrade:false,//是否有新版本
            newVersion:'',//最新APP版本号
            isforce:false,//是否强制更新
            apkUrl:'',//新包地址
            desc:[],//版本说明

        }
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    // 准备加载组件
    componentWillMount() {
        this.setState({
            oldVersion:DeviceInfo.getVersion(),
        })
        //iOS不显示版本更新信息
        if(Platform.OS!=='ios'){
        //获取本APP版本信息
        this._uploadUpdateCode(DeviceInfo.getVersion());
        }
    }

    //版本更新接口请求
    _uploadUpdateCode(versionCode){
        var loading = SActivityIndicator.show(true, "加载中...");
        apis.loadupdateCode(versionCode).then(
            (responseData) => {
                SActivityIndicator.hide(loading);

                    console.log("设置页版本更新信息="+responseData.info.version,this.state.updateIcon);
                // responseData.info.version = '1.0.6';
                // responseData.info.url = 'http://hlj-app.b0.upaiyun.com/zmw/upload/android-package/helijia.apk';

                    this.setState({
                        upgrade:responseData.info.upgrade?responseData.info.upgrade:false,
                        newVersion:responseData.info.version?responseData.info.version:DeviceInfo.getVersion(),
                        isforce:responseData.info.isforce?responseData.info.isforce:false,
                        apkUrl:responseData.info.url?responseData.info.url:'',
                        desc:responseData.info.desc?responseData.info.desc:[],
                        loadState: 'success'
                        }
                    );
            },
            (e) => {
                SActivityIndicator.hide(loading);

                this.setState({
                    loadState: NetInfoSingleton.isConnected ? 'error' : 'no-net',
                })
                console.log('error', e)
            },
        );
    }

    _aboutUs() {
        this.push({
            screen: 'WebViewPage',
            title:'关于我们',
            backButtonHidden: true, // 是否隐藏返回按钮 (可选)
            passProps:{
                url:H5_URL+'aboutus?platform=app'
            }
        });
    }

    _serviceTerm(){
        this.push({
            screen: 'ServiceTermPage',
            title: '服务条款',
            backButtonHidden: true, // 是否隐藏返回按钮 (可选)
        });
    }


    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        super.onNavigatorEvent(event);

    }

    //版本更新点击事件
    _updateCode(){
        console.log("upgrade="+this.state.upgrade);
        if(this.state.upgrade === false){
            Toast.show("当前已是最新版")
            return;
        }
        this.setState({
            updateIcon:true,
        })
        let callback = this.props.callback;
        if(callback) {
            callback(true);
        }
        Alert.alert('更新提示', '立即更新到噼里啪', [
            {
                text: "取消",
                onPress: ()=>{
                    let  upgradeAlert = {
                        'upgrade':true,
                        'newversion':this.state.newVersion,
                    }
                    UserInfoStore.setUpgrade_setting(upgradeAlert).then();
                },style: 'cancel',
            },{
                text: "更新",
                onPress: ()=>{
                    let  upgradeAlert = {
                        'upgrade':true,
                        'newversion':this.state.newVersion,
                    }
                    UserInfoStore.setUpgrade_setting(upgradeAlert).then();
                    if(Platform.OS === 'ios'){

                        //跳转到APP Stroe
                        NativeModules.upgrade.openAPPStore('1300062750');

                    }else{
                        // loadings =
                        // this.setToggleTimeout();
                        if(this.state.isforce) {
                            //调用更新提示框
                            this.props.navigator.showLightBox({
                                screen: "UpdateLightBox",
                                passProps: {
                                    onClose: () => {},
                                    // dataArr:['1.版本更新版本更新版本更新版本更新版本更新版本更新版本更新','2.dfjsifjksdafjas','3.fdaskfjadskfjsdkf'],
                                    dataArr:this.state.desc,
                                    version:this.state.newVersion,
                                    apkUrl:this.state.apkUrl,
                                    isForce:this.state.isforce,
                                    inProgress: true,
                                },
                                overrideBackPress: true, // 拦截返回键
                                style: {
                                    backgroundBlur: 'none',
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    tapBackgroundToDismiss:false
                                }
                            });
                        } else {
                            Toast.show("安装包已在后台下载, 请等待下载完成后安装");
                        }


                        // 下载最新Apk
                        NativeModules.upgrade.upgrade(this.state.apkUrl);
                        // NativeModules.upgrade.upgrade('http://pilipa-assets.oss-cn-beijing.aliyuncs.com/app/li-armeabi-v7a-release_pilipa.apk');
                    }
                },
            }]);
    }


    render(){
        var  textConnent = "噼里啪"+this.state.oldVersion;
        return(
            <View style={{flex: 1, backgroundColor: '#F9F9F9'}}>
                <ScrollView>
                    <View style={styles.container}>
                        <Image resizeMode = "contain" style = {{marginTop:24}} source={require("../../img/pilipa_icon.png")} />
                        <Text style={styles.textstyles}>
                        {textConnent}
                    </Text>
                    </View>
                    <CommentCell
                        leftText="平台介绍"
                        style={{marginTop: 10}}
                        onPress={this._aboutUs.bind(this)}
                    />
                    <CommentCell
                        leftText="服务条款"
                        onPress={this._serviceTerm.bind(this)}
                    />

                    {this.state.updateIcon=== false&&Platform.OS !== 'ios'?
                        this.state.upgrade?<CommentCell
                            leftText="版本更新"
                            rightText={this.state.newVersion}
                            style={{marginTop:9}}
                            onPress={this._updateCode.bind(this)}
                        />:<CommentCell
                            leftText="版本更新"
                            style={{marginTop:9}}
                            onPress={this._updateCode.bind(this)}
                        />:Platform.OS !== 'ios'&&
                        <CommentCell
                            leftText="版本更新"
                            style={{marginTop:9}}
                            leftTextIcon={require('../../img/new_icon.png')}
                            rightText={this.state.newVersion}
                            onPress={this._updateCode.bind(this)}
                        /> }

                </ScrollView>
            </View>
        )}


}

const styles = StyleSheet.create({
    container:{
        flexDirection: 'column',
        backgroundColor:'#f9f9f9',
        flex:1,
        alignItems:'center',
    },
    textstyles:{
        color:'#999999',
        fontSize:16,
        marginTop:5,
        marginBottom:10,

    },


});