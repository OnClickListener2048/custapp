/**
 * Created by zhuangzihao on 2017/9/19.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image
} from 'react-native';
import CommentCell from '../../view/CommenCell'
import SectionHeader from '../../view/SectionHeader'

export default class LicenceInfoPage extends Component {

    render(){
        return(
            <View style={{flex:1,backgroundColor:'#F9F9F9'}}>
                <ScrollView>
                    <Image style={{width:DeviceInfo.width}} source={require('../../img/name_bg.png')}/>
                    <SectionHeader
                        title='证件照信息'
                    />
                    <CommentCell
                        leftText = "证照有效期止"
                        rightText = "2017-8-12"
                        style={{marginTop:10}}
                        isClick = {false}
                    />
                    <CommentCell
                        leftText = "年审时间"
                        rightText = "2017-8-12"
                        isClick = {false}
                    />
                </ScrollView>
            </View>

        )
    }



}