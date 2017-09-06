/**
 问题反馈
 */
import React from 'react';

import {Alert, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View,} from 'react-native';
import px2dp from '../../util/index'
import Toast from 'react-native-root-toast';
import {SCREEN_WIDTH as width} from '../../config';
import SActivityIndicator from '../../modules/react-native-sww-activity-indicator';
import * as apis from '../../apis';
import BComponent from '../../base';
import errorText from "../../util/ErrorMsg";
import SubmitButton from "../../view/ui/SubmitButton";

const dismissKeyboard = require('dismissKeyboard');     // 获取键盘回收方法
// import Alert from "../../modules/react-native-alert";

export default class Feedback extends BComponent {
    static navigatorStyle = {
        tabBarHidden: true, // 隐藏默认的顶部导航栏
        navBarHidden: false, // 隐藏默认的顶部导航栏
    };

    static navigatorButtons = {
        leftButton: {
            id: 'back',
            // icon: require('../../img/right_l.png')
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            userName: '-',     // 用户名
            mobile: '', //手机号
            message: '',//反馈内容
            messageValid: false,// 内容有效可提交
        };
    }

    componentWillMount() {
        UserInfoStore.getUserInfo().then(
            (user) => {
                if (user !== null) {
                    this.setState({userName: user.name});
                }
            },
            (e) => {
                console.log("读取信息错误:", e);
            },
        );
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={styles.container}>

                <View style={styles.inputArea}>
                    <TextInput underlineColorAndroid='transparent'
                               multiline={true}
                               value={this.state.smsCode}
                               textAlignVertical={'top'}
                               maxLength={1024} keyboardType='default'
                               style={styles.codeInput} placeholder='请输入反馈内容'
                               returnKeyType='done'
                               onChangeText={(message) => {
                                   let messageValid = (message.length > 0 && message.length <= 1024);
                                   this.setState({message, messageValid});
                               }}

                               onSubmitEditing={() => {
                                   dismissKeyboard();
                               }}
                    />
                </View>
                <View style={styles.divider}/>

                <View style= {[styles.lineView,
                    {marginTop: px2dp(20)}]}>
                    <Text style={styles.nameTextStyle}>
                        反馈人员:
                    </Text>
                    <Text style= {[styles.nameTextStyle,
                        {marginLeft: 5}]}>
                        {this.state.userName}
                    </Text>
                </View>

                <SubmitButton onPress={() => {this._doFeedback()}} isEnabled={this.state.messageValid}
                              text="提交反馈"
                />

            </View>
            </TouchableWithoutFeedback>
        );
    }

    _doFeedback() {
        let message = this.state.message;

        if (message.length === 0){
            return;
        }

        let loading = SActivityIndicator.show(true, "");
        let userName = this.state.userName;

        apis.sendFeedback({message , userName}).then(
            (responseData) => {
                SActivityIndicator.hide(loading);
                Toast.show('产品经理已经收到你的反馈，我们会尽快解决你所遇到的问题',
                    {position: Toast.positions.CENTER, duration: Toast.durations.SHORT, }//backgroundColor: 'green'}
                    );
                setTimeout(() => {this.props.navigator.pop()}, 3000);
            },
            (e) => {
                SActivityIndicator.hide(loading);
                console.log("反馈提交失败:" , e);
                Alert.alert('反馈提交失败', errorText(e),
                    [
                        {
                            text: '确定',
                            onPress: () => {
                            },
                        },]
                    , {cancelable: false});
            },
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FAFAFA',
        flex: 1,
    },

    inputArea: {
        height: px2dp(352),
        width: width,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        paddingLeft: 15,
        paddingTop: 15,
        alignItems: 'center',
        backgroundColor: 'white',
    },

    lineView: {
        // height: px2dp(100),
        width: width,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginLeft: 15,
        marginRight: 15,
        alignItems: 'center'
    },

    divider: {
        backgroundColor: '#dedede',
        marginLeft: 0,
        marginRight: 0,
        height: 0.5,
    },

    nameTextStyle: {
        fontSize: 15,
        color: '#323232',
        textAlign: 'left',
        marginLeft: 0,
    },

    buttonView: {
        margin: 0,
        borderRadius: 5,
        alignSelf: 'center',
        justifyContent: 'center',
        height: px2dp(88),
        width: px2dp(500),
        marginTop: px2dp(100),
    },
    submitButtonText: {
        fontSize: 30 / 2,
        color: '#ffffff',
        textAlign: 'center',
    },

    // phone input box
    textInputContainer: {
        height: px2dp(88),
        // width: SCREEN_WIDTH,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent:'center'
    },

    codeInput: {
        flex: 1,
        height: px2dp(352) - 15,
        width: px2dp(148),
        marginLeft: px2dp(0),
        padding: 0,
        fontSize: px2dp(28),
        color: '#323232',
        backgroundColor: 'white',
        alignSelf: 'center',
    },
});