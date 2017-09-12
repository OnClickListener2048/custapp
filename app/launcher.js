import React, { Component } from 'react';
import {navToMainTab} from './navigation';
import './storage/UserInfoStore';
import './util/LoginJumpSingleton';
import './util/NetInfoSingleton';
import './util/UMTool';

import {Navigation} from 'react-native-navigation';
import { Text } from 'react-native';
import *as wechat from 'react-native-wechat'
Text.defaultProps.allowFontScaling=false;// 全部禁用字体缩放

// 测试准备, 关闭Warning框
console.disableYellowBox = false;
console.warn('YellowBox is disabled.');
console.log("NetInfoSingleton", NetInfoSingleton.isConnected);
wechat.registerApp('wxad8622a788203fa5')
navToMainTab();

// Navigation.startSingleScreenApp({
//     screen: {
//         screen: 'demo/ButtonExample',
//         title: '图片缩放',
//     },
//     portraitOnlyMode: true,
// });