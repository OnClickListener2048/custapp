/**
 * Created by zhuangzihao on 2018/4/9.
 */
import {
    Linking,
    NativeModules,
    Platform
} from 'react-native'

let RNIOSTools = NativeModules.RNIOSTools;

// 跳转到QQ聊天支持页面, iOS 需要原生代码支持.
export default function goQQChat(qq=''){
    if(Platform.OS === 'ios'){
        RNIOSTools.goQQChat(qq);
    } else {
        //Linking为RN自带的组件
        let url = "mqqwpa://im/chat?chat_type=wpa&uin=" + qq;//调用QQ
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            }
        });
    }
}
