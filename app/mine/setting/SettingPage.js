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
import SubmitButton from '../../view/ui/SubmitButton'
export default class SettingPage extends Component {

    render(){
        return(
            <View style={{flex:1,backgroundColor:'#F9F9F9'}}>
                <ScrollView>
                    <CommentCell
                        leftText = "关于我们"
                        style={{marginTop:10}}
                    />
                    <CommentCell
                        leftText = "意见反馈"
                        onPress={this._feedback.bind(this)}
                    />
                    <CommentCell
                        leftText = "服务条款"
                    />
                    <CommentCell
                        leftText = "清楚缓存"
                        style={{marginTop:10}}
                    />

                    <SubmitButton
                        text='退出登录'
                        isEnabled = {true}
                    />
                </ScrollView>
            </View>

        )
    }

    _feedback(){
        this.props.navigator.push({
            screen: 'FeedbackPage',
        });
    }


}