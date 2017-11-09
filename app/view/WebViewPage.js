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
    constructor(props) {
        super(props);
        this._handleMessage = this._handleMessage.bind(this);
    }

    render(){
        console.log(this.props.url);
        return(
            <WebView
                source={{uri:this.props.url}}
                // bounces={false}
                // startInLoadingState={true}
                onMessage={this._handleMessage}
            />
        )
    }
    _handleMessage(e) {
        if(e.nativeEvent.data){
            UMTool.onEvent(e.nativeEvent.data)
        }
    }

}