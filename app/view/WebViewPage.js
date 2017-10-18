/**
 * Created by zhuangzihao on 2017/10/16.
 */

import React, {Component} from 'react';
import {
    WebView,
} from 'react-native';
import BComponent from '../base/BComponent'
export default class WebViewPage extends BComponent {
    static defaultProps = {
        url:''
    };
    render(){
        return(
            <WebView
                source={{uri:this.props.url}}
                bounces={false}
                startInLoadingState={true}
            />
        )
    }
}