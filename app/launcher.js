import React, { Component } from 'react';
import {navToMainTab} from './navigation';
import './storage/UserInfoStore';
import './util/LoginJumpSingleton';
import './util/NetInfoSingleton';
import './util/UMTool';
import './util/DeviceInfo';
import './util/ScreenUtil'

import {Navigation} from 'react-native-navigation';
import { Text ,NetInfo,Dimensions} from 'react-native';
import {WECHAT_APP_ID} from './config' ;
import * as wechat from 'react-native-wechat'
import Toast from 'react-native-root-toast'
Text.defaultProps.allowFontScaling=false;// 全部禁用字体缩放

// 测试准备, 关闭Warning框
console.disableYellowBox = false;
console.warn('YellowBox is disabled.');
console.log("NetInfoSingleton", NetInfoSingleton.isConnected);
wechat.registerApp(WECHAT_APP_ID);
navToMainTab();
