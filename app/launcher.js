import React, { Component } from 'react';
import {navToMainTab} from './navigation';
import './storage/UserInfoStore';
import './util/LoginJumpSingleton';
import './util/NetInfoSingleton';
import './util/UMTool';
import './util/DeviceInfo';

import {Navigation} from 'react-native-navigation';
import { Text ,NetInfo} from 'react-native';
import *as wechat from 'react-native-wechat'
import Toast from 'react-native-root-toast'
Text.defaultProps.allowFontScaling=false;// 全部禁用字体缩放
// 测试准备, 关闭Warning框
console.disableYellowBox = false;
console.warn('YellowBox is disabled.');
console.log("NetInfoSingleton", NetInfoSingleton.isConnected);
wechat.registerApp('wx16da5000356a9497')
navToMainTab();
