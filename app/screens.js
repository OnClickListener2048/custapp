// 所有需要通过导航跳转的组件都需要在此文件中注册, 第一个参数为组件别名, 需要唯一
import { Navigation } from 'react-native-navigation';

// 引用外部文件
import LoginPage from './user/LoginPage';
import MessageCenterPage from './message/MessageCenterPage';
import SystemMessagePage from './message/SystemMessagePage';

import ApplicationCenterPage from './aplicationCenter/ApplicationCenterPage';
import Mine from './pilipaMain/PLPMine';
import MyOutSideWorkPage from "./outWork/myOutSideWork/MyOutSideWorkPage";
import MyOutSideTaskPage from "./outWork/myOutSideWork/MyOutSideTaskPage";
import GetLicensePage from  './outWork/getLicense/GetLicensePage';
import MyOutSideWorkItemPage from "./outWork/myOutSideWork/MyOutSideWorkItemPage";
import PersonalInfo from "./pilipaMain/my/PersonalInfo";
import Feedback from "./pilipaMain/my/Feedback";
import About from "./pilipaMain/my/About";
import Settings from "./pilipaMain/my/Settings";
import NoMessage from "./commonView/NoMessage";
import DataTimerView from "./view/DataTimerView";
import AreaPicker from "../picker_demo";
import ImageZoomTest from "../picker_demo/ImageZoomTest";
import MultiTextInputPage from "./outWork/getLicense/view/MultiTextInputPage";
import WatchImageModalPage from "./outWork/getLicense/view/WatchImageModalPage";
import ButtonExample from "../picker_demo/ButtonExample";

export default function () {
    let reg = Navigation.registerComponent;
    reg('AreaPicker', () => AreaPicker);
    reg('demo/ImageZoom', () => ImageZoomTest);
    reg('demo/ButtonExample', () => ButtonExample);
    reg('user.LoginPage', () => LoginPage);
    reg('ApplicationCenterPage', () => ApplicationCenterPage);
    reg('MessageCenterPage', () => MessageCenterPage);
    reg('SystemMessagePage', () => SystemMessagePage);
    reg('Mine', () => Mine);
    reg('MyOutSideWorkPage', () => MyOutSideWorkPage);
    reg('GetLicensePage', () => GetLicensePage);
    reg('MultiTextInputPage', () => MultiTextInputPage);
    reg('MyOutSideWorkItemPage', () => MyOutSideWorkItemPage);
    reg('MyOutSideTaskPage', () => MyOutSideTaskPage);
    reg('NoMessage', () => NoMessage);
    reg('DataTimerView', () => DataTimerView);
    reg('pilipaMain.my.PersonalInfo', () => PersonalInfo);
    reg('pilipaMain.my.Feedback', () => Feedback);
    reg('pilipaMain.my.About', () => About);
    reg('pilipaMain.my.Settings', () => Settings);
    reg('WatchImageModalPage', () => WatchImageModalPage);

}