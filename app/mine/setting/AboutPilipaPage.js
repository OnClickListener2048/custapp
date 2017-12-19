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

export default class ServiceTermPage extends BComponent {

    _aboutUs() {
        // this.props.navigator.push({
        //     screen: 'AboutPilipaPage',
        //     title: '关于噼里啪'
        // });
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
                    <CommentCell
                        leftText="版本更新"
                        rightText={"v"+DeviceInfo.getVersion()}
                        // onPress={this._aboutUs.bind(this)}
                    />
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