import React, {Component, PropTypes} from 'react';
import {View, Text, StyleSheet, TouchableNativeFeedback, Platform, Image, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import Button from 'apsl-react-native-button';
import px2dp from '../util/index';
import {SCREEN_HEIGHT,SCREEN_WIDTH,PRIMARY_YELLOW} from '../config';

// 登陆页等的底部动作按钮
export default class SubmitButtonWithIcon extends Component {
    static propTypes = {
        isEnabled: PropTypes.bool, // 是否启用
        onPress: PropTypes.func, // 点击事件
        text: PropTypes.string, // 按钮文本
        buttonStyle: View.propTypes.style,
        textStyle:View.propTypes.style,//文字样式
        img:PropTypes.object//左侧显示的图片，默认为微信icon
    };

    static defaultProps = {
        img:require('../img/wechat.png')//默认展示微信icon
    }

    render() {

        return this.props.isEnabled ?
            (
                <TouchableOpacity onPress={this.props.onPress}>
                    <Image source={require('../img/Rectangle.png')}

                           style={[styles.buttonView, this.props.buttonStyle]}>
                        <Image style={[styles.wechart_icon, {justifyContent: 'flex-start'}]}
                               source={this.props.img}/>

                        <Text
                            style={[styles.loginText,this.props.textStyle]}
                            allowFontScaling={false}
                            key={this.props.text}>
                            {this.props.text}
                        </Text>
                    </Image>
                </TouchableOpacity>
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
        height: 50,
        width: SCREEN_WIDTH - 30,
        marginTop: px2dp(45),
        borderWidth: 0,
        resizeMode:'stretch'
    },

    buttonViewEnabled: {
        flexDirection: 'row',
        backgroundColor: '#ef0c35',
        margin: 0,
        borderRadius: 22,
        justifyContent: 'center',
        alignSelf: 'center',
        height: 50,
        width: SCREEN_WIDTH - 30,
        marginTop: px2dp(0),
        borderWidth: 0,
    },

    buttonEnableView: {
        backgroundColor: '#e6e6e6',
        margin: 0,
        borderRadius: 22,
        justifyContent: 'center',
        alignSelf: 'center',
        height: 50,
        width: SCREEN_WIDTH - 30,
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