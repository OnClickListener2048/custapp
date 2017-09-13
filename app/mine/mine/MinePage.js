/**
 * Created by zhuangzihao on 2017/9/8.
 */
import React, {Component} from 'react';
import {
    View,
    Text
} from 'react-native';
import * as WeChat from 'react-native-wechat';
export default class MinePage extends Component {
    render(){
        return(
            <View>
                <Text onPress={()=>{this.login()}}>MinePage</Text>
            </View>
        )
    }
    login(){
        loginJumpSingleton.goToLogin(this.props.navigator);
    }
}