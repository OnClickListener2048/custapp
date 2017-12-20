/**
 * 关于PiLiPa
 * Created by jiaxueting on 2017/12/19.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
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


export default class ServiceTermPage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            updateIcon:this.props.updateIcon,//是否更新
            loadState:'success',
            oldVersion:'',//当前APP版本号
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
        // if(Platform.OS!=='ios'){
        //获取本APP版本信息
        DeviceInfo.getVersion();
        this._uploadUpdateCode('1.0.6');
        // }
    }

    //版本更新接口请求
    _uploadUpdateCode(versionCode){
        var loading = SActivityIndicator.show(true, "加载中...");
        apis.loadupdateCode(versionCode).then(
            (responseData) => {
                SActivityIndicator.hide(loading);

                if (responseData.code == 0) {
                    console.log("版本更新信息="+responseData.info.version);
                    this.setState({
                        newVersion:responseData.info.version?responseData.info.version:DeviceInfo.getVersion(),
                        isforce:responseData.info.isforce?responseData.info.isforce:false,
                        apkUrl:responseData.info.url?responseData.info.url:'',
                        desc:responseData.info.desc?responseData.info.desc:[],
                        loadState: 'success'
                        }
                    );
                }else{
                    this.setState({
                            loadState: 'error'
                        }
                    );
                }
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

        console.log('ApplicationCenterPage event.type', event.type+","+event.id);
        if(event.id==='goBack'){
            console.log("监听返回键");
            let callback = this.props.callback;
            if(callback) {
                callback(this.state.updateIcon);
            }
            console.log("关闭页面");
            // this.props.navigator.pop();
        }
    }

    //版本更新点击事件
    _updateCode(){
        if(this.state.updateIcon === false){
            Toast.show("当前已是最新版")
            return;
        }
        this.setState({
            updateIcon:false,
        })
        Alert.alert('更新提示', '立即更新到噼里啪', [
            {
                text: "更新",
                onPress: ()=>{

                },
            },{
                text: "取消",
                onPress: ()=>{

                },style: 'cancel',
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
                        <CommentCell
                            leftText="版本更新"
                            style={{marginTop:9}}
                            rightText={this.state.newVersion}
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