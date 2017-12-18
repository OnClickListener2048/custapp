/**
 * Created by zhuangzihao on 2017/10/16.
 */

import React, {Component} from 'react';
import {
    WebView,
    StyleSheet,
    View,
    Dimensions
} from 'react-native';
import BComponent from '../base/BComponent'
import * as Progress from 'react-native-progress';
const deviceWidth = Dimensions.get('window').width;

const patchPostMessageFunction = function() {
    var originalPostMessage = window.postMessage;

    var patchedPostMessage = function(message, targetOrigin, transfer) {
        originalPostMessage(message, targetOrigin, transfer);
    };

    patchedPostMessage.toString = function() {
        return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
    };

    window.postMessage = patchedPostMessage;
};

const patchPostMessageJsCode = '(' + String(patchPostMessageFunction) + ')();';

const second = 1500

export default class WebViewPage extends BComponent {
    static defaultProps = {
        url:''
    };
    constructor(props) {
        super(props);
        this.state={
            progress:0,
            isShowProgress:true
        }
        this._handleMessage = this._handleMessage.bind(this);
    }

    componentDidMount() {
        this.setState({ progress:0.95 });

    }
    _onLoadEnd(){
        this.setState({ progress:1 });

        let _this = this;
        this._hiddenProgresssTimer = setTimeout(function () {
            _this.setState({ isShowProgress:false });
            clearTimeout(this._hiddenProgresssTimer);

        },second)
    }

    render(){
        return(
            <View style={{flex:1,backgroundColor:'#ebebeb',position:'relative'}}>
                <WebView
                    injectedJavaScript={patchPostMessageJsCode}
                    source={{uri:this.props.url}}
                    onLoadEnd = {this._onLoadEnd.bind(this)}
                    onMessage={this._handleMessage}
                />
                {
                    this.state.isShowProgress?<Progress.Bar
                        width={deviceWidth}
                        height={2}
                        borderRadius={0}
                        style={styles.progressView}
                        progress={this.state.progress}
                        borderColor="transparent"
                        animationType="timing"
                        animationConfig={{duration:second}}
                    />:null
                }
            </View>
        )
    }
    _handleMessage(e) {
        if(e.nativeEvent.data){
            UMTool.onEvent(e.nativeEvent.data)
        }
    }

}
const styles = StyleSheet.create({

    progressView: {
        position: 'absolute',
        top:0,
    }
});