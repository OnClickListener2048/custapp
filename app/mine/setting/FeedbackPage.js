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

// 意见反馈页
export default class FeedbackPage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            phone: '',// 现在手机号
            newMobile: '', // 新手机号
            newMobileValid: false, // 新手机号有效
            smsCode: '',         // 短信验证码
            smsCodeValid: false,          // 短信验证码有效
            timerButtonClicked: false,//  倒计时按钮是否已点击
            verifyText: '请输入图片验证码',// 图片验证码提示语
            vCode: '',         // 图片验证码
            picURL: null,// 图片验证码
            vCodeInputValid: false,
            device:random(11) // 随机
        };

        this._doChangeVCode = this._doChangeVCode.bind(this);
        this.readUserInfo = this.readUserInfo.bind(this);
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
                                underlineColorAndroid='transparent'
                                style={{fontSize: 14, textAlign: "right", padding: 0, width: DeviceInfo.width / 2}}
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
                                       style={{
                                           fontSize: 14,
                                           textAlign: "right",
                                           padding: 0,
                                           width: DeviceInfo.width / 2
                                       }}
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
                        <TextInput style={{
                            width: DeviceInfo.width - 28,
                            height: 180,
                            fontSize: 14,
                            padding: 5,
                            borderColor: '#999999',
                            borderWidth: 1 / PixelRatio.get(),
                            // borderWidth 为0.5时会出现边框很粗的bug
                            textAlignVertical: 'top'
                        }} underlineColorAndroid='transparent' multiline={true} placeholder="请输入反馈内容促进我们为您更好的服务"/>
                    </View>
                    <SubmitButton
                        text='提交反馈'
                        isEnabled={true}
                    />
                </ScrollView>
            </View>

        )
    }


}