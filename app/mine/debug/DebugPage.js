/**
 * 调试标签页.
 * Created by liuchangjiong on 2018/1/29.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,Platform,
    DeviceEventEmitter
} from 'react-native';
import CommentCell from '../../view/CommenCell'
import SubmitButton from '../../view/SubmitButton'
import clearManager from 'react-native-clear-cache';
import DeviceInfo from 'react-native-device-info';
import Toast from 'react-native-root-toast'
import BComponent from '../../base';
import Alert from "react-native-alert";
import {DEBUG,API_BASE_URL} from '../../config'
import JPushModule from 'jpush-react-native';
import ActionSheet from 'react-native-actionsheet';
import SectionHeader from "../../view/SectionHeader";

const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 4;

const options = [
    '取消',
    '线上 www.pilipa.cn',
    '测试 x-www.i-counting.cn',
    '清除设置'
];

const title = '请选择要切换的服务器, 切换后请重启App';

export default class DebugPage extends BComponent {

    static navigatorStyle = {
        navBarHidden: false, // 隐藏默认的顶部导航栏
        tabBarHidden: false, // 默认隐藏底部标签栏
    };

    constructor(props) {
        super(props);
        this.state = {
            cacheSize: "",
            unit: "",
            logined: false,// 是否已登陆
            updateIcon:this.props.updateIcon,
        };

        this.props.navigator.setButtons({
            leftButtons: [
                ], // see "Adding buttons to the navigator" below for format (optional)
            // rightButtons: [], // see "Adding buttons to the navigator" below for format (optional)
            animated: false // does the change have transition animation or does it happen immediately (optional)
        });

        this._updateOpenOrClose = this._updateOpenOrClose.bind(this);
        this._httpLogViewDetail = this._httpLogViewDetail.bind(this);

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    componentDidMount() {

        clearManager.getCacheSize((value, unit) => {
            if(unit === 'B'){
                this.setState({
                    cacheSize: '', //缓存大小
                    unit: ''  //缓存单位
                })
            }else{
                this.setState({
                    cacheSize: value, //缓存大小
                    unit: unit  //缓存单位
                })
            }
        });

        UserInfoStore.isLogined().then(
            logined => {
                this.setState({logined: logined});
            },
            e => {
                console.log("读取登陆状态错误:", e);
            }
        );
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#F1F1F1'}}>
                <ScrollView>

                    <Text style={{color: 'red', margin: 5}}>此页面存放调试相关的功能, 正式包中将不会出现此标签页</Text>
                    <CommentCell
                        leftText="清除缓存"
                        style={{marginTop: 10}}
                        rightText={this.state.cacheSize + this.state.unit}
                        onPress={this._clear.bind(this)}
                    />

                    <SectionHeader style={{backgroundColor:'#E8E2D6'}} text ={'服务器域名'} textStyle={{color:'#AE915A'}} />
                    <CommentCell
                        leftText={API_BASE_URL}
                        style={{marginTop: 10}}
                        rightText='点击切换'
                        onPress={this.showActionSheet}
                    />

                    <ActionSheet
                        ref={o => this.ActionSheet = o}
                        title={title}
                        options={options}
                        cancelButtonIndex={CANCEL_INDEX}
                        destructiveButtonIndex={DESTRUCTIVE_INDEX}
                        onPress={this.handleActionSheetPress}
                    />

                    <CommentCell
                        leftText='查看HTTP接口请求日志'
                        style={{marginTop: 10}}
                        onPress={this._httpLogView.bind(this)}
                    />

                </ScrollView>
            </View>

        )
    }

    _clear() {
        clearManager.runClearCache(() => {

            Toast.show("清除成功");
            // setTimeout(function () {
            //     Toast.hide(toast);
            // }, 500);
            this.setState({
                cacheSize: '', //缓存大小
                unit: ''  //缓存单位
            })

        });
    }


    // 打开域名切换
    showActionSheet = () => {
        this.ActionSheet.show();
    };

    // 处理域名切换
    handleActionSheetPress = (i) => {
        console.log(i);
        try {
            if (i === 1) {
                Preferences.set('CONFIG_SERVER', 'https://www.pilipa.cn').then();
            } else if (i === 2) {
                Preferences.set('CONFIG_SERVER', 'https://x-www.i-counting.cn').then();
            } else if (i === 2) {
                Preferences.remove('CONFIG_SERVER').then();
            }

            if (i !== 0) {
                Toast.show("请手动重启App来使切换后的域名配置生效");
            }
        } catch (e) {
            Toast.show("切换失败, 出错了");
        }
    };

    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        super.onNavigatorEvent(event);
        console.log('ApplicationCenterPage event.type', event.type+","+event.id);
            let callback = this.props.callback;
            if(callback) {
                callback(this.state.updateIcon);
            }
    }

    _aboutUs() {
        this.push({
            screen: 'AboutPilipaPage',
            title: '关于噼里啪',
            passProps: {
                updateIcon:this.state.updateIcon,
                //回调!
                callback: this._updateOpenOrClose,
            }
        });
    }

    _updateOpenOrClose(updateIcon){

        if(updateIcon!=null){
            console.log("返回是否点击过更新按钮="+updateIcon);
            this.setState({updateIcon: updateIcon,});

        }

    }

    _httpLogView() {
        this.push({
            screen: 'HttpLogView',
            title: 'HTTP网络请求',
            backButtonHidden: false, // 是否隐藏返回按钮 (可选)
            passProps: {
                //回调!
                onHttpLogPress: this._httpLogViewDetail,
            }
        });
    }

    _httpLogViewDetail(data) {
        console.log('_httpLogViewDetail', data);

        this.push({
            screen: 'HttpLogDetailPage',
            title: 'HTTP数据详情',
            backButtonHidden: false, // 是否隐藏返回按钮 (可选)
            passProps: {
                data:data
            }
        });
    }

}