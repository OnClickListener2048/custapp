/**
 *  无网状态显示组件, 支持点击时及网络恢复正常时执行回调.
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
import NoMessage from '../commonView/NoMessage';
import Toast from 'react-native-root-toast';
import {SCREEN_WIDTH, SCREEN_HEIGHT} from '../config';

/**
 * 用法:
 * import NoNetView from '../../base/NoNetView';
 * <NoNetView onClick= {点击处理事件} errorText='可设置的提示文案'
 * enable={true}>
 *     <... 原始的view代码>
 *  </NoNetView>
 */
export default class NoNetView extends Component {
    static defaultProps = {
        enable: false,
        errorText: '网络错误,点击重新开始'
    };  // 默认属性

    static propTypes = {
        style: PropTypes.object, // 样式, 可选
        onClick: PropTypes.func,// 点击事件
        errorText: PropTypes.string,// 失败文案, 可选
        enable: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.number])// 组件是否可用
    };

    constructor(props) {
        super(props);

        this.state = {
            isConnected: true,// 是否已连接网络
        };

        NetInfo.isConnected.fetch().done((isConnected) => {
            this.setState({isConnected: isConnected});
        })

        this._updateConnectionStatus = this._updateConnectionStatus.bind(this);
        NetInfo.isConnected.addEventListener('change', this._updateConnectionStatus);
    }

    _updateConnectionStatus(isConnected) {
        // this.setState({isConnected: isConnected});

        // 网络恢复时自动重连
        // if(isConnected) {
        //     let {onClick} = this.props;
        //     if(onClick !== undefined){ onClick(); }
        // }
    }

    render() {
        console.log("NoNetView" + this.state.isConnected);
        let {onClick, style, errorText, enable} = this.props;

        if (!this.state.isConnected && enable) {      // 无网络
            return(
                <TouchableOpacity style={{flex : 1 , backgroundColor:'#FFFFFF'}}
                                  onPress={() => { if(onClick !== undefined){ onClick(); } }}>
                    <View style={{flex : 1 , backgroundColor:'#FFFFFF' }}>
                        <NoMessage
                            textContent={errorText}
                            active={require('../img/network_error.png')}/>
                    </View>
                </TouchableOpacity>
            );
        }else {
            return (
                <View  style={[{flex:1}, style]}>
                    {this.props.children}
                </View>
            )
        }
    }
}