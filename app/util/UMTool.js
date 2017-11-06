/**
 * Created by zhuangzihao on 2017/8/23.
 */

import {
    NativeModules,
    Platform
}from 'react-native'

let UMModules = NativeModules.UMNative
if (Platform.OS === 'android'){
    UMModules = NativeModules.UmengNativeModule
}

export class UMTool{
    static onEvent(eventId){
        UserInfoStore.isLogined().then(
            logined => {
                if (logined){
                    UMModules.onEvent(eventId+'_Y')

                }else{
                    UMModules.onEvent(eventId+'_N')

                }
            },
            e => {
                UMModules.onEvent(eventId+'_N')
            }
        );
    }
}

global.UMTool = UMTool;// 全局可用