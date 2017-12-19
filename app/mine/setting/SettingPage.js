/**
 * Created by zhuangzihao on 2017/9/19.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    DeviceEventEmitter
} from 'react-native';
import CommentCell from '../../view/CommenCell'
import SubmitButton from '../../view/SubmitButton'
import clearManager from 'react-native-clear-cache';
import DeviceInfo from 'react-native-device-info';
import Toast from 'react-native-root-toast'
import BComponent from '../../base';
import Alert from "react-native-alert";
import {H5_URL} from '../../config'
import JPushModule from 'jpush-react-native';

export default class SettingPage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            cacheSize: "",
            unit: "",
            logined: false,// 是否已登陆
        }
    }

    componentDidMount() {
        clearManager.getCacheSize((value, unit) => {
            if(unit == 'B'){
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
            <View style={{flex: 1, backgroundColor: '#F9F9F9'}}>
                <ScrollView>
                    <CommentCell
                        leftText="关于噼里啪"
                        style={{marginTop: 10}}
                        // rightText={"v"+DeviceInfo.getVersion()}
                        onPress={this._aboutUs.bind(this)}
                    />
                    <CommentCell
                        leftText="意见反馈"
                        onPress={this._feedback.bind(this)}
                    />
                    <CommentCell
                        leftText="清除缓存"
                        style={{marginTop: 10}}
                        rightText={this.state.cacheSize + this.state.unit}
                        onPress={this._clear.bind(this)}
                    />

                    <SubmitButton
                        onPress={this._doLogout.bind(this)}
                        text='退出'
                        isEnabled={this.state.logined}
                    />
                </ScrollView>
            </View>

        )
    }

    _clear() {
        clearManager.runClearCache(() => {

            Toast.show("清除成功")
            // setTimeout(function () {
            //     Toast.hide(toast);
            // }, 500);
            this.setState({
                cacheSize: '', //缓存大小
                unit: ''  //缓存单位
            })

        });
    }

    _aboutUs() {
        this.props.navigator.push({
            screen: 'AboutPilipaPage',
            title: '关于噼里啪'
        });
    }

    _feedback() {
        this.push({
            screen: 'FeedbackPage',
            title: '意见反馈',
            backButtonHidden: true, // 是否隐藏返回按钮 (可选)
        });
    }

    // 登出
    _doLogout() {
        Alert.alert('确定退出', '',
            [
                {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {
                    text: '确定',
                    onPress: () => {
                        //删除jpush别名和标签
                        JPushModule.cleanTags(function () {
                            console.log('标签清除成功')
                        })
                        JPushModule.deleteAlias(function () {
                            console.log('别名清除成功')

                        })
                        DeviceEventEmitter.emit('ClearMessage');  //清空消息列表与未读消息数

                        //删除本地存储信息
                        UserInfoStore.removeCompany().then();
                        UserInfoStore.removeCompanyArr().then();
                        UserInfoStore.removeLastUserPhone().then();
                        UserInfoStore.removeUserInfo().then(
                            v => {
                                UserInfoStore.removeCompany().then(
                                    v => {
                                        if (this.props.navigator) {
                                            console.log("popToRoot");
                                            DeviceEventEmitter.emit('ChangeCompany');
                                            this.props.navigator.popToRoot();
                                        }
                                    },
                                    e => {
                                        if (this.props.navigator) {
                                            console.log("popToRoot");
                                            this.props.navigator.popToRoot();
                                        }
                                    }
                                );
                            },
                            e => {
                                if (this.props.navigator) {
                                    console.log("popToRoot");
                                    this.props.navigator.popToRoot();
                                }
                            }
                        );
                    },
                },]
            , {cancelable: false});
    }

}