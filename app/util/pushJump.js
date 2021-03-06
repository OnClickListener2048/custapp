import pushJumpData from '../data/PushJumpScreen';// 页面跳转规则
import pushJumpDataHome from '../data/PushJumpHome';// 首页标签规则
import * as URI from "uri-js";
import queryString from "query-string";
import deviceLog from 'react-native-device-log';
import {H5_URL} from "../config";
const log = deviceLog;


const jumpMap = new Map();// 跳转映射规则
pushJumpData.forEach(data => {
    if(data.uri) {
        jumpMap.set(data.uri, data);
    }
}  );

// for (let [key, value] of jumpMap.entries()) {
//     console.log("跳转规则:", key + " = " , value);
// }

const homeTabMap = new Map();// 首页规则
pushJumpDataHome.forEach(data => {
    if(data.uri) {
        homeTabMap.set(data.uri, data);
    }
}  );

// for (let [key, value] of homeTabMap.entries()) {
//     console.log("首页标签规则:", key + " = " , value);
// }

/**
 * 执行跳转
 * @param navigator
 * @param urlStr - pilipa://view.services/cashflow?companyid=<111>&date=<2016-06>
 * @param urlTitle - 网页标题
 */
export default function pushJump(navigator, urlStr, urlTitle = '噼里啪智能财税',shareTitle='',shareDescription='',UMTrack = '') {
    try {
        let components = URI.parse(urlStr);
        console.log( "跳转目标 components = ", components);
        let uri = components.scheme + "://" + components.host + components.path;
        console.log( "跳转目标 uri = ", uri);
        if(components.scheme === 'http' || components.scheme === 'https') {
            console.log( "跳转WebView = ", urlStr);
            // 首页动作, 设置切换标签页
            if (navigator && urlStr && urlStr.length > 0) {
                navigator.push({
                    screen: 'WebViewPage',
                    title:urlTitle,
                    backButtonHidden: true, // 是否隐藏返回按钮 (可选)
                    passProps:{
                        url:urlStr,
                        navigatorTitle:urlTitle,
                        UMTrack:UMTrack,
                        shareTitle:shareTitle,
                        shareDescription:shareDescription
                    }
                });
            }
            return;
        }
        let query = components.query;
        let passProps = {};
        if (query) {
            passProps = queryString.parse(query);
        }
        let targetObject = homeTabMap.get(uri);

        console.log( "首页跳转目标 = ", targetObject);
        // 首页动作, 设置切换标签页
        if (navigator && targetObject) {
            navigator.switchToTab({
                tabIndex: targetObject.tab
            });

            return;
        }

        // 页面跳转
        targetObject = jumpMap.get(uri);
        console.log( "页面跳转目标 = ", targetObject);

        if (navigator && targetObject && targetObject.screen && targetObject.screen.length > 0) {
            console.log( "跳转目标 passProps = ", passProps);

            let passPropsFinal = {};
            let paramsKeyArray = Object.keys(passProps);// 直接使用这个解析后的 passProps, 会产生莫名奇妙的错误, 稳妥起见, 复制一下
            // 通过 forEach 方法拿到数组中每个元素,将元素与参数的值进行拼接处理,并且放入 paramsArray 中
            paramsKeyArray.forEach(key => passPropsFinal[key] =  passProps[key] );

            navigator.push({
                screen: targetObject.screen,
                title: targetObject.title,
                backButtonHidden: true, // 是否隐藏返回按钮 (可选)
                passProps: passPropsFinal
            });
        }
    } catch( e) {
        console.warn("跳转失败!" + urlStr);
        console.log(e);
    }

}