import {Navigation} from 'react-native-navigation';

import {DEFAULT_NAVIGATOR_STYLE as navigatorStyle, tabsStyle, appStyle, DEBUG} from './config';
import registerScreens from './screens';
import DebugPage from "./mine/debug/DebugPage";

// screen related book keeping
registerScreens();

// 主标签
const tabsMain = [
    {
        label: '首页',
        screen: 'HomePage',
        icon: require('./img/home_normal.png'),
        selectedIcon: require('./img/home_selected.png'),
        title: '首页',
        navigatorStyle
    },
    {
        label: '公司',
        screen: 'ServicePage',
        icon: require('./img/service_normal.png'),
        selectedIcon: require('./img/service_selected.png'),
        title: '公司',
        navigatorStyle
    },
    {
        label: '消息',
        screen: 'MessagePage',
        icon: require('./img/message_normal.png'),
        selectedIcon: require('./img/message_selected.png'),
        title: '消息',
        isIntercept:true,
        navigatorStyle
    },
    {
        label: '我的',
        screen: 'MinePage',
        icon: require('./img/mine_normal.png'),
        selectedIcon: require('./img/mine_selected.png'),
        title: '我的',
        isIntercept:true,//添加iOS拦截tabbar点击拦截，true为拦截，配合基类event.id === 'bottomTabSelected使用
        navigatorStyle,
    },
];

// 调试选项
if(DEBUG) {
    tabsMain.push(
        {
            label: '调试',
            screen: 'DebugPage',
            icon: require('./img/debug.png'),
            title: '调试页面',
            isIntercept:false,//添加iOS拦截tabbar点击拦截，true为拦截，配合基类event.id === 'bottomTabSelected使用
            navigatorStyle,
        }
    );
}

// 转到初始化页面 main.LaunchPage
// export function navToBootstrap({isReset = false} = {}) {
//   Navigation.startSingleScreenApp({
//     screen: {
//       screen: 'main.LaunchPage',
//         navigatorStyle
//     },
//     passProps: {
//       isReset,
//     },
//     portraitOnlyMode: true,
//   });
// }

// 转到登录页面
export function navToLogin({isReset = false} = {}) {
    Navigation.startSingleScreenApp({
        screen: {
            screen: 'LoginPage',
        },
        passProps: {
            isReset,
        },
        portraitOnlyMode: true,
    });
}

// 转到主Tab页
export function navToMainTab() {
    Navigation.startTabBasedApp({
        tabs: tabsMain,
        tabsStyle,
        appStyle,
        ceshi:1,
        animationType: 'fade',
        portraitOnlyMode: true,
    });

}