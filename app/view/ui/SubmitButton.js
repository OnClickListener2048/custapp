import React, {Component, PropTypes} from 'react';
import {View, Text, StyleSheet, TouchableNativeFeedback, Platform} from 'react-native';
import Button from 'apsl-react-native-button';
import px2dp from '../../util/index';

// 登陆页等的底部动作按钮
export default class SubmitButton extends Component {
    static propTypes = {
        isEnabled: PropTypes.bool, // 是否启用
        onPress: PropTypes.func, // 点击事件
        text: PropTypes.string, // 按钮文本
    };

    render() {
        return (
            <Button
                style={styles.buttonViewEnabled}
                disabledStyle={styles.buttonView}
                isDisabled={!this.props.isEnabled}
                onPress={this.props.onPress}
                textStyle={styles.loginText}>
                {this.props.text}
            </Button>
        );
    }
}

const styles = StyleSheet.create({
    buttonView: {
        backgroundColor: '#e6e6e6',
        margin: 0,
        borderRadius: 6,
        justifyContent: 'center',
        alignSelf: 'center',
        height: px2dp(88),
        width: px2dp(500),
        marginTop: px2dp(45),
        borderWidth: 0,
    },

    buttonViewEnabled: {
        backgroundColor: '#ef0c35',
        margin: 0,
        borderRadius: 6,
        justifyContent: 'center',
        alignSelf: 'center',
        height: px2dp(88),
        width: px2dp(500),
        marginTop: px2dp(45),
        borderWidth: 0,
    },

    buttonEnableView: {
        backgroundColor: '#e6e6e6',
        margin: 0,
        borderRadius: 6,
        justifyContent: 'center',
        alignSelf: 'center',
        height: px2dp(88),
        width: px2dp(500),
        marginTop: px2dp(45)
    },

    loginText: {
        fontSize: 15,
        color: '#FFFFFF',
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center'
    },
});