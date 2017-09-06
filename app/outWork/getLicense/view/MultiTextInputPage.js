/**
 * 经营范围页
 * Created by jiaxueting on 2017/7/4.
 */
import React from 'react';

import {StyleSheet, TextInput, View} from 'react-native';
import px2dp from '../../../util/index'
import {SCREEN_WIDTH as width} from '../../../config';
import BComponent from "../../../base/index";

const dismissKeyboard = require('dismissKeyboard');     // 获取键盘回收方法

export default class MultiTextInputPage extends BComponent {
    static navigatorStyle = {
        tabBarHidden: true, // 隐藏默认的顶部导航栏
        navBarHidden: false, // 隐藏默认的顶部导航栏
    };

    constructor(props) {
        super(props);
        this.state = {

            bizRange: this.props.bizRange,//经营范围
            messageValid: false,// 内容有效可提交
        };
        // if you want to listen on navigator events, set this up
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    render(){

        return(
            <View style={styles.container}>
            <View style={styles.inputArea}>
                <TextInput underlineColorAndroid='transparent'
                           multiline={true}
                           value={this.state.bizRange}
                           textAlignVertical={'top'}
                           maxLength={1024} keyboardType='default'
                           style={styles.codeInput} placeholder='请输入经营范围'
                           returnKeyType='done'
                           onChangeText={(bizRange) => {
                               let messageValid = (bizRange.length > 0 && bizRange.length <= 1024);
                               this.setState({bizRange, messageValid});
                           }}

                           onSubmitEditing={() => {
                               dismissKeyboard();
                           }}
                />
            </View>
            </View>
        )
    }

    static navigatorButtons = {
        rightButtons: [
            {
                title: '完成', // for a textual button, provide the button title (label)
                buttonColor: 'black', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
                buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
                buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
                id: 'edit'
            }]

    }

    //点击右按钮
    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
         super.onNavigatorEvent(event);
        if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
            if (event.id == 'edit') { // this is the same id field from the static navigatorButtons definition
                console.log("完成返回" + this.props.that);
                let callback = this.props.callback;
                if(callback) {
                    callback(this.state.bizRange);
                }
                // this.props.callback(this.state.bizRange);
                this.props.navigator.pop();

            }
        }

    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F8F9FF',
        flex: 1,
    },
    inputArea: {
        height: px2dp(252),
        width: width,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        backgroundColor:'white',
        borderColor:'#dcdcdc',
        borderTopWidth:0.5,
        borderBottomWidth:0.5,
    },
    codeInput: {
        flex: 1,
        height: px2dp(252),
        paddingLeft: 15,
        paddingRight:15,
        padding: 0,
        fontSize: px2dp(28),
        color:'#323232',
        fontSize: px2dp(30),
        alignSelf: 'center',
        backgroundColor: 'white',
    },


})
