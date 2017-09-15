/**
 * Created by zhuangzihao on 2017/9/14.
 */
import React, {Component} from 'react';
import {
    View,
    Text
} from 'react-native';


export default class ClearCard extends Component {
    render(){
        return(
            <View>
                <Text>本税期申报纳税结束，记得要将税控清卡或反写，以防下月税控锁死带来的不便；一般纳税人要月内认证发票的，必须在月末之前做认证，否则下月不能做抵扣，造成多缴税款，谢谢您的配合。</Text>
            </View>
        )
    }
}