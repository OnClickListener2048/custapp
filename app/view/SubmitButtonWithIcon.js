import React, {Component, PropTypes} from 'react';
import {View, Text, StyleSheet, TouchableNativeFeedback, Platform, Image, TouchableWithoutFeedback} from 'react-native';
import Button from 'apsl-react-native-button';
import px2dp from '../util/index';

// 登陆页等的底部动作按钮
export default class SubmitButtonWithIcon extends Component {
    static propTypes = {
        isEnabled: PropTypes.bool, // 是否启用
        onPress: PropTypes.func, // 点击事件
        text: PropTypes.string, // 按钮文本
        buttonStyle: View.propTypes.style,
    };

    render() {

        return this.props.isEnabled ?
            (
                <TouchableWithoutFeedback onPress={this.props.onPress}>
                    <Image source={require('../img/Rectangle.png')}
                           style={[styles.buttonView, this.props.buttonStyle]}>
                        <Image style={[styles.wechart_icon, {justifyContent: 'flex-start'}]}
                               source={require('../img/wechat.png')}/>

                        <Text
                            style={[styles.loginText]}
                            allowFontScaling={false}
                            key={this.props.text}>
                            {this.props.text}
                        </Text>
                    </Image>
                </TouchableWithoutFeedback>
            )
            :
            (
                <TouchableWithoutFeedback onPress={this.props.onPress}>
                    <View style={styles.buttonViewDisabled}>
                        <Text style={styles.loginTextDisabled}>{this.props.text}</Text>
                    </View>
                </TouchableWithoutFeedback>
            );
    }
}

const styles = StyleSheet.create({
    buttonView: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 0,
        borderRadius: 2,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        height: px2dp(88),
        width: px2dp(600),
        marginTop: px2dp(45),
        borderWidth: 0,
    },

    buttonViewEnabled: {
        flexDirection: 'row',
        backgroundColor: '#ef0c35',
        margin: 0,
        borderRadius: 22,
        justifyContent: 'center',
        alignSelf: 'center',
        height: px2dp(88),
        width: px2dp(600),
        marginTop: px2dp(0),
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
        marginLeft: 2,
        marginBottom: 10,
        textAlign: 'center'
    },

    wechart_icon: {
        resizeMode: "contain",
        alignSelf: 'center',
    },
});