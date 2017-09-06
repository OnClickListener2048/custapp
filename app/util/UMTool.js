/**
 * Created by zhuangzihao on 2017/8/23.
 */

import {
    NativeModules,
    Platform
}from 'react-native'

let UMTool = NativeModules.UMNative
if (Platform.OS === 'android'){
    UMTool = NativeModules.UmengNativeModule
}
global.UMTool = UMTool;// 全局可用