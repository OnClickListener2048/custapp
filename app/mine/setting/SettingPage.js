/**
 * Created by zhuangzihao on 2017/9/19.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import CommentCell from '../../view/CommenCell'
import SubmitButton from '../../view/SubmitButton'
import clearManager from 'react-native-clear-cache';
import Toast from 'react-native-root-toast'
import BComponent from '../../base';
import Alert from "react-native-alert";

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
                        leftText="关于我们"
                        style={{marginTop: 10}}
                        onPress={this._aboutUs.bind(this)}
                    />
                    <CommentCell
                        leftText="意见反馈"
                        onPress={this._feedback.bind(this)}
                    />
                    <CommentCell
                        leftText="服务条款"
                        onPress={this._serviceTerm.bind(this)}
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
            this.setState({
                cacheSize: '', //缓存大小
                unit: ''  //缓存单位
            })

        });
    }

    _aboutUs() {
        this.props.navigator.push({
            screen: 'AboutUsPage',
            title: '关于我们'
        });
    }

    _feedback() {
        this.props.navigator.push({
            screen: 'FeedbackPage',
            title: '意见反馈'
        });
    }

    _serviceTerm(){
        this.props.navigator.push({
            screen: 'ServiceTermPage',
            title: '服务条款'
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
                        UserInfoStore.removeUserInfo().then(
                            v => {
                                UserInfoStore.removeCompany().then(
                                    v => {
                                        if (this.props.navigator) {
                                            console.log("popToRoot");
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