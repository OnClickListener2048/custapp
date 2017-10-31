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
                    
                }else{

                }
            },
            e => {
                console.log("读取登陆状态错误:", e);
            }
        );
    }
}

global.UMTool = UMTool;// 全局可用