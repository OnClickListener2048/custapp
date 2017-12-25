import React, {Component} from 'react';
import {navToMainTab} from './navigation';
import './storage/UserInfoStore';
import './util/LoginJumpSingleton';
import './util/NetInfoSingleton';
import './util/UMTool';
import './util/DeviceInfo';
import './util/ScreenUtil'
import './modules/react-native-sww-activity-indicator'
import JPushModule from 'jpush-react-native';

import {Navigation} from 'react-native-navigation';
import {Text, NetInfo, Dimensions, Platform, DeviceEventEmitter, AsyncStorage} from 'react-native';
import {WECHAT_APP_ID} from './config' ;
import * as wechat from 'react-native-wechat'

//The device-log contains the public api that you will use in your app.
//The LogView is the GUI/Log-list that you can render at desired location //in your app:

import deviceLog, {LogView, InMemoryAdapter} from 'react-native-device-log';

//Call init and set a custom adapter that implements the interface of
//AsyncStorage: getItem, removeItem, setItem.
//By default the log uses a in-memory object, in this example we
//explicitly set the log to use the persistent AsyncStorage instead:

deviceLog.init(AsyncStorage /* You can send new InMemoryAdapter() if you do not want to persist here*/
    , {
        //Options (all optional):
        logToConsole: false, //Send logs to console as well as device-log
        logRNErrors: true, // Will pick up RN-errors and send them to the device log
        maxNumberToRender: 2000, // 0 or undefined == unlimited
        maxNumberToPersist: 2000 // 0 or undefined == unlimited
    }).then(() => {

    //When the deviceLog has been initialized we can clear it if we want to:
    deviceLog.clear();
    deviceLog.log("启动了");
});



Text.defaultProps.allowFontScaling = false;// 全部禁用字体缩放

// 测试准备, 关闭Warning框
console.disableYellowBox = true;
console.warn('YellowBox is disabled.');
console.log("NetInfoSingleton", NetInfoSingleton.isConnected);
wechat.registerApp(WECHAT_APP_ID);
if (Platform.OS === 'ios') {
    JPushModule.setBadge(0, (badgeNumber) => {
    });

    JPushModule.addOpenNotificationLaunchAppListener((message) => {
        this._timer = setTimeout(() => {
            DeviceEventEmitter.emit('ClickJPushMessage', message);
            clearTimeout(this._timer);
        }, 500);

    });
}
// this._timer = setTimeout(() => {
//     DeviceEventEmitter.emit('ClickJPushMessage', {"url":"pilipa://view.company.check"});
//     clearTimeout(this._timer);
// }, 1000);
navToMainTab();
