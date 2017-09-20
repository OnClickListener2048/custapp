/**
 * Created by zhuangzihao on 2017/9/19.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import CommentCell from '../../view/CommenCell'
import SubmitButton from '../../view/ui/SubmitButton'
import clearManager from 'react-native-clear-cache';
import Toast from 'react-native-root-toast'
import BComponent from '../../base';

export default class SettingPage extends BComponent {

    constructor (props) {
        super(props);
        this.state = {
            cacheSize:"",
            unit:"",
        }
    }
    componentDidMount(){
        clearManager.getCacheSize((value,unit)=>{
            this.setState({
                cacheSize:value, //缓存大小
                unit:unit  //缓存单位
            })
        });
    }
    render(){
        return(
            <View style={{flex:1,backgroundColor:'#F9F9F9'}}>
                <ScrollView>
                    <CommentCell
                        leftText = "关于我们"
                        style={{marginTop:10}}
                    />
                    <CommentCell
                        leftText = "意见反馈"
                        onPress={this._feedback.bind(this)}
                    />
                    <CommentCell
                        leftText = "服务条款"
                    />
                    <CommentCell
                        leftText = "清楚缓存"
                        style={{marginTop:10}}
                        rightText = {this.state.cacheSize+this.state.unit}
                        onPress={this._clear.bind(this)}
                    />

                    <SubmitButton
                        text='退出登录'
                        isEnabled = {true}
                    />
                </ScrollView>
            </View>

        )
    }
    _clear(){
        clearManager.runClearCache(()=>{

            Toast.show("清除成功")
            clearManager.getCacheSize((value,unit)=>{
                this.setState({
                    cacheSize:value, //缓存大小
                    unit:unit  //缓存单位
                })
            });

        });
    }
    _feedback(){
        this.props.navigator.push({
            screen: 'FeedbackPage',
        });
    }


}