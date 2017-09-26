/**
 * Created by liufei on 2017/9/26.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';


export default class ClearCard extends Component {
    render(){
        return(
            <View style={styles.wrapper}>
                <Text style={styles.te}>
                    本税期申报纳税结束，记得要将税控清卡或反写，以防下月税控锁死带来不便；一般纳税人要月内认证发票的，必须在月末之前做认证，否则下月不能做抵扣，造成多缴税款，谢谢大家的配合。
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    wrapper:{
        backgroundColor:'#fafafa',
        paddingVertical:20,
        paddingHorizontal:10,
        marginTop:20,
        marginHorizontal:15

    },
    te:{
        fontSize:14,
        color:'#666666',
        lineHeight:18
    }


});