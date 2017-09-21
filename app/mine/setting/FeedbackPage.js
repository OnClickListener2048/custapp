/**
 * Created by zhuangzihao on 2017/9/19.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput
} from 'react-native';
import CommentCell from '../../view/CommenCell'
import SubmitButton from '../../view/SubmitButton'
import BComponent from '../../base';

export default class FeedbackPage extends BComponent {

    render(){
        return(
            <View style={{flex:1,backgroundColor:'#F9F9F9'}}>
                <ScrollView>
                    <CommentCell
                        leftText="称呼"
                        isClick={false}
                        style={{marginTop:10}}
                        rightView={
                            <TextInput
                                placeholder="请输入您的姓名"
                                underlineColorAndroid='transparent'
                                style={{fontSize:14,textAlign:"right",padding:0,width:DeviceInfo.width/2}}
                            />
                        }
                    />
                    <CommentCell
                        leftText="联系方式"
                        isClick={false}
                        rightView={
                            <TextInput placeholder="请输入联系电话便于联系"
                                       underlineColorAndroid='transparent'
                                       style={{fontSize:14,textAlign:"right",padding:0,width:DeviceInfo.width/2}}
                            />
                        }
                    />
                    <CommentCell
                        leftText="留言备注"
                        isClick={false}
                        style={{marginTop:10}}
                        underLine={false}
                    />
                    <View style={{backgroundColor:"white",padding:14,paddingTop:0}}>
                        <TextInput style={{width:DeviceInfo.width-28,height:180,fontSize:14,padding:5,borderColor:'#999999',borderWidth:0.5,textAlignVertical:'top'}}  underlineColorAndroid='transparent'  multiline={true} placeholder="请输入反馈内容促进我们为您更好的服务"  />
                    </View>
                    <SubmitButton
                        text='提交反馈'
                        isEnabled = {true}
                    />
                </ScrollView>
            </View>

        )
    }



}