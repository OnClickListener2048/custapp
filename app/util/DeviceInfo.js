/**
 * Created by zhuangzihao on 2017/9/12.
 */
import {Dimensions, Platform,PixelRatio}from 'react-native'
const DeviceInfo = {
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height,
    OS:Platform.OS,
    onePR: 1 / PixelRatio.get(),

};
global.DeviceInfo = DeviceInfo;// 全局可用