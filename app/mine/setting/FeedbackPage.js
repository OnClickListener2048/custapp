/**
 * Created by zhuangzihao on 2017/9/19.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    PixelRatio
} from 'react-native';
import CommentCell from '../../view/CommenCell'
import SubmitButton from '../../view/SubmitButton'
import BComponent from '../../base';
import * as apis from '../../apis/feedBack';
import Toast from 'react-native-root-toast';

// 意见反馈页
export default class FeedbackPage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            name: '',// 姓名
            nameValid: false, // 姓名有效
            newMobile: '', // 新手机号
            newMobileValid: false, // 新手机号有效
            content: '',         // 留言内容
            contentValid: false,          // 留言内容有效
        };

        this._doSubmit = this._doSubmit.bind(this);
    }

    // 准备加载组件
    componentWillMount() {
        UserInfoStore.getLastUserPhone().then(
            newMobile => {
                let newMobileValid = newMobile.length > 0 && (newMobile.match(/^([0-9]{11})?$/)) !== null;
                this.setState({newMobile, newMobileValid});
            },
            e => {});
    }

    // 提交反馈意见
    _doSubmit() {
        let loading = SActivityIndicator.show(true, "加载中...");

        apis.submitFeedBack('意见反馈','',this.state.name,this.state.newMobile,this.state.content).then(
            (responseData) => {
                SActivityIndicator.hide(loading);

                Toast.show('留言提交成功', { duration: Toast.durations.LONG, backgroundColor: 'green'});
                this.props.navigator.pop();
            }, (e) => {
                Toast.show(errorText(e));
                SActivityIndicator.hide(loading);
            }
        );

    }


    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#F9F9F9'}}>
                <ScrollView>
                    <CommentCell
                        leftText="称呼"
                        isClick={false}
                        style={{marginTop: 10}}
                        rightView={
                            <TextInput
                                placeholder="请输入您的姓名"
                                maxLength={5}
                                returnKeyType='next'
                                underlineColorAndroid='transparent'
                                style={{fontSize: 14, textAlign: "right", padding: 0, width: DeviceInfo.width / 2}}
                                onChangeText={
                                    (name) => {
                                        let nameValid = name.length > 0 && name.length < 6;
                                        this.setState({name, nameValid});
                                    }
                                }
                            />
                        }
                    />
                    <CommentCell
                        leftText="联系方式"
                        isClick={false}
                        rightView={
                            <TextInput placeholder="请输入联系电话便于联系"
                                       underlineColorAndroid='transparent'
                                       keyboardType='numeric'
                                       value={this.state.newMobile}
                                       style={{
                                           fontSize: 14,
                                           textAlign: "right",
                                           padding: 0,
                                           width: DeviceInfo.width / 2
                                       }}
                                       onChangeText={
                                           (newMobile) => {
                                               newMobile = newMobile.replace(/[^\d]/g, '');// 过滤非数字输入
                                               let newMobileValid = newMobile.length > 0 && (newMobile.match(/^([0-9]{11})?$/)) !== null;
                                               this.setState({newMobile, newMobileValid});
                                           }
                                       }
                            />
                        }
                    />
                    <CommentCell
                        leftText="留言备注"
                        isClick={false}
                        style={{marginTop: 10}}
                        underLine={false}
                    />
                    <View style={{backgroundColor: "white", padding: 14, paddingTop: 0}}>
                        <TextInput maxLength={200} style={{
                            width: DeviceInfo.width - 28,
                            height: 180,
                            fontSize: 14,
                            padding: 5,
                            borderColor: '#999999',
                            borderWidth: 1 / PixelRatio.get(),
                            // borderWidth 为0.5时会出现边框很粗的bug
                            textAlignVertical: 'top'
                        }} underlineColorAndroid='transparent' multiline={true} placeholder="请输入反馈内容促进我们为您更好的服务"
                                   onChangeText={
                                       (content) => {
                                           let contentValid = content.length > 0 && content.length < 201;
                                           this.setState({content, contentValid});
                                       }
                                   }
                        />
                    </View>
                    <SubmitButton
                        text='提交反馈'
                        onPress={() => {
                            this._doSubmit()
                        }}
                        isEnabled={this.state.nameValid && this.state.newMobileValid && this.state.contentValid}
                    />
                </ScrollView>
            </View>
        )
    }

}