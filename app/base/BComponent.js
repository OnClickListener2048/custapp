/**
 * 基础的自定义返回按钮的组件, 所有的需要显示返回按钮的都需要继承此子类,
 * 并根据需要覆盖 onNavigatorEvent 回调.
 * Created by beansoft on 2017/7/17.
 */

import React, {Component} from 'react';
import {
    Alert,
    AppRegistry,
    StyleSheet,
    Text,
    Image,
    View,
    TextInput,
    DeviceEventEmitter, TouchableOpacity,
    KeyboardAvoidingView, TouchableWithoutFeedback,
    InteractionManager,
    Platform,
    BackAndroid,
    ToastAndroid,
} from 'react-native';
import Toast from 'react-native-root-toast';
import {SCREEN_WIDTH, SCREEN_HEIGHT} from '../config';

/**
 * 用法:
 * import BComponent from '../../base';
 * export default class Settings extends BComponent { }
 */
export default class BComponent extends Component {

    constructor(props) {
        super(props);
        // 自定义左侧返回按钮
        if(this.props.navigator) {
            if (this.props.testID === 'MessagePage' || this.props.testID === 'HomePage' || this.props.testID === 'ServicePage' || this.props.testID === 'MinePage'){

            }else{
                this.props.navigator.setButtons({
                    leftButtons: [
                        {
                            title: '', // for a textual button, provide the button title (label)
                            // buttonColor: 'black', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
                            buttonFontSize: 18, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
                            // buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
                            id: 'goBack',
                            icon: require('../img/left.png'),
                        }], // see "Adding buttons to the navigator" below for format (optional)
                    // rightButtons: [], // see "Adding buttons to the navigator" below for format (optional)
                    animated: false // does the change have transition animation or does it happen immediately (optional)
                });
            }
            this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        }

    }

    static navigatorStyle = {
        navBarHidden: false, // 隐藏默认的顶部导航栏
        tabBarHidden: true, // 默认隐藏底部标签栏
    };
    // 子类请继承此方法, 不要忘了调用super.onNavigatorEvent(event);
    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        // console.log(event.id);//willAppear
        if (event.type === 'NavBarButtonPress') {
            let { id } = event;
            console.log('id=', id);
            if (id === 'goBack') {
                this.props.navigator.pop();
            }
        }
        if (event.id === 'bottomTabSelected') {
            let eventArr = ['homePage','message','service','personal'];
            UMTool.onEvent(eventArr[event.selectedTabIndex])
        }
    }

}