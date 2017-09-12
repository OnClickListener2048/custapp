/**
 * Created by zhuangzihao on 2017/9/11.
 */
import React, {Component} from 'react';
import {
    View,
    Text
} from 'react-native';

export default class HomeDetailPage extends Component {
    static navigatorStyle = {
        navBarHidden: false, // 隐藏默认的顶部导航栏
        tabBarHidden: true, // 默认隐藏底部标签栏
    };
    render(){
        return(
            <View>
                <Text>HomeDetailPage</Text>
            </View>
        )
    }
}