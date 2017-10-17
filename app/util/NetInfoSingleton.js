/**
 * Created by beansoft on 2017/7/13.
 */
import '../storage/UserInfoStore';
import {
    Text,
    NetInfo,
    Animated,
    Easing
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

            NetInfo.isConnected.fetch().done((_isConnected) => {
                this.isConnected = _isConnected;
                console.log('NetInfoSingleton: fetch isConnected=', _isConnected);
            });

            this._updateConnectionStatus = this._updateConnectionStatus.bind(this);
            NetInfo.isConnected.addEventListener('change', this._updateConnectionStatus);
        }
        return instance;
    }

    _updateConnectionStatus(isConnected) {
        console.log('NetInfoSingleton: _updateConnectionStatus isConnected=', isConnected);
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