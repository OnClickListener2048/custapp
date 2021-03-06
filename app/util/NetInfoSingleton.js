/**
 * Created by beansoft on 2017/7/13.
 */
import '../storage/UserInfoStore';
import {
    Text,
    NetInfo,
    Animated,
    Platform
} from 'react-native';
import { Navigation } from 'react-native-navigation';
let instance = null;

/**
 * 网络状态单例.
 */
export default class NetInfoSingleton {
    isConnected = true;// 是否已连接网络

    constructor() {
        if (!instance) {
            instance = this;

            // 避免安卓经常首次fetch返回false导致显示网络不连接的BUG
            if(Platform.OS === 'ios') {
                NetInfo.isConnected.fetch().done((_isConnected) => {
                    if(__DEV__) _isConnected = true;
                    this.isConnected = _isConnected;
                    console.log('NetInfoSingleton: fetch isConnected=', _isConnected);
                });
            }

            this._updateConnectionStatus = this._updateConnectionStatus.bind(this);
            NetInfo.isConnected.addEventListener('change', this._updateConnectionStatus);
        }
        return instance;
    }

    _updateConnectionStatus(isConnected) {
        console.log('NetInfoSingleton: _updateConnectionStatus isConnected=', isConnected);
        if(__DEV__) isConnected = true;
        if(!isConnected){
            Navigation.showInAppNotification({
                screen: "Notification", // unique ID registered with Navigation.registerScreen
                autoDismissTimerSec: 2 // auto dismiss notification in seconds
            });
        }
        this.isConnected = isConnected;
    }

    // 清理用户数据
    reset() {
        NetInfo.isConnected.removeEventListener('change', this._updateConnectionStatus)
    }

}

global.NetInfoSingleton = new NetInfoSingleton();// 全局可用