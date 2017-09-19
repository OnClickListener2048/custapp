/**
 * Created by zhuangzihao on 2017/9/14.
 */
import React, {Component} from 'react';
import {
    WebView,
} from 'react-native';
export default class HomeDetailPage extends Component {
    static defaultProps = {
        url:''
    };
    render(){
        return(
            <WebView
                source={{url:this.props.url}}
            />
        )
    }
}