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
import Alert from "react-native-alert";

export default class ServiceTermPage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            updateIcon:this.props.updateIcon,
        }
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
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

    _updateCode(){
        this.setState({
            updateIcon:'false',
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
                    {this.state.updateIcon==='false'?
                        <CommentCell
                            leftText="版本更新"
                            rightText={"v"+DeviceInfo.getVersion()}
                            onPress={this._updateCode.bind(this)}
                        />:
                        <CommentCell
                            leftText="版本更新"
                            leftIcon={require('../../img/left_button.png')}
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