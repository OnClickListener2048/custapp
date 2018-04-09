/**
 * Created by zhuangzihao on 2018/4/9.
 */
import {
    NativeModules,
    Platform
}from 'react-native'

let RNIOSTools = NativeModules.RNIOSTools;

export default function goQQChat(qq=''){
    if(Platform.OS === 'ios'){
        RNIOSTools.goQQChat(qq);
    }
}
