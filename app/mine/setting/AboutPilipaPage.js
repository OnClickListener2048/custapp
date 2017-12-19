/**
 * 关于PiLiPa
 * Created by jiaxueting on 2017/12/19.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput, WebView
} from 'react-native';
import CommentCell from '../../view/CommenCell'
import DeviceInfo from 'react-native-device-info';
import BComponent from '../../base';
import {H5_URL} from '../../config'
import * as apis from '../../apis/setting';

export default class ServiceTermPage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            updateIcon:this.props.updateIcon,
            loadState:'success',
        }
        // this._uploadUpdateCode = this._uploadUpdateCode.bind(this);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    // 准备加载组件
    componentWillMount() {
        //iOS不显示版本更新信息
        // if(Platform.OS!=='iOS'){
        //获取本APP版本信息
        DeviceInfo.getVersion();
        this._uploadUpdateCode('1.0.6');
        // }
    }

    //版本更新
    _uploadUpdateCode(versionCode){
        var loading = SActivityIndicator.show(true, "加载中...");
        apis.loadupdateCode(versionCode).then(
            (responseData) => {
                SActivityIndicator.hide(loading);

                if (responseData.code == 0) {
                    console.log("版本更新信息="+responseData.info.upgrade);
                    this.setState({
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
        this.setState({
            updateIcon:false,
        })
    }


    render(){
        return(
            <View style={{flex: 1, backgroundColor: '#F9F9F9'}}>
                <ScrollView>
                    <CommentCell
                        leftText="平台介绍"
                        style={{marginTop: 10}}
                        onPress={this._aboutUs.bind(this)}
                    />
                    <CommentCell
                        leftText="服务条款"
                        onPress={this._serviceTerm.bind(this)}
                    />
                    {this.state.updateIcon=== false?
                        <CommentCell
                            leftText="版本更新"
                            style={{marginTop:9}}
                            rightText={"v"+DeviceInfo.getVersion()}
                            onPress={this._updateCode.bind(this)}
                        />:
                        <CommentCell
                            leftText="版本更新"
                            style={{marginTop:9}}
                            leftTextIcon={require('../../img/new_icon.png')}
                            rightText={"v"+DeviceInfo.getVersion()}
                            onPress={this._updateCode.bind(this)}
                        /> }

                </ScrollView>
            </View>
        )}


}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#f9f9f9',
        flex: 1,
        paddingTop:10,

        marginBottom:10
    }


});