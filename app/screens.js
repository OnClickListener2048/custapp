// 所有需要通过导航跳转的组件都需要在此文件中注册, 第一个参数为组件别名, 需要唯一
import { Navigation } from 'react-native-navigation';

// 引用外部文件
import LoginPage from './user/LoginPage';

import HomePage from './home/home/HomePage';
import MessagePage from './message/message/MessagePage';
import MinePage from './mine/mine/MinePage';
import ServicePage from './service/service/ServicePage';
import HomeDetailPage from './home/detail/HomeDetailPage'
import BindPhonePage from './mine/bindPhone/BindPhonePage'


export default function () {
    let reg = Navigation.registerComponent;
    reg('LoginPage', () => LoginPage);
    reg('HomePage', () => HomePage);
    reg('MessagePage', () => MessagePage);
    reg('MinePage', () => MinePage);
    reg('ServicePage', () => ServicePage);
    reg('HomeDetailPage', () => HomeDetailPage);
    reg('BindPhonePage', () => BindPhonePage);

}