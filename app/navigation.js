
import {Navigation} from 'react-native-navigation';

import {DEFAULT_NAVIGATOR_STYLE as navigatorStyle, tabsStyle, appStyle } from './config';
import registerScreens from './screens';

// screen related book keeping
registerScreens();

// 主标签
const tabsMain = [{
    label: '消息',
    screen: 'MessageCenterPage',
    icon: require('./img/message.png'),
    selectedIcon: require('./img/message_red.png'),
    title: '消息中心',
    navigatorStyle
}, {
    label: '应用',
    screen: 'ApplicationCenterPage',
    icon: require('./img/application.png'),
    selectedIcon: require('./img/application_red.png'),
    title: '应用中心',
    navigatorStyle
},
    {
        label: '我的',
        screen: 'Mine',
        icon: require('./img/account.png'),
        selectedIcon: require('./img/account_red.png'),
        title: '我的',
        navigatorStyle,
        // navigatorButtons: {}
    }
];

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
            screen: 'user.LoginPage',
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
        animationType: 'fade',
        portraitOnlyMode: true,
    });

}