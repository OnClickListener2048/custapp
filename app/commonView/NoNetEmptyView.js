/**
 *  无网状态显示组件, 支持网络恢复正常时自动执行回调.
 * Created by beansoft on 2017/7/25.
 */

import React, {Component, PropTypes} from 'react';
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
    NetInfo
} from 'react-native';
import NoMessage from './NoMessage';
import Toast from 'react-native-root-toast';
import {SCREEN_WIDTH, SCREEN_HEIGHT} from '../config';
import NoNetView from "./NoNetView";

/**
 * 用法:
 * import NoNetEmptyView from '../../base/NoNetEmptyView';
 * <NoNetEmptyView onClick= {点击处理事件} errorText='可设置的提示文案'>
不要嵌入任何子组件
 *  </NoNetEmptyView>
 */
export default class NoNetEmptyView extends NoNetView {

    render() {
        return null;
    }
}