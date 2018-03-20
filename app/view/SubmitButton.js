import React, {Component, PropTypes} from 'react';
import {View, Text, StyleSheet, TouchableNativeFeedback, Platform, Image, TouchableOpacity} from 'react-native';
import Button from 'apsl-react-native-button';
import px2dp from '../util/index';
import {SCREEN_HEIGHT,SCREEN_WIDTH,PRIMARY_YELLOW} from '../config';

// 登陆页等的底部动作按钮
export default class SubmitButton extends Component {
    static propTypes = {
        isEnabled: PropTypes.bool, // 是否启用
        onPress: PropTypes.func, // 点击事件
        text: PropTypes.string, // 按钮文本
        buttonStyle: View.propTypes.style,//按钮样式
    };

    render() {
        return this.props.isEnabled ?
            (

                <TouchableOpacity {...this.props}>
                    <Image  source={require('../img/Rectangle.png')} style={styles.buttonView}>

                        <Text style={styles.loginText}>{this.props.text}</Text>
                    </Image>
                </TouchableOpacity>
            )
            :
            (
                <TouchableOpacity {...this.props}>
                    <View style={[styles.buttonViewDisabled,this.props.buttonStyle]}>
                        <Text style={styles.loginTextDisabled}>{this.props.text}</Text>
                    </View>
                </TouchableOpacity>
            );
    }
}

const styles = StyleSheet.create({
    buttonView: {
        backgroundColor: 'transparent',
        margin: 0,
        borderRadius: 2,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        height: 50,
        width: SCREEN_WIDTH - 30,
        marginTop: px2dp(45),
        borderWidth: 0,
        resizeMode:'stretch'
    },


    buttonViewDisabled: {
        backgroundColor: 'transparent',
        margin: 0,
        borderRadius: 2,
        borderColor: '#CEAF72',
        borderWidth: 1,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        height: px2dp(88),
        width: px2dp(600),
        marginTop: px2dp(45),
    },

    buttonViewEnabled: {
        backgroundColor: 'transparent',
        margin: 0,
        borderRadius: 22,
        justifyContent: 'center',
        alignSelf: 'center',
        height: px2dp(88),
        width: px2dp(600),
        marginTop: px2dp(45),
        borderWidth: 0,
    },

    buttonEnableView: {
        backgroundColor: '#e6e6e6',
        margin: 0,
        borderRadius: 22,
        justifyContent: 'center',
        alignSelf: 'center',
        height: px2dp(88),
        width: px2dp(600),
        marginTop: px2dp(45)
    },

    loginText: {
        fontSize: 18,
        color: '#FFFFFF',
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center'
    },

    loginTextDisabled: {
        fontSize: 18,
        color: '#CEAF72',
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center'
    },
});